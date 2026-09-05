import {
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  HeartPulse,
  Home,
  Mail,
  MapPin,
  Phone,
  School,
  UserRound,
} from 'lucide-react';

import { StudentIdentity } from '@/features/students/components/student-identity';
import { StudentStatusBadge } from '@/features/students/components/student-status';
import type { Student } from '@/features/students/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

const dateFormatter = new Intl.DateTimeFormat('en-PK', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-1 break-words font-semibold">{children}</div>
      </div>
    </div>
  );
}

export function StudentProfileHeader({ student }: { student: Student }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StudentIdentity student={student} />
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <StudentStatusBadge status={student.status} />
          <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
            {student.className} · Section {student.section}
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
            {student.campusName}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentBasicInfo({ student }: { student: Student }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
        <CardDescription>Personal and enrollment identity</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <InfoItem icon={CalendarDays} label="Date of birth">
          {dateFormatter.format(new Date(student.dateOfBirth))}
        </InfoItem>
        <InfoItem icon={UserRound} label="Gender">
          {student.gender.charAt(0).toUpperCase() + student.gender.slice(1)}
        </InfoItem>
        <InfoItem icon={HeartPulse} label="Blood group">
          {student.bloodGroup}
        </InfoItem>
        <InfoItem icon={CalendarDays} label="Admission date">
          {dateFormatter.format(new Date(student.admissionDate))}
        </InfoItem>
        <div className="sm:col-span-2">
          <InfoItem icon={MapPin} label="Home address">
            {student.address}
          </InfoItem>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentParentInfo({ student }: { student: Student }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Parent or guardian</CardTitle>
        <CardDescription>Primary family contact</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <InfoItem icon={UserRound} label={student.parent.relationship}>
          {student.parent.name}
        </InfoItem>
        <InfoItem icon={BookOpenCheck} label="Occupation">
          {student.parent.occupation}
        </InfoItem>
        <InfoItem icon={Phone} label="Phone">
          <a className="hover:underline" href={`tel:${student.parent.phone}`}>
            {student.parent.phone}
          </a>
        </InfoItem>
        <InfoItem icon={Mail} label="Email">
          <a
            className="hover:underline"
            href={`mailto:${student.parent.email}`}
          >
            {student.parent.email}
          </a>
        </InfoItem>
      </CardContent>
    </Card>
  );
}

export function StudentAcademicInfo({ student }: { student: Student }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Academic information</CardTitle>
        <CardDescription>Current placement and school record</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <InfoItem icon={GraduationCap} label="Class">
          {student.className}
        </InfoItem>
        <InfoItem icon={School} label="Section and roll">
          Section {student.section} · {student.rollNumber}
        </InfoItem>
        <InfoItem icon={Home} label="House">
          {student.house}
        </InfoItem>
        <InfoItem icon={School} label="Campus">
          {student.campusName}
        </InfoItem>
        <div className="sm:col-span-2">
          <InfoItem icon={BookOpenCheck} label="Previous school">
            {student.previousSchool}
          </InfoItem>
        </div>
      </CardContent>
    </Card>
  );
}
