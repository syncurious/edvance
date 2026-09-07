'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CheckCheck,
  ClipboardCheck,
  FileBarChart,
  Save,
  Search,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/toast';
import { attendanceStatusMeta } from '@/features/attendance/components/attendance-status';
import { attendanceService } from '@/features/attendance/services';
import type { AttendanceService } from '@/features/attendance/services';
import { attendanceStatuses } from '@/features/attendance/types';
import type {
  AttendanceRecord,
  AttendanceSheet,
  AttendanceStatus,
} from '@/features/attendance/types';
import { classMocks } from '@/mocks/classes';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

const today = '2026-09-07';

type PendingChange =
  | { type: 'filters'; classSectionId: string; date: string }
  | { type: 'route'; href: string };

function SummaryTile({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-2">
        <StatusBadge status={tone}>{value}</StatusBadge>
      </div>
    </div>
  );
}

function EntryLoading() {
  return (
    <div className="grid gap-3" aria-label="Loading attendance sheet">
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton key={index} className="h-16 rounded-xl" />
      ))}
    </div>
  );
}

export function AttendanceEntry({
  service = attendanceService,
}: {
  service?: AttendanceService;
}) {
  const router = useRouter();
  const selectedCampusId = useAppSelector(selectSelectedCampusId);
  const availableClasses = useMemo(
    () =>
      classMocks.filter(
        (item) =>
          selectedCampusId === 'all' || item.campusId === selectedCampusId,
      ),
    [selectedCampusId],
  );
  const [classSectionId, setClassSectionId] = useState(
    availableClasses[0]?.id ?? '',
  );
  const [date, setDate] = useState(today);
  const [sheet, setSheet] = useState<AttendanceSheet | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [version, setVersion] = useState(0);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(
    null,
  );

  useEffect(() => {
    if (availableClasses.some((item) => item.id === classSectionId)) return;
    setClassSectionId(availableClasses[0]?.id ?? '');
    setDirty(false);
  }, [availableClasses, classSectionId]);

  useEffect(() => {
    if (!classSectionId) {
      setSheet(null);
      setRecords([]);
      setState('ready');
      return;
    }
    let active = true;
    setState('loading');
    service
      .getSheet(classSectionId, date)
      .then((data) => {
        if (active) {
          setSheet(data);
          setRecords(data.records);
          setDirty(false);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [classSectionId, date, service, version]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty && !saving) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    const guardLink = (event: MouseEvent) => {
      if (
        !dirty ||
        saving ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href]',
      );
      if (!link || link.target === '_blank' || link.origin !== location.origin)
        return;
      event.preventDefault();
      event.stopPropagation();
      setPendingChange({
        type: 'route',
        href: `${link.pathname}${link.search}${link.hash}`,
      });
    };
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', guardLink, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', guardLink, true);
    };
  }, [dirty, saving]);

  const requestFilters = (nextClass: string, nextDate: string) => {
    if (dirty)
      setPendingChange({
        type: 'filters',
        classSectionId: nextClass,
        date: nextDate,
      });
    else {
      setClassSectionId(nextClass);
      setDate(nextDate);
    }
  };
  const updateRecord = (
    studentId: string,
    values: Partial<Pick<AttendanceRecord, 'status' | 'note'>>,
  ) => {
    setRecords((current) =>
      current.map((record) =>
        record.student.id === studentId ? { ...record, ...values } : record,
      ),
    );
    setDirty(true);
  };
  const markAll = (status: AttendanceStatus) => {
    setRecords((current) => current.map((record) => ({ ...record, status })));
    setDirty(true);
  };
  const summary = useMemo(() => {
    const count = (status: AttendanceStatus) =>
      records.filter((record) => record.status === status).length;
    const present = count('present');
    const late = count('late');
    return {
      present,
      absent: count('absent'),
      late,
      leave: count('leave'),
      rate: records.length
        ? Math.round(((present + late) / records.length) * 100)
        : 0,
    };
  }, [records]);
  const visibleRecords = records.filter(
    (record) =>
      !appliedSearch ||
      [
        record.student.firstName,
        record.student.lastName,
        `${record.student.firstName} ${record.student.lastName}`,
        record.student.admissionId,
        record.student.rollNumber,
      ].some((value) =>
        value.toLocaleLowerCase().includes(appliedSearch.toLocaleLowerCase()),
      ),
  );

  const save = async () => {
    if (!sheet) return;
    setSaving(true);
    try {
      const saved = await service.saveSheet({
        classSectionId,
        date,
        records: records.map((record) => ({
          studentId: record.student.id,
          status: record.status,
          note: record.note,
        })),
      });
      setSheet(saved);
      setRecords(saved.records);
      setDirty(false);
      toast.add({
        title: 'Attendance saved',
        description: `${saved.records.length} student records were saved for ${date}.`,
        type: 'success',
      });
    } catch {
      toast.add({
        title: 'Attendance was not saved',
        description: 'Try again without leaving this page.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };
  const confirmDiscard = () => {
    if (!pendingChange) return;
    setDirty(false);
    if (pendingChange.type === 'route') router.push(pendingChange.href);
    else {
      setClassSectionId(pendingChange.classSectionId);
      setDate(pendingChange.date);
    }
    setPendingChange(null);
  };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setAppliedSearch(search.trim());
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Daily operations"
        title="Attendance"
        description="Mark a complete class quickly, correct exceptions, and save one dependable daily record."
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/school-admin/attendance/reports" />}
          >
            <FileBarChart /> Attendance reports
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Class and date</CardTitle>
          <CardDescription>
            Changing either selection loads its saved or prepared attendance
            sheet.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="attendance-class">Class section</Label>
            <NativeSelect
              id="attendance-class"
              value={classSectionId}
              disabled={saving || !availableClasses.length}
              onChange={(event) => requestFilters(event.target.value, date)}
            >
              {availableClasses.map((item) => (
                <NativeSelectOption key={item.id} value={item.id}>
                  {item.gradeName} · Section {item.section} · {item.campusName}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="attendance-date">Attendance date</Label>
            <Input
              id="attendance-date"
              type="date"
              max={today}
              value={date}
              disabled={saving}
              onChange={(event) =>
                requestFilters(classSectionId, event.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>
      {state === 'error' ? (
        <DashboardErrorState
          message="We could not load this attendance sheet."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : null}
      {state === 'loading' ? <EntryLoading /> : null}
      {state === 'ready' && !sheet ? (
        <DashboardEmptyState
          title="No class available"
          description="Choose a campus with an active class section."
        />
      ) : null}
      {state === 'ready' && sheet ? (
        <>
          <section
            aria-label="Attendance summary"
            className="grid grid-cols-2 gap-3 lg:grid-cols-5"
          >
            <SummaryTile
              label="Present"
              value={String(summary.present)}
              tone="success"
            />
            <SummaryTile
              label="Absent"
              value={String(summary.absent)}
              tone="error"
            />
            <SummaryTile
              label="Late"
              value={String(summary.late)}
              tone="warning"
            />
            <SummaryTile
              label="Leave"
              value={String(summary.leave)}
              tone="info"
            />
            <SummaryTile
              label="Attendance rate"
              value={`${summary.rate}%`}
              tone={summary.rate >= 90 ? 'success' : 'warning'}
            />
          </section>
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <CardTitle>
                    {sheet.classSection.gradeName} · Section{' '}
                    {sheet.classSection.section}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {records.length} students ·{' '}
                    {sheet.classSection.classTeacherName}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => markAll('present')}
                  >
                    <CheckCheck /> Mark all present
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => markAll('absent')}
                  >
                    <XCircle /> Mark all absent
                  </Button>
                </div>
              </div>
              <form className="mt-4 flex gap-2" onSubmit={submitSearch}>
                <Label htmlFor="attendance-search" className="sr-only">
                  Search class roster
                </Label>
                <Input
                  id="attendance-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, student ID, or roll number"
                />
                <Button
                  type="submit"
                  variant="outline"
                  aria-label="Search class roster"
                >
                  <Search />
                </Button>
              </form>
            </CardHeader>
            <CardContent>
              {visibleRecords.length ? (
                <div className="overflow-x-auto rounded-xl border">
                  <Table className="min-w-[980px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[240px]">Student</TableHead>
                        <TableHead>Roll number</TableHead>
                        <TableHead className="w-[410px]">
                          Attendance status
                        </TableHead>
                        <TableHead className="w-[240px]">Note</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleRecords.map((record) => (
                        <TableRow key={record.student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={record.student.photoUrl}
                                  alt=""
                                />
                                <AvatarFallback className="bg-primary/10 font-bold text-primary">
                                  {record.student.firstName[0]}
                                  {record.student.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold">
                                  {record.student.firstName}{' '}
                                  {record.student.lastName}
                                </p>
                                <p className="font-mono text-xs text-muted-foreground">
                                  {record.student.admissionId}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {record.student.rollNumber}
                          </TableCell>
                          <TableCell>
                            <fieldset className="flex gap-1">
                              <legend className="sr-only">
                                Attendance for {record.student.firstName}{' '}
                                {record.student.lastName}
                              </legend>
                              {attendanceStatuses.map((status) => {
                                const meta = attendanceStatusMeta[status];
                                const Icon = meta.icon;
                                const selected = record.status === status;
                                return (
                                  <Button
                                    key={status}
                                    type="button"
                                    size="sm"
                                    variant={selected ? 'default' : 'ghost'}
                                    aria-pressed={selected}
                                    aria-label={`${meta.label} — ${record.student.firstName} ${record.student.lastName}`}
                                    className={
                                      selected ? '' : 'text-muted-foreground'
                                    }
                                    onClick={() =>
                                      updateRecord(record.student.id, {
                                        status,
                                      })
                                    }
                                  >
                                    <Icon /> {meta.label}
                                  </Button>
                                );
                              })}
                            </fieldset>
                          </TableCell>
                          <TableCell>
                            <Input
                              aria-label={`Note for ${record.student.firstName} ${record.student.lastName}`}
                              value={record.note}
                              placeholder="Optional note"
                              onChange={(event) =>
                                updateRecord(record.student.id, {
                                  note: event.target.value,
                                })
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <DashboardEmptyState
                  title="No students found"
                  description="Clear the roster search to show the full class."
                  action={
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch('');
                        setAppliedSearch('');
                      }}
                    >
                      Clear search
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border bg-card/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck className="size-5" />
              </span>
              <div>
                <p className="font-bold">
                  {dirty
                    ? 'Unsaved changes'
                    : sheet.savedAt
                      ? 'Attendance saved'
                      : 'Ready to save'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dirty
                    ? 'Save before changing class, date, or page.'
                    : sheet.savedAt
                      ? `Saved at ${new Date(sheet.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : 'Review exceptions, then save the daily sheet.'}
                </p>
              </div>
            </div>
            <Button onClick={save} disabled={!dirty || saving}>
              {saving ? <Spinner /> : <Save />}
              {saving ? 'Saving…' : 'Save attendance'}
            </Button>
          </div>
        </>
      ) : null}
      <AlertDialog
        open={!!pendingChange}
        onOpenChange={(open) => {
          if (!open) setPendingChange(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Users />
            </AlertDialogMedia>
            <AlertDialogTitle>Discard unsaved attendance?</AlertDialogTitle>
            <AlertDialogDescription>
              The current class changes have not been saved. Leaving or loading
              another sheet will lose them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDiscard}>
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
