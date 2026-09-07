'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Eye, Plus, RotateCcw, Search } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import {
  ExamStatusBadge,
  examStatusLabels,
} from '@/features/exams/components/exam-status';
import { examService } from '@/features/exams/services';
import type { ExamService } from '@/features/exams/services';
import { examStatuses } from '@/features/exams/types';
import type { Exam, ExamStatus } from '@/features/exams/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

function LoadingRows() {
  return [0, 1, 2, 3].map((row) => (
    <TableRow key={row} aria-label="Loading exam">
      {Array.from({ length: 7 }, (_, cell) => (
        <TableCell key={cell}>
          <Skeleton className="h-6 min-w-20" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function ExamsList({
  service = examService,
}: {
  service?: ExamService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ExamStatus | 'all'>('all');
  const [items, setItems] = useState<Exam[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .list({ campusId, search, status })
      .then((data) => {
        if (active) {
          setItems(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [campusId, search, service, status, version]);
  function submit(event: FormEvent) {
    event.preventDefault();
    setSearch(searchInput);
  }
  function reset() {
    setSearchInput('');
    setSearch('');
    setStatus('all');
  }
  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        eyebrow="Assessment management"
        title="Exams"
        description="Create exam schedules, manage subjects, enter marks, and publish understandable results."
        actions={
          <Button
            nativeButton={false}
            render={<Link href={ROUTES.schoolAdmin.newExam} />}
          >
            <Plus /> Create exam
          </Button>
        }
      />
      <Card>
        <CardContent>
          <search>
            <form
              className="grid gap-3 md:grid-cols-[minmax(16rem,1fr)_13rem_auto] md:items-end"
              onSubmit={submit}
            >
              <div className="grid gap-2">
                <Label htmlFor="exam-search">Search exams</Label>
                <div className="flex gap-2">
                  <Input
                    id="exam-search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Exam name or class"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    aria-label="Search exams"
                  >
                    <Search />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exam-status-filter">Status</Label>
                <NativeSelect
                  id="exam-status-filter"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as ExamStatus | 'all')
                  }
                >
                  <NativeSelectOption value="all">
                    All statuses
                  </NativeSelectOption>
                  {examStatuses.map((item) => (
                    <NativeSelectOption key={item} value={item}>
                      {examStatusLabels[item]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                disabled={!search && status === 'all'}
              >
                <RotateCcw /> Reset
              </Button>
            </form>
          </search>
        </CardContent>
      </Card>
      {state === 'error' ? (
        <DashboardErrorState
          message="Exams could not be loaded."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : state === 'ready' && items.length === 0 ? (
        <DashboardEmptyState
          title="No exams found"
          description="Create an exam or clear the current filters."
          action={
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Exam schedule</CardTitle>
            <CardDescription>
              {state === 'loading'
                ? 'Loading exams…'
                : `${items.length} exams in this workspace.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state === 'loading' ? (
                  <LoadingRows />
                ) : (
                  items.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <p className="font-bold">{exam.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exam.academicYear} · {exam.campusName}
                        </p>
                      </TableCell>
                      <TableCell>
                        {exam.className} · {exam.section}
                      </TableCell>
                      <TableCell>{exam.term}</TableCell>
                      <TableCell>
                        {exam.startDate}
                        <span className="mx-1 text-muted-foreground">→</span>
                        {exam.endDate}
                      </TableCell>
                      <TableCell>{exam.subjects.length}</TableCell>
                      <TableCell>
                        <ExamStatusBadge status={exam.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          nativeButton={false}
                          render={
                            <Link href={`/school-admin/exams/${exam.id}`} />
                          }
                        >
                          <Eye /> Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
