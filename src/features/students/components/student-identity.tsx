import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Student } from '@/features/students/types';
import { cn } from '@/lib/utils';

export function StudentIdentity({
  student,
  compact = false,
}: {
  student: Pick<Student, 'firstName' | 'lastName' | 'photoUrl' | 'admissionId'>;
  compact?: boolean;
}) {
  const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;

  return (
    <div className="flex min-w-48 items-center gap-3">
      <Avatar className={cn(!compact && 'size-14')}>
        {student.photoUrl ? (
          <AvatarImage src={student.photoUrl} alt="" />
        ) : null}
        <AvatarFallback className="bg-primary/10 font-bold text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-bold">
          {student.firstName} {student.lastName}
        </p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          {student.admissionId}
        </p>
      </div>
    </div>
  );
}
