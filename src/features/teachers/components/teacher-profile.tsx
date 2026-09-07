'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  Building2,
  CalendarDays,
  Mail,
  Pencil,
  Phone,
} from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import { DashboardErrorState } from '@/components/shared/dashboard-state';
import { Badge } from '@/components/ui/badge';
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
import { TeacherIdentity } from '@/features/teachers/components/teacher-identity';
import { TeacherStatusBadge } from '@/features/teachers/components/teacher-status';
import { teacherService } from '@/features/teachers/services';
import type { TeacherService } from '@/features/teachers/services';
import type { Teacher } from '@/features/teachers/types';

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border p-4">
      <Icon className="mt-0.5 size-4 text-primary" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-medium">{value}</p>
      </div>
    </div>
  );
}

export function TeacherProfile({
  teacherId,
  service = teacherService,
}: {
  teacherId: string;
  service?: TeacherService;
}) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .get(teacherId)
      .then((data) => {
        if (active) {
          setTeacher(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [service, teacherId, version]);

  if (state === 'loading')
    return (
      <div className="grid gap-6">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  if (state === 'error' || !teacher)
    return (
      <DashboardErrorState
        message="We could not load this teacher profile."
        onRetry={() => setVersion((value) => value + 1)}
      />
    );

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Teacher profile"
        title={`${teacher.firstName} ${teacher.lastName}`}
        description={`${teacher.employeeId} · ${teacher.campusName}`}
        actions={
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/school-admin/teachers" />}
            >
              All teachers
            </Button>
            <Button
              nativeButton={false}
              render={
                <Link href={`/school-admin/teachers/${teacher.id}/edit`} />
              }
            >
              <Pencil /> Edit teacher
            </Button>
          </>
        }
      />
      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <TeacherIdentity teacher={teacher} large />
          <TeacherStatusBadge status={teacher.status} />
        </CardContent>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Contact and employment</CardTitle>
            <CardDescription>
              Core staff and school placement details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Detail icon={Mail} label="Work email" value={teacher.email} />
            <Detail icon={Phone} label="Phone" value={teacher.phone} />
            <Detail
              icon={Building2}
              label="Campus"
              value={teacher.campusName}
            />
            <Detail
              icon={CalendarDays}
              label="Joined"
              value={teacher.joiningDate}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Teaching profile</CardTitle>
            <CardDescription>
              {teacher.qualification} ·{' '}
              {teacher.employmentType.replace('-', ' ')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div>
              <p className="mb-2 text-sm font-bold">Specialization</p>
              <Badge variant="secondary">
                <BookOpen /> {teacher.specialization}
              </Badge>
            </div>
            <div className="overflow-x-auto rounded-xl border">
              <Table className="min-w-[560px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Campus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacher.assignments.map((item) => (
                    <TableRow key={`${item.classSectionId}-${item.subject}`}>
                      <TableCell className="font-bold">
                        {item.gradeName}
                      </TableCell>
                      <TableCell>{item.section}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>{teacher.campusName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
