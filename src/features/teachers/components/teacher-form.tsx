'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Plus, Save, Trash2, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { PageHeader } from '@/components/layout/page-header';
import { DashboardErrorState } from '@/components/shared/dashboard-state';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { teacherSchema } from '@/features/teachers/schemas';
import {
  TeacherConflictError,
  teacherService,
} from '@/features/teachers/services';
import type { TeacherService } from '@/features/teachers/services';
import {
  employmentTypes,
  teacherStatuses,
  teacherSubjects,
} from '@/features/teachers/types';
import type { Teacher, TeacherFormValues } from '@/features/teachers/types';
import { classMocks } from '@/mocks/classes';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

const today = '2026-09-07';
const labels = {
  active: 'Active',
  'on-leave': 'On leave',
  inactive: 'Inactive',
} as const;
const employmentLabels = {
  'full-time': 'Full time',
  'part-time': 'Part time',
  contract: 'Contract',
} as const;

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  ) : null;
}

function valuesFor(teacher: Teacher): TeacherFormValues {
  return {
    employeeId: teacher.employeeId,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    photoUrl: teacher.photoUrl,
    email: teacher.email,
    phone: teacher.phone,
    campusId: teacher.campusId,
    qualification: teacher.qualification,
    specialization: teacher.specialization,
    joiningDate: teacher.joiningDate,
    employmentType: teacher.employmentType,
    status: teacher.status,
    assignments: teacher.assignments.map(({ classSectionId, subject }) => ({
      classSectionId,
      subject,
    })),
  };
}

