'use client';

import { ArrowLeft, FileText, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  StudentAcademicInfo,
  StudentBasicInfo,
  StudentParentInfo,
  StudentProfileHeader,
} from '@/features/students/components/student-profile-parts';
import { studentService } from '@/features/students/services';
import type { StudentService } from '@/features/students/services';
import type { Student } from '@/features/students/types';

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function ProfileLoading() {
  return (
    <div className="grid gap-5" aria-label="Loading student profile">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}

function StudentProfileContent({ student }: { student: Student }) {
  const feeStatusTone =
    student.fees.status === 'paid'
      ? 'success'
      : student.fees.status === 'partial'
        ? 'warning'
        : 'error';

  return (
    <Tabs defaultValue="overview" className="min-w-0">
      <div className="overflow-x-auto pb-2">
        <TabsList variant="line" aria-label="Student profile sections">
          {[
            'Overview',
            'Parents',
            'Academic',
            'Attendance',
            'Fees',
            'Exams',
            'Documents',
          ].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLocaleLowerCase()}
              className="px-3 py-2"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="grid gap-4 lg:grid-cols-2">
        <StudentBasicInfo student={student} />
        <StudentAcademicInfo student={student} />
      </TabsContent>
      <TabsContent value="parents">
        <StudentParentInfo student={student} />
      </TabsContent>
      <TabsContent value="academic">
        <StudentAcademicInfo student={student} />
      </TabsContent>
      <TabsContent value="attendance">
        <Card>
          <CardHeader>
            <CardTitle>Attendance summary</CardTitle>
            <CardDescription>Current academic session</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <MetricTile
              label="Attendance"
              value={`${student.attendance.percentage}%`}
            />
            <MetricTile
              label="Present"
              value={String(student.attendance.present)}
            />
            <MetricTile
              label="Absent"
              value={String(student.attendance.absent)}
            />
            <MetricTile label="Late" value={String(student.attendance.late)} />
            <MetricTile
              label="Leave"
              value={String(student.attendance.leave)}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="fees">
        <Card>
          <CardHeader className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <CardTitle>Fee summary</CardTitle>
              <CardDescription className="mt-1">
                Current academic session
              </CardDescription>
            </div>
            <StatusBadge status={feeStatusTone}>
              {student.fees.status}
            </StatusBadge>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <MetricTile
              label="Total billed"
              value={`Rs ${student.fees.total.toLocaleString('en-PK')}`}
            />
            <MetricTile
              label="Paid"
              value={`Rs ${student.fees.paid.toLocaleString('en-PK')}`}
            />
            <MetricTile
              label="Pending"
              value={`Rs ${student.fees.pending.toLocaleString('en-PK')}`}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="exams">
        <Card>
          <CardHeader>
            <CardTitle>Latest exam results</CardTitle>
            <CardDescription>First term assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {student.examResults.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.examResults.map((result) => (
                    <TableRow key={result.subject}>
                      <TableCell className="font-semibold">
                        {result.subject}
                      </TableCell>
                      <TableCell className="text-right">
                        {result.score}/{result.total}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="info">{result.grade}</StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <DashboardEmptyState
                title="No exam results"
                description="Published results will appear here."
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="documents">
        <Card>
          <CardHeader>
            <CardTitle>Student documents</CardTitle>
            <CardDescription>
              Verified files in the student record
            </CardDescription>
          </CardHeader>
          <CardContent>
            {student.documents.length ? (
              <ul className="grid gap-3">
                {student.documents.map((document) => (
                  <li
                    key={document.id}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FileText aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{document.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.type} · Updated {document.updatedAt}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <DashboardEmptyState
                title="No student documents"
                description="Uploaded and verified files will appear here."
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export function StudentProfile({
  studentId,
  service = studentService,
}: {
  studentId: string;
  service?: StudentService;
}) {
  const [student, setStudent] = useState<Student | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .get(studentId)
      .then((result) => {
        if (!active) return;
        setStudent(result);
        setState('ready');
      })
      .catch(() => {
        if (!active) return;
        setState('error');
      });
    return () => {
      active = false;
    };
  }, [requestVersion, service, studentId]);

  if (state === 'loading') return <ProfileLoading />;

  if (state === 'error' || !student) {
    return (
      <div className="grid gap-5">
        <PageHeader eyebrow="Student management" title="Student unavailable" />
        <DashboardErrorState
          message="This student profile could not be loaded."
          onRetry={() => setRequestVersion((version) => version + 1)}
        />
        <Button
          className="justify-self-start"
          variant="outline"
          nativeButton={false}
          render={<Link href="/school-admin/students" />}
        >
          <ArrowLeft /> Back to students
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Student profile"
        title={`${student.firstName} ${student.lastName}`}
        description={`${student.admissionId} · ${student.className}, Section ${student.section}`}
        actions={
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/school-admin/students" />}
            >
              <ArrowLeft /> Students
            </Button>
            <Button
              nativeButton={false}
              render={
                <Link href={`/school-admin/students/${student.id}/edit`} />
              }
            >
              <Pencil /> Edit student
            </Button>
          </>
        }
      />
      <StudentProfileHeader student={student} />
      <StudentProfileContent student={student} />
    </div>
  );
}
