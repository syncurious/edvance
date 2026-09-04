'use client';

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ReceiptText,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { DashboardErrorState } from '@/components/shared/dashboard-state';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { SchoolIdentity } from '@/features/schools/components/school-identity';
import { SchoolStatusBadge } from '@/features/schools/components/school-status';
import { schoolService } from '@/features/schools/services';
import type { SchoolService } from '@/features/schools/services';
import type { School } from '@/features/schools/types';

const dateFormatter = new Intl.DateTimeFormat('en-PK', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function DetailItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 break-words font-semibold">{children}</div>
      </div>
    </div>
  );
}

function DetailLoading() {
  return (
    <div className="grid gap-4" aria-label="Loading school details">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export function SchoolDetails({
  schoolId,
  service = schoolService,
}: {
  schoolId: string;
  service?: SchoolService;
}) {
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [requestVersion, setRequestVersion] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .get(schoolId)
      .then((result) => {
        if (!active) return;
        setSchool(result);
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
      });
    return () => {
      active = false;
    };
  }, [requestVersion, schoolId, service]);

  async function deleteSchool() {
    if (!school) return;
    setDeleting(true);
    try {
      await service.delete(school.id);
      toast.add({
        title: 'School deleted',
        description: `${school.name} was removed from the platform.`,
        type: 'success',
      });
      router.push('/super-admin/schools');
    } catch (error) {
      toast.add({
        title: 'Unable to delete school',
        description:
          error instanceof Error ? error.message : 'Try the request again.',
        type: 'error',
      });
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (state === 'loading') return <DetailLoading />;

  if (state === 'error' || !school) {
    return (
      <div className="grid gap-5">
        <PageHeader eyebrow="School management" title="School unavailable" />
        <DashboardErrorState
          message="This school could not be loaded. It may have been removed."
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
        <Button
          className="justify-self-start"
          variant="outline"
          nativeButton={false}
          render={<Link href="/super-admin/schools" />}
        >
          <ArrowLeft /> Back to schools
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="School workspace"
        title={school.name}
        description={`${school.code} · Added ${dateFormatter.format(new Date(school.createdAt))}`}
        actions={
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/super-admin/schools" />}
            >
              <ArrowLeft /> Schools
            </Button>
            <Button
              nativeButton={false}
              render={<Link href={`/super-admin/schools/${school.id}/edit`} />}
            >
              <Pencil /> Edit school
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SchoolIdentity school={school} />
          <SchoolStatusBadge status={school.status} />
        </CardContent>
      </Card>

      <section
        aria-label="School summary"
        className="grid gap-4 sm:grid-cols-3"
      >
        <DetailItem icon={Building2} label="Campuses">
          {school.campuses.toLocaleString()}
        </DetailItem>
        <DetailItem icon={GraduationCap} label="Students">
          {school.students.toLocaleString()}
        </DetailItem>
        <DetailItem icon={ReceiptText} label="Subscription">
          {school.plan}
        </DetailItem>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Contact and profile</CardTitle>
          <CardDescription>
            Primary details for platform communication and workspace records.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <DetailItem icon={Mail} label="Email">
            <a className="hover:underline" href={`mailto:${school.email}`}>
              {school.email}
            </a>
          </DetailItem>
          <DetailItem icon={Phone} label="Phone">
            <a className="hover:underline" href={`tel:${school.phone}`}>
              {school.phone}
            </a>
          </DetailItem>
          <div className="sm:col-span-2">
            <DetailItem icon={MapPin} label="Address">
              {school.address}
            </DetailItem>
          </div>
          <DetailItem icon={CalendarDays} label="Created">
            {dateFormatter.format(new Date(school.createdAt))}
          </DetailItem>
          <DetailItem icon={ReceiptText} label="Plan">
            {school.plan}
          </DetailItem>
        </CardContent>
      </Card>

      <Card className="border border-destructive/20">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Permanently remove this school workspace from the directory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
            <Trash2 /> Delete school
          </Button>
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmDelete}
        onOpenChange={(open) => {
          if (!deleting) setConfirmDelete(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {school.name}?</AlertDialogTitle>
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
