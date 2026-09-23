import type { Metadata } from 'next';
import { TeacherFormPage } from '@/features/teachers/components/teacher-form';

export const metadata: Metadata = { title: 'Add Teacher' };
export default function NewTeacherPage() {
  return <TeacherFormPage />;
}
