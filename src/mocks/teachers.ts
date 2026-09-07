import type { Teacher, TeacherSubject } from '@/features/teachers/types';

const campuses = {
  north: 'North Campus',
  central: 'Central Campus',
  south: 'South Campus',
} as const;

function teacher(
  index: number,
  name: string,
  campusId: keyof typeof campuses,
  subject: TeacherSubject,
  classSectionId: string,
  gradeName: string,
  section: string,
  status: Teacher['status'] = 'active',
): Teacher {
  const [firstName, ...rest] = name.split(' ');
  return {
    id: `teacher-${String(index).padStart(2, '0')}`,
    employeeId: `CRA-T-${String(index).padStart(3, '0')}`,
    firstName,
    lastName: rest.join(' '),
    photoUrl: '',
    email: `${firstName.toLocaleLowerCase()}.${rest.join('').toLocaleLowerCase()}@crescent.edu.pk`,
    phone: `+92 300 555 ${String(1000 + index)}`,
    campusId,
    campusName: campuses[campusId],
    qualification:
      index % 2
        ? 'M.Ed, University of Punjab'
        : 'M.Sc, Quaid-i-Azam University',
    specialization: subject,
    joiningDate: `202${index % 5}-08-15`,
    employmentType: index === 10 ? 'contract' : 'full-time',
    status,
    assignments: [{ classSectionId, gradeName, section, subject }],
  };
}

export const teacherMocks: Teacher[] = [
  teacher(
    1,
    'Ayesha Siddiqui',
    'north',
    'Mathematics',
    'grade-5-a-north',
    'Grade 5',
    'A',
  ),
  teacher(
    2,
    'Omar Farooq',
    'central',
    'English',
    'grade-5-b-central',
    'Grade 5',
    'B',
  ),
  teacher(
    3,
    'Sana Javed',
    'north',
    'Science',
    'grade-6-a-north',
    'Grade 6',
    'A',
  ),
  teacher(
    4,
    'Bilal Ahmed',
    'south',
    'Pakistan Studies',
    'grade-6-b-south',
    'Grade 6',
    'B',
  ),
  teacher(
    5,
    'Maham Raza',
    'central',
    'Computer Science',
    'grade-7-a-central',
    'Grade 7',
    'A',
  ),
  teacher(
    6,
    'Usman Tariq',
    'north',
    'Islamiyat',
    'grade-7-b-north',
    'Grade 7',
    'B',
    'on-leave',
  ),
  teacher(
    7,
    'Hira Bashir',
    'south',
    'Science',
    'grade-8-a-south',
    'Grade 8',
    'A',
  ),
  teacher(
    8,
    'Zain Ali',
    'central',
    'Mathematics',
    'grade-9-a-central',
    'Grade 9',
    'A',
  ),
  teacher(
    9,
    'Nadia Khan',
    'north',
    'English',
    'grade-10-a-north',
    'Grade 10',
    'A',
  ),
  teacher(
    10,
    'Fahad Noor',
    'south',
    'Computer Science',
    'grade-8-a-south',
    'Grade 8',
    'A',
    'inactive',
  ),
];
