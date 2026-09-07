'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpenCheck,
  GraduationCap,
  Loader2,
  Save,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';
import {
  ExamStatusBadge,
  ResultStatusBadge,
} from '@/features/exams/components/exam-status';
import { examService } from '@/features/exams/services';
import type { ExamService } from '@/features/exams/services';
import type { Exam, ExamSummary, StudentResult } from '@/features/exams/types';

type DetailView = 'subjects' | 'marks' | 'results';
type MarkDraft = Record<string, Record<string, string>>;

function ResultTable({
  exam,
  results,
}: {
  exam: Exam;
  results: StudentResult[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Roll number</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Percentage</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Result</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.student.id}>
            <TableCell className="font-bold">{result.student.name}</TableCell>
            <TableCell className="font-mono text-xs">
              {result.student.rollNumber}
            </TableCell>
            <TableCell>
              {result.obtainedMarks} / {result.totalMarks}
            </TableCell>
            <TableCell>{result.percentage}%</TableCell>
            <TableCell className="font-black">{result.grade}</TableCell>
            <TableCell>
              <ResultStatusBadge status={result.status} />
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                variant="ghost"
                nativeButton={false}
                render={
                  <Link
                    href={`/school-admin/exams/${exam.id}/students/${result.student.id}`}
                  />
                }
              >
                View result
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ExamDetail({
  examId,
  service = examService,
}: {
  examId: string;
  service?: ExamService;
}) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [summary, setSummary] = useState<ExamSummary | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  const [view, setView] = useState<DetailView>('subjects');
  const [draft, setDraft] = useState<MarkDraft>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setState('loading');
    Promise.all([
      service.get(examId),
      service.getResults(examId),
      service.getSummary(examId),
    ])
      .then(([examData, resultData, summaryData]) => {
        if (!active) return;
        setExam(examData);
        setResults(resultData);
        setSummary(summaryData);
        setDraft(
          Object.fromEntries(
            resultData.map((result) => [
              result.student.id,
              Object.fromEntries(
                result.marks.map((mark) => [
                  mark.subjectId,
                  mark.marks === null ? '' : String(mark.marks),
                ]),
              ),
            ]),
          ),
        );
        setDirty(false);
        setState('ready');
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [examId, service, version]);

  const invalidCount = useMemo(() => {
    if (!exam) return 0;
    return results.reduce(
      (count, result) =>
        count +
        exam.subjects.filter((subject) => {
          const value = draft[result.student.id]?.[subject.id] ?? '';
          if (value === '') return false;
          const numeric = Number(value);
          return (
            !Number.isFinite(numeric) ||
            numeric < 0 ||
            numeric > subject.maxMarks
          );
        }).length,
      0,
    );
  }, [draft, exam, results]);

  async function saveMarks() {
    if (!exam || invalidCount) return;
    setSaving(true);
    try {
      const saved = await service.saveMarks(
        exam.id,
        results.map((result) => ({
          studentId: result.student.id,
          marks: exam.subjects.map((subject) => ({
            subjectId: subject.id,
            marks:
              draft[result.student.id]?.[subject.id] === ''
                ? null
                : Number(draft[result.student.id]?.[subject.id]),
          })),
        })),
      );
      setResults(saved);
      setSummary(await service.getSummary(exam.id));
      setDirty(false);
      toast.add({
        title: 'Marks saved',
        description: `${saved.length} student results were recalculated.`,
        type: 'success',
      });
    } catch (error) {
      toast.add({
        title: 'Unable to save marks',
        description:
          error instanceof Error
            ? error.message
            : 'Check the marks and try again.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  if (state === 'loading')
    return (
      <div className="grid gap-6">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  if (state === 'error' || !exam || !summary)
    return (
      <DashboardErrorState
        message="This exam and its results could not be loaded."
        onRetry={() => setVersion((value) => value + 1)}
      />
    );

  const metrics = [
    ['Students', String(summary.students), Users],
    ['Subjects', String(summary.subjects), BookOpenCheck],
    ['Class average', `${summary.averagePercentage}%`, TrendingUp],
    ['Pass rate', `${summary.passRate}%`, GraduationCap],
  ] as const;

  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Exam workspace"
        title={exam.name}
        description={`${exam.className} · Section ${exam.section} · ${exam.campusName} · ${exam.academicYear}`}
        actions={
          <>
            <ExamStatusBadge status={exam.status} />
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/school-admin/exams" />}
            >
              <ArrowLeft /> All exams
            </Button>
          </>
        }
      />
      <section
        aria-label="Exam summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(([label, value, Icon]) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-xl font-black">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <Tabs
        value={view}
        onValueChange={(value) => setView(value as DetailView)}
        className="min-w-0"
      >
        <div className="max-w-full overflow-x-auto">
          <TabsList aria-label="Exam detail sections" className="w-max">
            <TabsTrigger value="subjects">Subject setup</TabsTrigger>
            <TabsTrigger value="marks">Marks entry</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {view === 'subjects' ? (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Subject setup</CardTitle>
            <CardDescription>
              {exam.startDate} to {exam.endDate} · {exam.term}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Maximum marks</TableHead>
                  <TableHead>Pass marks</TableHead>
                  <TableHead>Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exam.subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-bold">{subject.name}</TableCell>
                    <TableCell>{subject.date}</TableCell>
                    <TableCell>{subject.maxMarks}</TableCell>
                    <TableCell>{subject.passMarks}</TableCell>
                    <TableCell>
                      {Math.round(
                        (subject.maxMarks / results[0].totalMarks) * 100,
                      )}
                      %
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}

      {view === 'marks' ? (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Marks entry</CardTitle>
            <CardDescription>
              Enter 0 to the subject maximum. Leave a field blank only when the
              student was absent.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {invalidCount ? (
              <Alert variant="destructive">
                <AlertTitle>Invalid marks</AlertTitle>
                <AlertDescription>
                  {invalidCount} entries fall outside their subject maximum.
                </AlertDescription>
              </Alert>
            ) : null}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll number</TableHead>
                  {exam.subjects.map((subject) => (
                    <TableHead key={subject.id}>
                      {subject.name}
                      <span className="block text-xs font-normal text-muted-foreground">
                        out of {subject.maxMarks}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.student.id}>
                    <TableCell className="font-bold">
                      {result.student.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {result.student.rollNumber}
                    </TableCell>
                    {exam.subjects.map((subject) => {
                      const value =
                        draft[result.student.id]?.[subject.id] ?? '';
                      const invalid =
                        value !== '' &&
                        (Number(value) < 0 ||
                          Number(value) > subject.maxMarks ||
                          !Number.isFinite(Number(value)));
                      return (
                        <TableCell key={subject.id}>
                          <Input
                            className="w-24"
                            type="number"
                            min="0"
                            max={subject.maxMarks}
                            value={value}
                            placeholder="Absent"
                            aria-label={`${subject.name} marks for ${result.student.name}`}
                            aria-invalid={invalid}
                            onChange={(event) => {
                              setDraft((current) => ({
                                ...current,
                                [result.student.id]: {
                                  ...current[result.student.id],
                                  [subject.id]: event.target.value,
                                },
                              }));
                              setDirty(true);
                            }}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="sticky bottom-4 flex justify-end rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur">
              <Button
                onClick={saveMarks}
                disabled={!dirty || saving || invalidCount > 0}
              >
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {saving ? 'Saving…' : dirty ? 'Save marks' : 'Marks saved'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {view === 'results' ? (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Class results</CardTitle>
            <CardDescription>
              Totals, percentages, grades, and result status update when marks
              are saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultTable exam={exam} results={results} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
