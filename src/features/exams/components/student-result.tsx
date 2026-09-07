'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Award, Sigma, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { DashboardErrorState } from '@/components/shared/dashboard-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ResultStatusBadge } from '@/features/exams/components/exam-status';
import { examService } from '@/features/exams/services';
import type { ExamService } from '@/features/exams/services';
import type { Exam, StudentResult } from '@/features/exams/types';

export function StudentResultView({
  examId,
  studentId,
  service = examService,
}: {
  examId: string;
  studentId: string;
  service?: ExamService;
}) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    Promise.all([
      service.get(examId),
      service.getStudentResult(examId, studentId),
    ])
      .then(([examData, resultData]) => {
        if (active) {
          setExam(examData);
          setResult(resultData);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [examId, service, studentId, version]);
  if (state === 'loading')
    return (
      <div className="grid gap-6">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  if (state === 'error' || !exam || !result)
    return (
      <DashboardErrorState
        message="This student result could not be loaded."
        onRetry={() => setVersion((value) => value + 1)}
      />
    );
  const metrics = [
    ['Obtained', String(result.obtainedMarks), Sigma],
    ['Total marks', String(result.totalMarks), Target],
    ['Percentage', `${result.percentage}%`, TrendingUp],
    ['Grade', result.grade, Award],
  ] as const;
  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Student result"
        title={result.student.name}
        description={`${exam.name} · ${exam.className} ${exam.section} · Roll ${result.student.rollNumber}`}
        actions={
          <>
            <ResultStatusBadge status={result.status} />
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/school-admin/exams/${exam.id}`} />}
            >
              <ArrowLeft /> Exam results
            </Button>
          </>
        }
      />
      <section
        aria-label="Result summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(([label, value, Icon]) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-4">
              <Icon className="size-5 text-primary" />
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
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Subject performance</CardTitle>
          <CardDescription>
            Passing requirements and recorded marks for every exam subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Maximum</TableHead>
                <TableHead>Pass marks</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exam.subjects.map((subject) => {
                const mark =
                  result.marks.find((item) => item.subjectId === subject.id)
                    ?.marks ?? null;
                const passed = mark !== null && mark >= subject.passMarks;
                return (
                  <TableRow key={subject.id}>
                    <TableCell className="font-bold">{subject.name}</TableCell>
                    <TableCell>{mark ?? 'Absent'}</TableCell>
                    <TableCell>{subject.maxMarks}</TableCell>
                    <TableCell>{subject.passMarks}</TableCell>
                    <TableCell>
                      {mark === null
                        ? '—'
                        : `${Math.round((mark / subject.maxMarks) * 100)}%`}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          mark === null
                            ? 'warning'
                            : passed
                              ? 'success'
                              : 'error'
                        }
                      >
                        {mark === null ? 'Absent' : passed ? 'Pass' : 'Fail'}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
