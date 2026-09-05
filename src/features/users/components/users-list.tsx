'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  Mail,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  UsersRound,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { userService } from '@/features/users/services';
import type { UserService } from '@/features/users/services';
import type {
  PlatformUser,
  UserListQuery,
  UserListResult,
} from '@/features/users/types';
import {
  platformUserRoles,
  platformUserStatuses,
} from '@/features/users/types';

const roleLabels = {
  'super-admin': 'Super Admin',
  'school-admin': 'School Admin',
  teacher: 'Teacher',
  accountant: 'Accountant',
} as const;

const statusLabels = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
} as const;
const defaultQuery: UserListQuery = {
  search: '',
  role: 'all',
  school: 'all',
  status: 'all',
  page: 1,
  pageSize: 8,
};

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function formatLastLogin(value: string | null) {
  if (!value) return 'Never';
  const days = Math.round((new Date(value).getTime() - Date.now()) / 86400000);
  if (Math.abs(days) <= 7) return relativeTime.format(days, 'day');
  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function UserIdentity({ user }: { user: PlatformUser }) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
  return (
    <div className="flex min-w-56 items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-black text-primary">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}

function UserStatus({ user }: { user: PlatformUser }) {
  return (
    <StatusBadge
      status={
        user.status === 'active'
          ? 'success'
          : user.status === 'invited'
            ? 'info'
            : 'error'
      }
    >
      {statusLabels[user.status]}
    </StatusBadge>
  );
}

export function UsersList({
  service = userService,
}: {
  service?: UserService;
}) {
  const [query, setQuery] = useState(defaultQuery);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<UserListResult | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [requestVersion, setRequestVersion] = useState(0);
  const [statusTarget, setStatusTarget] = useState<PlatformUser | null>(null);
  const [updating, setUpdating] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);

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
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [query, requestVersion, service]);

  function updateQuery(values: Partial<UserListQuery>) {
    setQuery((current) => ({ ...current, ...values, page: values.page ?? 1 }));
  }

  async function sendReset(user: PlatformUser) {
    setResettingId(user.id);
    try {
      await service.sendPasswordReset(user.id);
      toast.add({
        title: 'Reset email sent',
        description: `Password instructions were sent to ${user.email}.`,
        type: 'success',
      });
    } catch (error) {
      toast.add({
        title: 'Unable to send reset email',
        description: error instanceof Error ? error.message : 'Try again.',
        type: 'error',
      });
    } finally {
      setResettingId(null);
    }
  }

  async function changeStatus() {
    if (!statusTarget) return;
    const nextStatus =
      statusTarget.status === 'suspended' ? 'active' : 'suspended';
    setUpdating(true);
    try {
      const updated = await service.setStatus(statusTarget.id, nextStatus);
      toast.add({
        title: nextStatus === 'active' ? 'User reactivated' : 'User suspended',
        description: `${updated.name}'s access has been updated.`,
        type: 'success',
      });
      setStatusTarget(null);
      setRequestVersion((version) => version + 1);
    } catch (error) {
      toast.add({
        title: 'Unable to update access',
        description: error instanceof Error ? error.message : 'Try again.',
        type: 'error',
      });
    } finally {
      setUpdating(false);
    }
  }

  const columns: DataTableColumn<PlatformUser>[] = [
    {
      id: 'user',
      header: 'User',
      cell: (user) => <UserIdentity user={user} />,
    },
    {
      id: 'role',
      header: 'Role',
      cell: (user) => (
        <span className="inline-flex items-center gap-1.5 font-semibold">
          {user.role === 'super-admin' ? (
            <ShieldCheck className="size-4 text-primary" />
          ) : null}
          {roleLabels[user.role]}
        </span>
      ),
    },
    { id: 'school', header: 'School', cell: (user) => user.school },
    {
      id: 'status',
      header: 'Status',
      cell: (user) => <UserStatus user={user} />,
    },
    {
      id: 'last-login',
      header: 'Last login',
      cell: (user) => (
        <span className={user.lastLoginAt ? '' : 'text-muted-foreground'}>
          {formatLastLogin(user.lastLoginAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      className: 'text-right',
      cell: (user) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={resettingId === user.id}
            aria-label={`Send password reset to ${user.name}`}
            onClick={() => sendReset(user)}
          >
            {resettingId === user.id ? <Spinner /> : <Mail />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={user.role === 'super-admin'}
            aria-label={`${user.status === 'suspended' ? 'Reactivate' : 'Suspend'} ${user.name}`}
            onClick={() => setStatusTarget(user)}
          >
            {user.status === 'suspended' ? <UserCheck /> : <UserX />}
          </Button>
        </div>
      ),
    },
  ];

  const hasFilters =
    query.search ||
    query.role !== 'all' ||
    query.school !== 'all' ||
    query.status !== 'all';

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Platform access"
        title="Users"
        description="Find administrators and staff, review their latest access, and take contextual account actions."
      />

      <Card>
        <CardContent>
          <search>
            <form
              className="grid gap-3 lg:grid-cols-[minmax(14rem,1fr)_repeat(3,auto)_auto] lg:items-end"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                updateQuery({ search });
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="user-search">Search users</Label>
                <div className="flex gap-2">
                  <Input
                    id="user-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, email, or school"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    aria-label="Search users"
                  >
                    <Search />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-role">Role</Label>
                <NativeSelect
                  id="user-role"
                  className="w-full lg:w-40"
                  value={query.role}
                  onChange={(event) =>
                    updateQuery({
                      role: event.target.value as UserListQuery['role'],
                    })
                  }
                >
                  <NativeSelectOption value="all">All roles</NativeSelectOption>
                  {platformUserRoles.map((role) => (
                    <NativeSelectOption key={role} value={role}>
                      {roleLabels[role]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-school">School</Label>
                <NativeSelect
                  id="user-school"
                  className="w-full lg:w-52"
                  value={query.school}
                  onChange={(event) =>
                    updateQuery({ school: event.target.value })
                  }
                >
                  <NativeSelectOption value="all">
                    All schools
                  </NativeSelectOption>
                  {result?.schools.map((school) => (
                    <NativeSelectOption key={school} value={school}>
                      {school}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="user-status">Status</Label>
                <NativeSelect
                  id="user-status"
                  className="w-full lg:w-36"
                  value={query.status}
                  onChange={(event) =>
                    updateQuery({
                      status: event.target.value as UserListQuery['status'],
                    })
                  }
                >
                  <NativeSelectOption value="all">
                    All statuses
                  </NativeSelectOption>
                  {platformUserStatuses.map((status) => (
                    <NativeSelectOption key={status} value={status}>
                      {statusLabels[status]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={!hasFilters}
                onClick={() => {
                  setSearch('');
                  setQuery(defaultQuery);
                }}
              >
                <RotateCcw /> Reset
              </Button>
            </form>
          </search>
        </CardContent>
      </Card>

      <DataTable
        title="Platform users"
        description={
          result
            ? `${result.total} ${result.total === 1 ? 'user matches' : 'users match'} the current view`
            : 'Loading platform users'
        }
        data={result?.users ?? []}
        columns={columns}
        getRowKey={(user) => user.id}
        state={state}
        emptyTitle="No matching users"
        emptyDescription="Try clearing or changing the current filters."
        errorMessage="The user directory could not be loaded."
        onRetry={() => setRequestVersion((version) => version + 1)}
      />

      {state === 'ready' && result && result.total > 0 ? (
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite">
            Showing {(result.page - 1) * result.pageSize + 1}–
            {Math.min(result.page * result.pageSize, result.total)} of{' '}
            {result.total} users
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

      <AlertDialog
        open={statusTarget !== null}
        onOpenChange={(open) => {
          if (!open && !updating) setStatusTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-warning text-warning-foreground">
              <UsersRound />
            </AlertDialogMedia>
            <AlertDialogTitle>
              {statusTarget?.status === 'suspended' ? 'Reactivate' : 'Suspend'}{' '}
              {statusTarget?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusTarget?.status === 'suspended'
                ? 'This restores the user’s access to their assigned workspace.'
                : 'The user will lose access until a platform administrator reactivates the account.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={
                statusTarget?.status === 'suspended' ? 'default' : 'destructive'
              }
              disabled={updating}
              aria-busy={updating}
              onClick={changeStatus}
            >
              {updating ? (
                <Spinner />
              ) : statusTarget?.status === 'suspended' ? (
                <UserCheck />
              ) : (
                <UserX />
              )}
              {updating
                ? 'Updating…'
                : statusTarget?.status === 'suspended'
                  ? 'Reactivate user'
                  : 'Suspend user'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
