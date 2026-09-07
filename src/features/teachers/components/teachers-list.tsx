'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { Eye, Pencil, Plus, RotateCcw, Search } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { TeacherIdentity } from '@/features/teachers/components/teacher-identity';
import {
  TeacherStatusBadge,
  teacherStatusLabels,
} from '@/features/teachers/components/teacher-status';
import { teacherService } from '@/features/teachers/services';
import type { TeacherService } from '@/features/teachers/services';
import { teacherStatuses, teacherSubjects } from '@/features/teachers/types';
import type {
  TeacherListQuery,
  TeacherListResult,
} from '@/features/teachers/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

const initialQuery: Omit<TeacherListQuery, 'campusId'> = {
  search: '',
  subject: 'all',
  status: 'all',
  page: 1,
  pageSize: 8,
};

export function TeachersList({
  service = teacherService,
}: {
  service?: TeacherService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [query, setQuery] = useState(initialQuery);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<TeacherListResult | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .list({ ...query, campusId })
      .then((data) => {
        if (active) {
          setResult(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [campusId, query, service, version]);

  const update = (values: Partial<typeof query>) =>
    setQuery((current) => ({ ...current, ...values, page: values.page ?? 1 }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    update({ search });
  };
  const reset = () => {
    setSearch('');
    setQuery(initialQuery);
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Staff management"
        title="Teachers"
        description="Find staff, review teaching loads, and manage class and subject assignments."
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/school-admin/teachers/new" />}
          >
            <Plus /> Add teacher
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <search>
            <form
              className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_12rem_11rem_auto] lg:items-end"
              onSubmit={submit}
            >
              <div className="grid gap-2">
                <Label htmlFor="teacher-search">Search teachers</Label>
                <div className="flex gap-2">
                  <Input
                    id="teacher-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, ID, email, or phone"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    aria-label="Search teachers"
                  >
                    <Search />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher-subject">Subject</Label>
                <NativeSelect
                  id="teacher-subject"
                  value={query.subject}
                  onChange={(event) =>
                    update({
                      subject: event.target
                        .value as TeacherListQuery['subject'],
                    })
                  }
                >
                  <NativeSelectOption value="all">
                    All subjects
                  </NativeSelectOption>
                  {teacherSubjects.map((subject) => (
                    <NativeSelectOption key={subject} value={subject}>
                      {subject}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher-status">Status</Label>
                <NativeSelect
                  id="teacher-status"
                  value={query.status}
                  onChange={(event) =>
                    update({
                      status: event.target.value as TeacherListQuery['status'],
                    })
                  }
                >
                  <NativeSelectOption value="all">
                    All statuses
                  </NativeSelectOption>
                  {teacherStatuses.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {teacherStatusLabels[status]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={reset}
                disabled={
                  query.search === '' &&
                  query.subject === 'all' &&
                  query.status === 'all'
                }
              >
                <RotateCcw /> Reset
              </Button>
            </form>
          </search>
        </CardHeader>
        <CardContent>
          {state === 'error' ? (
            <DashboardErrorState
              message="We could not load the teacher directory."
              onRetry={() => setVersion((value) => value + 1)}
            />
          ) : null}
          {state !== 'error' ? (
            <div className="overflow-x-auto rounded-xl border">
              <Table className="min-w-[1050px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state === 'loading'
                    ? [0, 1, 2, 3, 4].map((row) => (
                        <TableRow key={row} aria-label="Loading teacher">
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((cell) => (
                            <TableCell key={cell}>
                              <Skeleton className="h-6 min-w-16" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : null}
                  {state === 'ready'
                    ? result?.teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>
                            <TeacherIdentity teacher={teacher} />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {teacher.employeeId}
                          </TableCell>
                          <TableCell>
                            <div className="flex max-w-52 flex-wrap gap-1">
                              {[
                                ...new Set(
                                  teacher.assignments.map(
                                    (item) => item.subject,
                                  ),
                                ),
                              ].map((subject) => (
                                <Badge variant="secondary" key={subject}>
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {teacher.assignments
                              .map(
                                (item) => `${item.gradeName}-${item.section}`,
                              )
                              .join(', ')}
                          </TableCell>
                          <TableCell>{teacher.campusName}</TableCell>
                          <TableCell>{teacher.phone}</TableCell>
                          <TableCell>
                            <TeacherStatusBadge status={teacher.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                aria-label={`View ${teacher.firstName} ${teacher.lastName}`}
                                nativeButton={false}
                                render={
                                  <Link
                                    href={`/school-admin/teachers/${teacher.id}`}
                                  />
                                }
                              >
                                <Eye />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                aria-label={`Edit ${teacher.firstName} ${teacher.lastName}`}
                                nativeButton={false}
                                render={
                                  <Link
                                    href={`/school-admin/teachers/${teacher.id}/edit`}
                                  />
                                }
                              >
                                <Pencil />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </div>
          ) : null}
          {state === 'ready' && result?.total === 0 ? (
            <DashboardEmptyState
              title="No teachers found"
              description="Try changing the search, subject, status, or selected campus."
              action={
                <Button variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : null}
          {state === 'ready' && result && result.total > 0 ? (
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {(result.page - 1) * result.pageSize + 1}–
                {Math.min(result.page * result.pageSize, result.total)} of{' '}
                {result.total} teachers
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={result.page === 1}
                  onClick={() => update({ page: result.page - 1 })}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={result.page === result.totalPages}
                  onClick={() => update({ page: result.page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
