import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Teacher } from '@/features/teachers/types';

export function TeacherIdentity({
  teacher,
  large = false,
}: {
  teacher: Pick<Teacher, 'firstName' | 'lastName' | 'photoUrl' | 'employeeId'>;
  large?: boolean;
}) {
  return (
    <div className="flex min-w-48 items-center gap-3">
      <Avatar className={large ? 'size-16' : undefined}>
        {teacher.photoUrl ? (
          <AvatarImage src={teacher.photoUrl} alt="" />
        ) : null}
        <AvatarFallback className="bg-primary/10 font-bold text-primary">
          {teacher.firstName[0]}
          {teacher.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-bold">
          {teacher.firstName} {teacher.lastName}
        </p>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          {teacher.employeeId}
        </p>
      </div>
    </div>
  );
}
