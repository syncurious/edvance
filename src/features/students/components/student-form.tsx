'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, Save, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { studentSchema } from '@/features/students/schemas';
import {
  StudentConflictError,
  studentService,
} from '@/features/students/services';
import type { StudentService } from '@/features/students/services';
import {
  studentClasses,
  studentGenders,
  studentSections,
  studentStatuses,
} from '@/features/students/types';
import type { Student, StudentFormValues } from '@/features/students/types';
import { studentStatusLabels } from '@/features/students/components/student-status';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

const today = '2026-09-05';

function emptyValues(
  campusId: 'north' | 'central' | 'south',
): StudentFormValues {
  return {
    admissionId: '',
    firstName: '',
    lastName: '',
    photoUrl: '',
    dateOfBirth: '',
    gender: 'female',
    campusId,
    className: 'Grade 5',
    section: 'A',
    rollNumber: '',
    status: 'active',
    admissionDate: today,
    address: '',
    bloodGroup: 'A+',
    house: '',
    previousSchool: '',
    parentName: '',
    parentRelationship: 'Father',
    parentEmail: '',
    parentPhone: '',
    parentOccupation: '',
  };
}

function studentValues(student: Student): StudentFormValues {
  return {
    admissionId: student.admissionId,
    firstName: student.firstName,
    lastName: student.lastName,
    photoUrl: student.photoUrl,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    campusId: student.campusId,
    className: student.className,
    section: student.section,
    rollNumber: student.rollNumber,
    status: student.status,
    admissionDate: student.admissionDate,
    address: student.address,
    bloodGroup: student.bloodGroup,
    house: student.house,
    previousSchool:
      student.previousSchool === '—' ? '' : student.previousSchool,
    parentName: student.parent.name,
    parentRelationship: student.parent.relationship,
    parentEmail: student.parent.email,
    parentPhone: student.parent.phone,
    parentOccupation: student.parent.occupation,
  };
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  ) : null;
}