function TeacherForm({
  teacher,
  service,
}: {
  teacher?: Teacher;
  service: TeacherService;
}) {
  const router = useRouter();
  const selectedCampusId = useAppSelector(selectSelectedCampusId);
  const defaultCampus = selectedCampusId === 'all' ? 'north' : selectedCampusId;
  const [confirmLeave, setConfirmLeave] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher
      ? valuesFor(teacher)
      : {
          employeeId: '',
          firstName: '',
          lastName: '',
          photoUrl: '',
          email: '',
          phone: '',
          campusId: defaultCampus,
          qualification: '',
          specialization: '',
          joiningDate: today,
          employmentType: 'full-time',
          status: 'active',
          assignments: [
            {
              classSectionId:
                classMocks.find((item) => item.campusId === defaultCampus)
                  ?.id ?? '',
              subject: 'Mathematics',
            },
          ],
        },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assignments',
  });
  const campusId = watch('campusId');
  const availableClasses = classMocks.filter(
    (item) => item.campusId === campusId,
  );
  const destination = teacher
    ? `/school-admin/teachers/${teacher.id}`
    : '/school-admin/teachers';

  useEffect(() => {
    const prevent = (event: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [isDirty, isSubmitting]);

  const onSubmit = async (values: TeacherFormValues) => {
    try {
      const saved = teacher
        ? await service.update(teacher.id, values)
        : await service.create(values);
      router.push(`/school-admin/teachers/${saved.id}`);
    } catch (error) {
      if (error instanceof TeacherConflictError) {
        setError('employeeId', { message: error.message });
        return;
      }
      setError('root.server', {
        message:
          error instanceof Error
            ? error.message
            : 'The teacher could not be saved.',
      });
    }
  };

  return (
    <>
      <form noValidate className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.server?.message ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to save teacher</AlertTitle>
            <AlertDescription>{errors.root.server.message}</AlertDescription>
          </Alert>
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>Teacher information</CardTitle>
            <CardDescription>
              Identity and contact details used across staff records.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="teacher-first-name">First name</Label>
              <Input
                id="teacher-first-name"
                {...register('firstName')}
                aria-invalid={!!errors.firstName}
              />
              <FieldError message={errors.firstName?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-last-name">Last name</Label>
              <Input
                id="teacher-last-name"
                {...register('lastName')}
                aria-invalid={!!errors.lastName}
              />
              <FieldError message={errors.lastName?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-employee-id">Employee ID</Label>
              <Input
                id="teacher-employee-id"
                className="font-mono uppercase"
                placeholder="CRA-T-011"
                {...register('employeeId', {
                  setValueAs: (value: string) => value.toUpperCase(),
                })}
                aria-invalid={!!errors.employeeId}
              />
              <FieldError message={errors.employeeId?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-email">Work email</Label>
              <Input
                id="teacher-email"
                type="email"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              <FieldError message={errors.email?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-phone">Phone</Label>
              <Input
                id="teacher-phone"
                {...register('phone')}
                aria-invalid={!!errors.phone}
              />
              <FieldError message={errors.phone?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-photo">Photo URL (optional)</Label>
              <Input
                id="teacher-photo"
                type="url"
                {...register('photoUrl')}
                aria-invalid={!!errors.photoUrl}
              />
              <FieldError message={errors.photoUrl?.message} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Employment</CardTitle>
            <CardDescription>
              Campus placement, credentials, and current status.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="teacher-campus">Campus</Label>
              <NativeSelect id="teacher-campus" {...register('campusId')}>
                <NativeSelectOption value="north">
                  North Campus
                </NativeSelectOption>
                <NativeSelectOption value="central">
                  Central Campus
                </NativeSelectOption>
                <NativeSelectOption value="south">
                  South Campus
                </NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-qualification">Qualification</Label>
              <Input
                id="teacher-qualification"
                placeholder="M.Ed, University of Punjab"
                {...register('qualification')}
                aria-invalid={!!errors.qualification}
              />
              <FieldError message={errors.qualification?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-specialization">Specialization</Label>
              <Input
                id="teacher-specialization"
                {...register('specialization')}
                aria-invalid={!!errors.specialization}
              />
              <FieldError message={errors.specialization?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-joining-date">Joining date</Label>
              <Input
                id="teacher-joining-date"
                type="date"
                max={today}
                {...register('joiningDate')}
              />
              <FieldError message={errors.joiningDate?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-employment">Employment type</Label>
              <NativeSelect
                id="teacher-employment"
                {...register('employmentType')}
              >
                {employmentTypes.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {employmentLabels[value]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-form-status">Status</Label>
              <NativeSelect id="teacher-form-status" {...register('status')}>
                {teacherStatuses.map((value) => (
                  <NativeSelectOption key={value} value={value}>
                    {labels[value]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Subject and class assignments</CardTitle>
              <CardDescription className="mt-1">
                Pair each class section with the subject this teacher delivers.
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({
                  classSectionId: availableClasses[0]?.id ?? '',
                  subject: 'Mathematics',
                })
              }
            >
              <Plus /> Add assignment
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            {fields.map((field, index) => (
              <div
                className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                key={field.id}
              >
                <div className="grid gap-2">
                  <Label htmlFor={`assignment-class-${index}`}>
                    Class section
                  </Label>
                  <NativeSelect
                    id={`assignment-class-${index}`}
                    aria-label={`Assignment ${index + 1} class section`}
                    {...register(`assignments.${index}.classSectionId`)}
                  >
                    {availableClasses.map((item) => (
                      <NativeSelectOption key={item.id} value={item.id}>
                        {item.gradeName} · Section {item.section} · {item.room}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  <FieldError
                    message={
                      errors.assignments?.[index]?.classSectionId?.message
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`assignment-subject-${index}`}>Subject</Label>
                  <NativeSelect
                    id={`assignment-subject-${index}`}
                    aria-label={`Assignment ${index + 1} subject`}
                    {...register(`assignments.${index}.subject`)}
                  >
                    {teacherSubjects.map((subject) => (
                      <NativeSelectOption key={subject} value={subject}>
                        {subject}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove assignment ${index + 1}`}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
            <FieldError message={errors.assignments?.root?.message} />
          </CardContent>
        </Card>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() =>
              isDirty ? setConfirmLeave(true) : router.push(destination)
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <Save />}
            {teacher ? 'Save changes' : 'Create teacher'}
          </Button>
        </div>
      </form>
      <AlertDialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <TriangleAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your changes to this teacher record will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push(destination)}>
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function TeacherFormPage({
  teacherId,
  service = teacherService,
}: {
  teacherId?: string;
  service?: TeacherService;
}) {
  const [teacher, setTeacher] = useState<Teacher | undefined>();
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(
    teacherId ? 'loading' : 'ready',
  );
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!teacherId) return;
    let active = true;
    setState('loading');
    service
      .get(teacherId)
      .then((data) => {
        if (active) {
          setTeacher(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [service, teacherId, version]);
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Staff management"
        title={teacherId ? 'Edit teacher' : 'Add teacher'}
        description="Maintain staff credentials and assign subjects to specific class sections."
      />
      {state === 'loading' ? (
        <>
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </>
      ) : null}
      {state === 'error' ? (
        <DashboardErrorState
          message="We could not load this teacher record."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : null}
      {state === 'ready' ? (
        <TeacherForm
          key={teacher?.id ?? 'new'}
          teacher={teacher}
          service={service}
        />
      ) : null}
    </div>
  );
}
