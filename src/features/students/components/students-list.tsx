'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  Search,
} from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
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
import { StudentIdentity } from '@/features/students/components/student-identity';
import {
  StudentStatusBadge,
  studentStatusLabels,
} from '@/features/students/components/student-status';
import { studentService } from '@/features/students/services';
import type { StudentService } from '@/features/students/services';
import {
  studentClasses,
  studentSections,
  studentStatuses,
} from '@/features/students/types';
import type {
  StudentListQuery,
  StudentListResult,
} from '@/features/students/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

const baseQuery: Omit<StudentListQuery, 'campusId'> = {
  search: '',
  className: 'all',
  section: 'all',
  status: 'all',
  sortBy: 'name',
  sortDirection: 'asc',
  page: 1,
  pageSize: 8,
};

function StudentTableSkeleton() {
  return [0, 1, 2, 3, 4].map((row) => (
    <TableRow key={row} aria-label="Loading student">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
        <TableCell key={cell}>
          <Skeleton className="h-6 min-w-16" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function StudentsList({
  service = studentService,
}: {
  service?: StudentService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [query, setQuery] = useState(baseQuery);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<StudentListResult | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .list({ ...query, campusId })
      .then((response) => {
        if (!active) return;
        setResult(response);
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
      });
    return () => {
      active = false;
    };
  }, [campusId, query, requestVersion, service]);

  function updateQuery(values: Partial<typeof query>) {
    setQuery((current) => ({ ...current, ...values, page: values.page ?? 1 }));
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    updateQuery({ search });
  }

  function resetFilters() {
    setSearch('');
    setQuery(baseQuery);
  }

  const hasFilters =
    query.search !== '' ||
    query.className !== 'all' ||
    query.section !== 'all' ||
    query.status !== 'all';

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Student management"
        title="Students"
        description="Find learners, review enrollment, and open complete academic profiles for the selected campus."
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/school-admin/students/new" />}
          >
            <Plus /> Add student
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <search>
            <form
              className="grid gap-3 xl:grid-cols-[minmax(15rem,1fr)_repeat(4,auto)] xl:items-end"
              onSubmit={submitSearch}
            >
              <div className="grid gap-2">
                <Label htmlFor="student-search">Search students</Label>
                <div className="flex gap-2">
                  <Input
                    id="student-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, ID, parent, or phone"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    aria-label="Search students"
                  >
                    <Search />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="student-class-filter">Class</Label>
                <NativeSelect
                  id="student-class-filter"
                  className="w-full xl:w-36"
                  value={query.className}
                  onChange={(event) =>
                    updateQuery({
                      className: event.target
                        .value as StudentListQuery['className'],
                    })
                  }
                >
                  <NativeSelectOption value="all">
                    All classes
                  </NativeSelectOption>
                  {studentClasses.map((className) => (
                    <NativeSelectOption key={className} value={className}>
                      {className}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="student-section-filter">Section</Label>
                <NativeSelect
                  id="student-section-filter"
                  className="w-full xl:w-32"
                  value={query.section}
                  onChange={(event) =>
                    updateQuery({
                      section: event.target
                        .value as StudentListQuery['section'],
                    })
                  }
                >
                  <NativeSelectOption value="all">
                    All sections
                  </NativeSelectOption>
                  {studentSections.map((section) => (
                    <NativeSelectOption key={section} value={section}>
                      Section {section}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="student-status-filter">Status</Label>
                <NativeSelect
                  id="student-status-filter"
                  className="w-full xl:w-36"
                  value={query.status}
                  onChange={(event) =>
                    updateQuery({
                      status: event.target.value as StudentListQuery['status'],
                    })
                  }
                >
                  <NativeSelectOption value="all">
                    All statuses
                  </NativeSelectOption>
                  {studentStatuses.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {studentStatusLabels[status]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="student-sort">Sort by</Label>
                  <NativeSelect
                    id="student-sort"
                    className="w-full xl:w-36"
                    value={query.sortBy}
                    onChange={(event) =>
                      updateQuery({
                        sortBy: event.target
                          .value as StudentListQuery['sortBy'],
                      })
                    }
                  >
                    <NativeSelectOption value="name">Name</NativeSelectOption>
                    <NativeSelectOption value="admissionId">
                      Student ID
                    </NativeSelectOption>
                    <NativeSelectOption value="className">
                      Class
                    </NativeSelectOption>
                    <NativeSelectOption value="admissionDate">
                      Admission date
                    </NativeSelectOption>
                  </NativeSelect>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="self-end"
                  aria-label={`Sort ${query.sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                  onClick={() =>
                    updateQuery({
                      sortDirection:
                        query.sortDirection === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  {query.sortDirection === 'asc' ? (
                    <ArrowUpAZ />
                  ) : (
                    <ArrowDownAZ />
                  )}
                </Button>
              </div>
            </form>
          </search>
        </CardHeader>

        <CardContent className="grid gap-4">
          {state === 'error' ? (
            <DashboardErrorState
              message="The student directory could not be loaded."
              onRetry={() => setRequestVersion((version) => version + 1)}
            />
          ) : state === 'ready' && result?.students.length === 0 ? (
            <DashboardEmptyState
              title={hasFilters ? 'No matching students' : 'No students yet'}
              description={
                hasFilters
                  ? 'Try clearing or changing your search and filters.'
                  : 'Add the first learner to this campus.'
              }
              action={
                hasFilters ? (
                  <Button variant="outline" onClick={resetFilters}>
                    <RotateCcw /> Clear filters
                  </Button>
                ) : (
                  <Button
                    nativeButton={false}
                    render={<Link href="/school-admin/students/new" />}
                  >
                    <Plus /> Add student
                  </Button>
                )
              }
            />
          ) : (
            <div className="rounded-lg border border-border [&_[data-slot=table-container]]:rounded-lg">
              <Table className="min-w-[1180px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state === 'loading' ? (
                    <StudentTableSkeleton />
                  ) : (
                    result?.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <StudentIdentity student={student} compact />
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold">
                          {student.admissionId}
                        </TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>{student.section}</TableCell>
                        <TableCell className="font-medium">
                          {student.parent.name}
                        </TableCell>
                        <TableCell>
                          <a
                            className="hover:underline"
                            href={`tel:${student.parent.phone}`}
                          >
                            {student.parent.phone}
                          </a>
                        </TableCell>
                        <TableCell>{student.campusName}</TableCell>
                        <TableCell>
                          <StudentStatusBadge status={student.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/school-admin/students/${student.id}`}
                                />
                              }
                              aria-label={`View ${student.firstName} ${student.lastName}`}
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/school-admin/students/${student.id}/edit`}
                                />
                              }
                              aria-label={`Edit ${student.firstName} ${student.lastName}`}
                            >
                              <Pencil />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {state === 'ready' && result && result.total > 0 ? (
            <div className="flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite">
                Showing {(result.page - 1) * result.pageSize + 1}–
                {Math.min(result.page * result.pageSize, result.total)} of{' '}
                {result.total} students
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={result.page === 1}
                  onClick={() => updateQuery({ page: result.page - 1 })}
                >
                  Previous
                </Button>
                <span className="min-w-20 text-center text-xs font-bold text-foreground">
                  Page {result.page} of {result.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={result.page === result.totalPages}
                  onClick={() => updateQuery({ page: result.page + 1 })}
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