function StudentFormFields({
  student,
  service,
}: {
  student?: Student;
  service: StudentService;
}) {
  const router = useRouter();
  const selectedCampusId = useAppSelector(selectSelectedCampusId);
  const defaultCampus = selectedCampusId === 'all' ? 'north' : selectedCampusId;
  const [leaveDestination, setLeaveDestination] = useState<string | null>(null);
  const destination = student
    ? `/school-admin/students/${student.id}`
    : '/school-admin/students';
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: student
      ? studentValues(student)
      : emptyValues(defaultCampus),
  });

  useEffect(() => {
    function preventUnsavedExit(event: BeforeUnloadEvent) {
      if (!isDirty || isSubmitting) return;
      event.preventDefault();
      event.returnValue = '';
    }
    function preventLinkNavigation(event: MouseEvent) {
      if (
        !isDirty ||
        isSubmitting ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.origin !== location.origin)
        return;
      event.preventDefault();
      event.stopPropagation();
      setLeaveDestination(`${link.pathname}${link.search}${link.hash}`);
    }
    window.addEventListener('beforeunload', preventUnsavedExit);
    document.addEventListener('click', preventLinkNavigation, true);
    return () => {
      window.removeEventListener('beforeunload', preventUnsavedExit);
      document.removeEventListener('click', preventLinkNavigation, true);
    };
  }, [isDirty, isSubmitting]);

  async function onSubmit(values: StudentFormValues) {
    try {
      const saved = student
        ? await service.update(student.id, values)
        : await service.create(values);
      toast.add({
        title: student ? 'Student updated' : 'Student created',
        description: `${saved.firstName} ${saved.lastName} is ready in the student directory.`,
        type: 'success',
      });
      router.push(`/school-admin/students/${saved.id}`);
    } catch (error) {
      if (error instanceof StudentConflictError) {
        setError('admissionId', { message: error.message });
        return;
      }
      setError('root.server', {
        message:
          error instanceof Error
            ? error.message
            : 'The student could not be saved. Try again.',
      });
    }
  }

  return (
    <>
      <form noValidate className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.server?.message ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to save student</AlertTitle>
            <AlertDescription>{errors.root.server.message}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Student information</CardTitle>
            <CardDescription>
              Identity and personal details used throughout the school record.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="student-first-name">First name</Label>
              <Input
                id="student-first-name"
                autoComplete="given-name"
                aria-invalid={errors.firstName ? true : undefined}
                {...register('firstName')}
              />
              <FieldError
                id="student-first-name-error"
                message={errors.firstName?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-last-name">Last name</Label>
              <Input
                id="student-last-name"
                autoComplete="family-name"
                aria-invalid={errors.lastName ? true : undefined}
                {...register('lastName')}
              />
              <FieldError
                id="student-last-name-error"
                message={errors.lastName?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-id">Admission ID</Label>
              <Input
                id="student-id"
                className="font-mono uppercase"
                placeholder="CRA-2026-0150"
                aria-invalid={errors.admissionId ? true : undefined}
                {...register('admissionId', {
                  setValueAs: (value: string) => value.toUpperCase(),
                })}
              />
              <FieldError
                id="student-id-error"
                message={errors.admissionId?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-photo">Photo URL (optional)</Label>
              <Input
                id="student-photo"
                type="url"
                placeholder="https://example.com/photo.jpg"
                aria-invalid={errors.photoUrl ? true : undefined}
                {...register('photoUrl')}
              />
              <FieldError
                id="student-photo-error"
                message={errors.photoUrl?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-birth-date">Date of birth</Label>
              <Input
                id="student-birth-date"
                type="date"
                max={today}
                aria-invalid={errors.dateOfBirth ? true : undefined}
                {...register('dateOfBirth')}
              />
              <FieldError
                id="student-birth-date-error"
                message={errors.dateOfBirth?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-gender">Gender</Label>
              <NativeSelect
                id="student-gender"
                className="w-full"
                {...register('gender')}
              >
                {studentGenders.map((gender) => (
                  <NativeSelectOption key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment</CardTitle>
            <CardDescription>
              Campus placement, class, section, and current enrollment status.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="student-campus">Campus</Label>
              <NativeSelect
                id="student-campus"
                className="w-full"
                {...register('campusId')}
              >
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
              <Label htmlFor="student-class">Class</Label>
              <NativeSelect
                id="student-class"
                className="w-full"
                {...register('className')}
              >
                {studentClasses.map((item) => (
                  <NativeSelectOption key={item} value={item}>
                    {item}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-section">Section</Label>
              <NativeSelect
                id="student-section"
                className="w-full"
                {...register('section')}
              >
                {studentSections.map((item) => (
                  <NativeSelectOption key={item} value={item}>
                    Section {item}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-roll">Roll number</Label>
              <Input
                id="student-roll"
                placeholder="05-A-150"
                aria-invalid={errors.rollNumber ? true : undefined}
                {...register('rollNumber')}
              />
              <FieldError
                id="student-roll-error"
                message={errors.rollNumber?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-admission-date">Admission date</Label>
              <Input
                id="student-admission-date"
                type="date"
                max={today}
                aria-invalid={errors.admissionDate ? true : undefined}
                {...register('admissionDate')}
              />
              <FieldError
                id="student-admission-date-error"
                message={errors.admissionDate?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-status">Status</Label>
              <NativeSelect
                id="student-status"
                className="w-full"
                {...register('status')}
              >
                {studentStatuses.map((status) => (
                  <NativeSelectOption key={status} value={status}>
                    {studentStatusLabels[status]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional information</CardTitle>
            <CardDescription>
              Health, house, address, and prior-school context.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="student-blood-group">Blood group</Label>
              <NativeSelect
                id="student-blood-group"
                className="w-full"
                {...register('bloodGroup')}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                  (group) => (
                    <NativeSelectOption key={group} value={group}>
                      {group}
                    </NativeSelectOption>
                  ),
                )}
              </NativeSelect>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-house">House</Label>
              <Input
                id="student-house"
                placeholder="Iqbal"
                aria-invalid={errors.house ? true : undefined}
                {...register('house')}
              />
              <FieldError
                id="student-house-error"
                message={errors.house?.message}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="student-previous-school">
                Previous school (optional)
              </Label>
              <Input
                id="student-previous-school"
                {...register('previousSchool')}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="student-address">Home address</Label>
              <Textarea
                id="student-address"
                autoComplete="street-address"
                aria-invalid={errors.address ? true : undefined}
                {...register('address')}
              />
              <FieldError
                id="student-address-error"
                message={errors.address?.message}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parent or guardian</CardTitle>
            <CardDescription>
              Primary contact and emergency communication details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="parent-name">Full name</Label>
              <Input
                id="parent-name"
                autoComplete="name"
                aria-invalid={errors.parentName ? true : undefined}
                {...register('parentName')}
              />
              <FieldError
                id="parent-name-error"
                message={errors.parentName?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent-relationship">Relationship</Label>
              <Input
                id="parent-relationship"
                placeholder="Father"
                aria-invalid={errors.parentRelationship ? true : undefined}
                {...register('parentRelationship')}
              />
              <FieldError
                id="parent-relationship-error"
                message={errors.parentRelationship?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent-email">Email</Label>
              <Input
                id="parent-email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.parentEmail ? true : undefined}
                {...register('parentEmail')}
              />
              <FieldError
                id="parent-email-error"
                message={errors.parentEmail?.message}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent-phone">Phone</Label>
              <Input
                id="parent-phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={errors.parentPhone ? true : undefined}
                {...register('parentPhone')}
              />
              <FieldError
                id="parent-phone-error"
                message={errors.parentPhone?.message}
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="parent-occupation">Occupation</Label>
              <Input
                id="parent-occupation"
                aria-invalid={errors.parentOccupation ? true : undefined}
                {...register('parentOccupation')}
              />
              <FieldError
                id="parent-occupation-error"
                message={errors.parentOccupation?.message}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() =>
              isDirty
                ? setLeaveDestination(destination)
                : router.push(destination)
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : <Save />}
            {isSubmitting
              ? 'Saving…'
              : student
                ? 'Save changes'
                : 'Create student'}
          </Button>
        </div>
      </form>

      <AlertDialog
        open={leaveDestination !== null}
        onOpenChange={(open) => {
          if (!open) setLeaveDestination(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-warning text-warning-foreground">
              <TriangleAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your changes have not been saved. Leaving now will discard them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                router.push(leaveDestination ?? destination);
                setLeaveDestination(null);
              }}
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function FormLoading() {
  return (
    <Card aria-label="Loading student form">
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="grid gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function StudentFormPage({
  studentId,
  service = studentService,
}: {
  studentId?: string;
  service?: StudentService;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(
    studentId ? 'loading' : 'ready',
  );
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!studentId) return;
    let active = true;
    setState('loading');
    service
      .get(studentId)
      .then((result) => {
        if (!active) return;
        setStudent(result);
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
      });
    return () => {
      active = false;
    };
  }, [requestVersion, service, studentId]);

  const editing = Boolean(studentId);
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6">
      <PageHeader
        eyebrow="Student management"
        title={editing ? 'Edit student' : 'Add student'}
        description={
          editing
            ? 'Update the learner’s enrollment, personal, and guardian information.'
            : 'Create a complete learner record for the selected school workspace.'
        }
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link
                href={
                  student
                    ? `/school-admin/students/${student.id}`
                    : '/school-admin/students'
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
          message="This student could not be loaded for editing."
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
      ) : (
        <StudentFormFields student={student ?? undefined} service={service} />
      )}
    </div>
  );
}
