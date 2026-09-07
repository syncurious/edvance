'use client';

import { useEffect, useState } from 'react';
import { Building2, DoorOpen, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
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
import { classService } from '@/features/classes/services/class-service';
import type { ClassSection, ClassService } from '@/features/classes/types';
import { StudentIdentity } from '@/features/students/components/student-identity';
import { studentMocks } from '@/mocks/students';

export function ClassDetails({
  classId,
  service = classService,
}: {
  classId: string;
  service?: ClassService;
}) {
  const [item, setItem] = useState<ClassSection | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .get(classId)
      .then((data) => {
        if (active) {
          setItem(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [classId, service, version]);
  if (state === 'loading')
    return (
      <div className="grid gap-6">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  if (state === 'error' || !item)
    return (
      <DashboardErrorState
        message="We could not load this class section."
        onRetry={() => setVersion((value) => value + 1)}
      />
    );
  const students = studentMocks.filter(
    (student) =>
      student.campusId === item.campusId &&
      student.className === item.gradeName &&
      student.section === item.section,
  );
  const summaries = [
    { icon: GraduationCap, label: 'Grade', value: item.gradeName },
    {
      icon: Users,
      label: 'Enrollment',
      value: `${item.studentCount} of ${item.capacity}`,
    },
    { icon: DoorOpen, label: 'Room', value: item.room },
    { icon: Building2, label: 'Class teacher', value: item.classTeacherName },
  ];
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Class details"
        title={`${item.gradeName} · Section ${item.section}`}
        description={`${item.campusName} · ${item.room}`}
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/school-admin/classes" />}
          >
            All classes
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <CardContent className="flex gap-3 p-5">
              <Icon className="size-5 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-bold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>
            The curriculum assigned to this section.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {item.subjects.map((subject) => (
            <Badge key={subject} variant="secondary">
              {subject}
            </Badge>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Student roster</CardTitle>
          <CardDescription>
            Student profiles currently matching this campus, grade, and section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length ? (
            <div className="overflow-x-auto rounded-xl border">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll number</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead className="text-right">Profile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <StudentIdentity student={student} />
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.parent.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          nativeButton={false}
                          render={
                            <Link
                              href={`/school-admin/students/${student.id}`}
                            />
                          }
                        >
                          View student
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <DashboardEmptyState
              title="No matching students"
              description="Students will appear here when assigned to this section."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
