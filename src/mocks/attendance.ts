import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceStudent,
} from '@/features/attendance/types';
import type { ClassSection } from '@/features/classes/types';
import { studentMocks } from '@/mocks/students';

const firstNames = [
  'Aariz',
  'Abeer',
  'Aleena',
  'Anaya',
  'Arham',
  'Dua',
  'Eman',
  'Faris',
  'Hania',
  'Hassan',
  'Ibrahim',
  'Inaya',
  'Mahnoor',
  'Mikael',
  'Mishal',
  'Mustafa',
  'Nawal',
  'Nayab',
  'Rayan',
  'Rida',
  'Saad',
  'Sameer',
  'Sania',
  'Shayan',
  'Taha',
  'Yusra',
  'Zainab',
  'Zayan',
  'Aiman',
  'Huzaifa',
  'Laiba',
  'Rayyan',
  'Sarah',
  'Shahveer',
  'Sufyan',
  'Zoya',
];
const lastNames = [
  'Ahmed',
  'Ali',
  'Bashir',
  'Farooq',
  'Hassan',
  'Iqbal',
  'Javed',
  'Khan',
  'Malik',
  'Nawaz',
  'Qureshi',
  'Raza',
  'Saeed',
  'Shah',
  'Sheikh',
  'Siddiqui',
];

export function makeAttendanceRoster(
  classSection: ClassSection,
): AttendanceStudent[] {
  const existing = studentMocks
    .filter(
      (student) =>
        student.status === 'active' &&
        student.campusId === classSection.campusId &&
        student.className === classSection.gradeName &&
        student.section === classSection.section,
    )
    .map((student) => ({
      id: student.id,
      admissionId: student.admissionId,
      rollNumber: student.rollNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      photoUrl: student.photoUrl,
    }));
  const roster = [...existing];
  for (
    let index = roster.length;
    index < classSection.studentCount;
    index += 1
  ) {
    const serial = classSection.gradeLevel * 100 + index + 1;
    roster.push({
      id: `${classSection.id}-student-${String(index + 1).padStart(2, '0')}`,
      admissionId: `CRA-2026-${String(serial).padStart(4, '0')}`,
      rollNumber: `${String(classSection.gradeLevel).padStart(2, '0')}-${classSection.section}-${String(index + 1).padStart(2, '0')}`,
      firstName:
        firstNames[(index + classSection.gradeLevel) % firstNames.length],
      lastName:
        lastNames[(index * 3 + classSection.gradeLevel) % lastNames.length],
      photoUrl: '',
    });
  }
  return roster;
}

export function makeAttendanceRecords(
  classSection: ClassSection,
  date: string,
): AttendanceRecord[] {
  const dateSeed = [...date].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return makeAttendanceRoster(classSection).map((student, index) => {
    const marker = (index * 7 + dateSeed) % 29;
    let status: AttendanceStatus = 'present';
    if (marker === 0 || marker === 11) status = 'absent';
    else if (marker === 5 || marker === 17) status = 'late';
    else if (marker === 23) status = 'leave';
    return {
      student,
      status,
      note:
        status === 'leave'
          ? 'Approved family leave'
          : status === 'late'
            ? 'Arrived after assembly'
            : '',
    };
  });
}
