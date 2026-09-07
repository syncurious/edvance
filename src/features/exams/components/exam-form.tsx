'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Loader2,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { PageHeader } from '@/components/layout/page-header';
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
import { examSchema } from '@/features/exams/schemas';
import { examService } from '@/features/exams/services';
import type { ExamService } from '@/features/exams/services';
import { examStatusLabels } from '@/features/exams/components/exam-status';
import { examStatuses, examTerms } from '@/features/exams/types';
import type { ExamFormValues } from '@/features/exams/types';
import { classMocks } from '@/mocks/classes';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="text-xs font-semibold text-destructive">
      {message}
    </p>
  ) : null;
}

export function ExamForm({ service = examService }: { service?: ExamService }) {
  const router = useRouter();
  const selectedCampusId = useAppSelector(selectSelectedCampusId);
  const defaultCampus = selectedCampusId === 'all' ? 'north' : selectedCampusId;
  const [confirmLeave, setConfirmLeave] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: '',
      term: 'Midterm',
      academicYear: '2026-2027',
      campusId: defaultCampus,
      classSectionId:
        classMocks.find((item) => item.campusId === defaultCampus)?.id ?? '',
      startDate: '2026-10-05',
      endDate: '2026-10-12',
      status: 'draft',
      subjects: [
        { name: 'English', maxMarks: 100, passMarks: 40, date: '2026-10-05' },
        {
          name: 'Mathematics',
          maxMarks: 100,
          passMarks: 40,
          date: '2026-10-07',
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subjects',
  });
  const campusId = watch('campusId');
  const classes = classMocks.filter((item) => item.campusId === campusId);
  const campusField = register('campusId');

  useEffect(() => {
    const prevent = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [isDirty, isSubmitting]);

  const onSubmit = async (values: ExamFormValues) => {
    try {
      const exam = await service.create(values);
      router.push(`/school-admin/exams/${exam.id}`);
    } catch (error) {
      setError('root.server', {
        message:
          error instanceof Error
            ? error.message
            : 'The exam could not be saved.',
      });
    }
  };

  function leave() {
    if (isDirty) setConfirmLeave(true);
    else router.push('/school-admin/exams');
  }

  return (
    <>
      <form noValidate className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        <PageHeader
          eyebrow="Assessment setup"
          title="Create exam"
          description="Schedule a class assessment and define every subject's maximum and passing marks."
        />
        {errors.root?.server?.message ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to create exam</AlertTitle>
            <AlertDescription>{errors.root.server.message}</AlertDescription>
          </Alert>
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>Exam information</CardTitle>
            <CardDescription>
              Dates, class ownership, academic year, and publishing state.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="exam-name">Exam name</Label>
              <Input
                id="exam-name"
                {...register('name')}
                aria-invalid={Boolean(errors.name)}
                placeholder="e.g. Autumn Midterm Examination"
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-term">Term</Label>
              <NativeSelect id="exam-term" {...register('term')}>
                {examTerms.map((term) => (
                  <NativeSelectOption key={term} value={term}>
                    {term}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-year">Academic year</Label>
              <Input
                id="exam-year"
                {...register('academicYear')}
                aria-invalid={Boolean(errors.academicYear)}
              />
              <FieldError message={errors.academicYear?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-campus">Campus</Label>
              <NativeSelect
                id="exam-campus"
                {...campusField}
                onChange={(event) => {
                  void campusField.onChange(event);
                  const first = classMocks.find(
                    (item) => item.campusId === event.target.value,
                  );
                  setValue('classSectionId', first?.id ?? '', {
                    shouldDirty: true,
                  });
                }}
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
              <Label htmlFor="exam-class">Class section</Label>
              <NativeSelect
                id="exam-class"
                {...register('classSectionId')}
                aria-invalid={Boolean(errors.classSectionId)}
              >
                {classes.map((item) => (
                  <NativeSelectOption key={item.id} value={item.id}>
                    {item.gradeName} · Section {item.section}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <FieldError message={errors.classSectionId?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-start">Start date</Label>
              <Input
                id="exam-start"
                type="date"
                {...register('startDate')}
                aria-invalid={Boolean(errors.startDate)}
              />
              <FieldError message={errors.startDate?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-end">End date</Label>
              <Input
                id="exam-end"
                type="date"
                {...register('endDate')}
                aria-invalid={Boolean(errors.endDate)}
              />
              <FieldError message={errors.endDate?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exam-status">Status</Label>
              <NativeSelect id="exam-status" {...register('status')}>
                {examStatuses.map((status) => (
                  <NativeSelectOption key={status} value={status}>
                    {examStatusLabels[status]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Subject setup</CardTitle>
              <CardDescription className="mt-1">
                Pass marks cannot exceed the subject maximum.
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({
                  name: '',
                  maxMarks: 100,
                  passMarks: 40,
                  date: watch('startDate'),
                })
              }
            >
              <Plus /> Add subject
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4">
            {fields.map((field, index) => (
              <fieldset
                key={field.id}
                className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-[1fr_9rem_9rem_11rem_auto]"
              >
                <legend className="sr-only">Subject {index + 1}</legend>
                <div className="grid gap-2">
                  <Label htmlFor={`subject-name-${index}`}>Subject</Label>
                  <Input
                    id={`subject-name-${index}`}
                    {...register(`subjects.${index}.name`)}
                    aria-invalid={Boolean(errors.subjects?.[index]?.name)}
                  />
                  <FieldError
                    message={errors.subjects?.[index]?.name?.message}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`subject-max-${index}`}>Maximum</Label>
                  <Input
                    id={`subject-max-${index}`}
                    type="number"
                    min="1"
                    {...register(`subjects.${index}.maxMarks`, {
                      valueAsNumber: true,
                    })}
                    aria-invalid={Boolean(errors.subjects?.[index]?.maxMarks)}
                  />
                  <FieldError
                    message={errors.subjects?.[index]?.maxMarks?.message}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`subject-pass-${index}`}>Pass marks</Label>
                  <Input
                    id={`subject-pass-${index}`}
                    type="number"
                    min="1"
                    {...register(`subjects.${index}.passMarks`, {
                      valueAsNumber: true,
                    })}
                    aria-invalid={Boolean(errors.subjects?.[index]?.passMarks)}
                  />
                  <FieldError
                    message={errors.subjects?.[index]?.passMarks?.message}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`subject-date-${index}`}>Date</Label>
                  <Input
                    id={`subject-date-${index}`}
                    type="date"
                    {...register(`subjects.${index}.date`)}
                    aria-invalid={Boolean(errors.subjects?.[index]?.date)}
                  />
                  <FieldError
                    message={errors.subjects?.[index]?.date?.message}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="self-end"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label={`Remove subject ${index + 1}`}
                >
                  <Trash2 />
                </Button>
              </fieldset>
            ))}
            {errors.subjects?.root?.message ? (
              <FieldError message={errors.subjects.root.message} />
            ) : null}
          </CardContent>
        </Card>
        <div className="sticky bottom-4 z-20 flex flex-col-reverse gap-3 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={leave}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            {isSubmitting ? 'Creating…' : 'Create exam'}
          </Button>
        </div>
      </form>
      <AlertDialog open={confirmLeave} onOpenChange={setConfirmLeave}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <TriangleAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>Discard this exam draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Your unsaved exam and subject setup will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => router.push('/school-admin/exams')}
            >
              Discard draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
