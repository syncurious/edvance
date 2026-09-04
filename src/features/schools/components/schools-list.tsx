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
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { SchoolIdentity } from '@/features/schools/components/school-identity';
import {
  SchoolStatusBadge,
  schoolStatusLabels,
} from '@/features/schools/components/school-status';
import { schoolService } from '@/features/schools/services';
import type { SchoolService } from '@/features/schools/services';
import type {
  School,
  SchoolListQuery,
  SchoolListResult,
} from '@/features/schools/types';
import { schoolPlans, schoolStatuses } from '@/features/schools/types';

const defaultQuery: SchoolListQuery = {
  search: '',
  status: 'all',
  plan: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  page: 1,
  pageSize: 8,
};

const dateFormatter = new Intl.DateTimeFormat('en-PK', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function SchoolTableSkeleton() {
  return [0, 1, 2, 3, 4].map((row) => (
    <TableRow key={row} aria-label="Loading school">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((cell) => (
        <TableCell key={cell}>
          <Skeleton className="h-6 min-w-16" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function SchoolsList({
  service = schoolService,
}: {
  service?: SchoolService;
}) {
  const [query, setQuery] = useState(defaultQuery);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<SchoolListResult | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [requestVersion, setRequestVersion] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .list(query)
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
  }, [query, requestVersion, service]);

  function updateQuery(values: Partial<SchoolListQuery>) {
    setQuery((current) => ({ ...current, ...values, page: values.page ?? 1 }));
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    updateQuery({ search });
  }

  function resetFilters() {
    setSearch('');
    setQuery(defaultQuery);
  }

  async function deleteSchool() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await service.delete(deleteTarget.id);
      toast.add({
        title: 'School deleted',
        description: `${deleteTarget.name} was removed from the platform.`,
        type: 'success',
      });
      setDeleteTarget(null);
      setRequestVersion((version) => version + 1);
    } catch (error) {
      toast.add({
        title: 'Unable to delete school',
        description:
          error instanceof Error ? error.message : 'Try the request again.',
        type: 'error',
      });
    } finally {
      setDeleting(false);
    }
  }

  const hasFilters =
    query.search !== '' || query.status !== 'all' || query.plan !== 'all';

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Platform directory"
        title="Schools"
        description="Find, review, and manage every school workspace from one predictable directory."
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/super-admin/schools/new" />}
          >
            <Plus data-icon="inline-start" /> Add school
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <search>
            <form
              className="grid gap-3 lg:grid-cols-[minmax(14rem,1fr)_repeat(4,auto)] lg:items-end"
              onSubmit={submitSearch}
            >
              <div className="grid gap-2">
                <Label htmlFor="school-search">Search schools</Label>
                <div className="flex gap-2">
                  <Input
                    id="school-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, code, or email"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    aria-label="Search schools"
                  >
                    <Search aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="school-status-filter">Status</Label>
                <NativeSelect
                  id="school-status-filter"
                  className="w-full lg:w-36"
                  value={query.status}
                  onChange={(event) =>
                    updateQuery({
                      status: event.target.value as SchoolListQuery['status'],
                    })
                  }
                >
                  <NativeSelectOption value="all">
                    All statuses
                  </NativeSelectOption>
                  {schoolStatuses.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {schoolStatusLabels[status]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="school-plan-filter">Plan</Label>
                <NativeSelect
                  id="school-plan-filter"
                  className="w-full lg:w-40"
                  value={query.plan}
                  onChange={(event) =>
                    updateQuery({
                      plan: event.target.value as SchoolListQuery['plan'],
                    })
                  }
                >
                  <NativeSelectOption value="all">All plans</NativeSelectOption>
                  {schoolPlans.map((plan) => (
                    <NativeSelectOption key={plan} value={plan}>
                      {plan}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="school-sort">Sort by</Label>
                <NativeSelect
                  id="school-sort"
                  className="w-full lg:w-40"
                  value={query.sortBy}
                  onChange={(event) =>
                    updateQuery({
                      sortBy: event.target.value as SchoolListQuery['sortBy'],
                    })
                  }
                >
                  <NativeSelectOption value="createdAt">
                    Created
                  </NativeSelectOption>
                  <NativeSelectOption value="name">
                    School name
                  </NativeSelectOption>
                  <NativeSelectOption value="students">
                    Students
                  </NativeSelectOption>
                </NativeSelect>
              </div>

              <Button
                type="button"
                variant="outline"
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
                {query.sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </form>
          </search>
        </CardHeader>

        <CardContent className="grid gap-4">
          {state === 'error' ? (
            <DashboardErrorState
              message="The school directory could not be loaded."
              onRetry={() => setRequestVersion((version) => version + 1)}
            />
          ) : state === 'ready' && result?.schools.length === 0 ? (
            <DashboardEmptyState
              title={hasFilters ? 'No matching schools' : 'No schools yet'}
              description={
                hasFilters
                  ? 'Try clearing or changing your search and filters.'
                  : 'Create the first school workspace to get started.'
              }
              action={
                hasFilters ? (
                  <Button variant="outline" onClick={resetFilters}>
                    <RotateCcw /> Clear filters
                  </Button>
                ) : (
                  <Button
                    nativeButton={false}
                    render={<Link href="/super-admin/schools/new" />}
                  >
                    <Plus /> Add school
                  </Button>
                )
              }
            />
          ) : (
            <div className="rounded-lg border border-border [&_[data-slot=table-container]]:rounded-lg">
              <Table className="min-w-[1050px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state === 'loading' ? (
                    <SchoolTableSkeleton />
                  ) : (
                    result?.schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>
                          <SchoolIdentity
                            school={school}
                            compact
                            showCode={false}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold">
                          {school.code}
                        </TableCell>
                        <TableCell>
                          {school.campuses}{' '}
                          {school.campuses === 1 ? 'campus' : 'campuses'}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {school.students.toLocaleString()}
                        </TableCell>
                        <TableCell>{school.plan}</TableCell>
                        <TableCell>
                          <SchoolStatusBadge status={school.status} />
                        </TableCell>
                        <TableCell>
                          {dateFormatter.format(new Date(school.createdAt))}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/super-admin/schools/${school.id}`}
                                />
                              }
                              aria-label={`View ${school.name}`}
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              nativeButton={false}
                              render={
                                <Link
                                  href={`/super-admin/schools/${school.id}/edit`}
                                />
                              }
                              aria-label={`Edit ${school.name}`}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive"
                              aria-label={`Delete ${school.name}`}
                              onClick={() => setDeleteTarget(school)}
                            >
                              <Trash2 />
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
                {result.total} schools
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

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the school workspace from this mock directory. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              aria-busy={deleting}
              onClick={deleteSchool}
            >
              {deleting ? <Spinner /> : <Trash2 />}
              {deleting ? 'Deleting…' : 'Delete school'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
