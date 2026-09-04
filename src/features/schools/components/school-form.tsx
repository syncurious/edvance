'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { PageHeader } from '@/components/layout/page-header';
import { DashboardErrorState } from '@/components/shared/dashboard-state';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { schoolSchema } from '@/features/schools/schemas';
import {
  SchoolConflictError,
  schoolService,
} from '@/features/schools/services';
import type { SchoolService } from '@/features/schools/services';
import type { School, SchoolFormValues } from '@/features/schools/types';
import { schoolPlans, schoolStatuses } from '@/features/schools/types';
import { schoolStatusLabels } from '@/features/schools/components/school-status';

const emptyValues: SchoolFormValues = {
  name: '',
  code: '',
  email: '',
  phone: '',
  address: '',
  logoUrl: '',
  plan: 'Starter',
  status: 'trial',
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  ) : null;
}

function SchoolFormFields({
  school,
  service,
}: {
  school?: School;
  service: SchoolService;
}) {
  const router = useRouter();
  const isEditing = Boolean(school);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: school
      ? {
          name: school.name,
          code: school.code,
          email: school.email,
          phone: school.phone,
          address: school.address,
          logoUrl: school.logoUrl,
          plan: school.plan,
          status: school.status,
        }
      : emptyValues,
  });

  async function onSubmit(values: SchoolFormValues) {
    try {
      const saved = school
        ? await service.update(school.id, values)
        : await service.create(values);
      toast.add({
        title: isEditing ? 'School updated' : 'School created',
        description: `${saved.name} is ready in the school directory.`,
        type: 'success',
      });
      router.push(`/super-admin/schools/${saved.id}`);
    } catch (error) {
      if (error instanceof SchoolConflictError) {
        setError(error.field, { message: error.message });
        return;
      }
      setError('root.server', {
        message:
          error instanceof Error
            ? error.message
            : 'The school could not be saved. Try again.',
      });
    }
  }

  return (
    <form noValidate className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.server?.message ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Unable to save school</AlertTitle>
          <AlertDescription>{errors.root.server.message}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>School information</CardTitle>
          <CardDescription>
            Core identity and contact details used across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="school-name">School name</Label>
            <Input
              id="school-name"
              autoComplete="organization"
              placeholder="Crescent Academy"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'school-name-error' : undefined}
              {...register('name')}
            />
            <FieldError id="school-name-error" message={errors.name?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="school-code">School code</Label>
            <Input
              id="school-code"
              className="font-mono uppercase"
              placeholder="CRA-001"
              aria-invalid={errors.code ? true : undefined}
              aria-describedby={errors.code ? 'school-code-error' : undefined}
              {...register('code', {
                setValueAs: (value: string) => value.toUpperCase(),
              })}
            />
            <FieldError id="school-code-error" message={errors.code?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="school-email">Email address</Label>
            <Input
              id="school-email"
              type="email"
              autoComplete="email"
              placeholder="admin@school.edu.pk"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'school-email-error' : undefined}
              {...register('email')}
            />
            <FieldError
              id="school-email-error"
              message={errors.email?.message}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="school-phone">Phone</Label>
            <Input
              id="school-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+92 51 123 4567"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'school-phone-error' : undefined}
              {...register('phone')}
            />
            <FieldError
              id="school-phone-error"
              message={errors.phone?.message}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="school-logo">Logo URL (optional)</Label>
            <Input
              id="school-logo"
              type="url"
              autoComplete="url"
              placeholder="https://school.edu.pk/logo.png"
              aria-invalid={errors.logoUrl ? true : undefined}
              aria-describedby={
                errors.logoUrl ? 'school-logo-error' : undefined
              }
              {...register('logoUrl')}
            />
            <FieldError
              id="school-logo-error"
              message={errors.logoUrl?.message}
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="school-address">Address</Label>
            <Textarea
              id="school-address"
              autoComplete="street-address"
              placeholder="Street, city, and province"
              aria-invalid={errors.address ? true : undefined}
              aria-describedby={
                errors.address ? 'school-address-error' : undefined
              }
              {...register('address')}
            />
            <FieldError
              id="school-address-error"
              message={errors.address?.message}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan and access</CardTitle>
          <CardDescription>
            Choose the subscription tier and current workspace status.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="school-plan">Subscription plan</Label>
            <NativeSelect
              id="school-plan"
              className="w-full"
              aria-invalid={errors.plan ? true : undefined}
              {...register('plan')}
            >
              {schoolPlans.map((plan) => (
                <NativeSelectOption key={plan} value={plan}>
                  {plan}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="school-status">Status</Label>
            <NativeSelect
              id="school-status"
              className="w-full"
              aria-invalid={errors.status ? true : undefined}
              {...register('status')}
            >
              {schoolStatuses.map((status) => (
                <NativeSelectOption key={status} value={status}>
                  {schoolStatusLabels[status]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          nativeButton={false}
          render={
            <Link
              href={
                school
                  ? `/super-admin/schools/${school.id}`
                  : '/super-admin/schools'
              }
            />
          }
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? <Spinner /> : <Save />}
          {isSubmitting
            ? 'Saving…'
            : isEditing
              ? 'Save changes'
              : 'Create school'}
        </Button>
      </div>
    </form>
  );
}

function FormLoading() {
  return (
    <Card aria-label="Loading school form">
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="grid gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SchoolFormPage({
  schoolId,
  service = schoolService,
}: {
  schoolId?: string;
  service?: SchoolService;
}) {
  const [school, setSchool] = useState<School | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(
    schoolId ? 'loading' : 'ready',
  );
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!schoolId) return;
    let active = true;
    setState('loading');
    service
      .get(schoolId)
      .then((result) => {
        if (!active) return;
        setSchool(result);
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
      });
    return () => {
      active = false;
    };
  }, [requestVersion, schoolId, service]);

  const editing = Boolean(schoolId);

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6">
      <PageHeader
        eyebrow="School management"
        title={editing ? 'Edit school' : 'Add school'}
        description={
          editing
            ? 'Update the school workspace details and access settings.'
            : 'Create a school workspace that is ready for administrators and enrollment.'
        }
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link
                href={
                  school
                    ? `/super-admin/schools/${school.id}`
                    : '/super-admin/schools'
                }
              />
            }
          >
            <ArrowLeft /> Back
          </Button>
        }
      />

      {state === 'loading' ? (
        <FormLoading />
      ) : state === 'error' ? (
        <DashboardErrorState
          message="This school could not be loaded for editing."
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
      ) : (
        <SchoolFormFields school={school ?? undefined} service={service} />
      )}
    </div>
  );
}
