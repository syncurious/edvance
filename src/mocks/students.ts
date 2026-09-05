import type {
  Student,
  StudentClass,
  StudentSection,
  StudentStatus,
} from '@/features/students/types';

interface StudentSeed {
  id: string;
  admissionId: string;
  name: string;
  campusId: 'north' | 'central' | 'south';
  className: StudentClass;
  section: StudentSection;
  rollNumber: string;
  status?: StudentStatus;
  parentName: string;
  parentPhone: string;
  attendance: number;
  feeStatus?: Student['fees']['status'];
}

const campusNames = {
  north: 'North Campus',
  central: 'Central Campus',
  south: 'South Campus',
} as const;

function makeStudent(seed: StudentSeed, index: number): Student {
  const [firstName, ...lastParts] = seed.name.split(' ');
  const lastName = lastParts.join(' ');
  const pending =
    seed.feeStatus === 'paid'
      ? 0
      : seed.feeStatus === 'overdue'
        ? 28500
        : 14000;

  return {
    id: seed.id,
    admissionId: seed.admissionId,
    firstName,
    lastName,
    photoUrl: '',
    dateOfBirth: `${2010 + (index % 4)}-${String((index % 9) + 1).padStart(2, '0')}-${String((index % 20) + 5).padStart(2, '0')}`,
    gender: index % 2 === 0 ? 'female' : 'male',
    campusId: seed.campusId,
    campusName: campusNames[seed.campusId],
    className: seed.className,
    section: seed.section,
    rollNumber: seed.rollNumber,
    status: seed.status ?? 'active',
    admissionDate: `${2022 + (index % 3)}-04-${String((index % 18) + 2).padStart(2, '0')}`,
    address: `${18 + index} Park View Road, Islamabad`,
    bloodGroup: ['A+', 'B+', 'O+', 'AB+'][index % 4],
    house: ['Iqbal', 'Jinnah', 'Fatima', 'Edhi'][index % 4],
    previousSchool: index % 3 === 0 ? 'City Foundation School' : '—',
    parent: {
      name: seed.parentName,
      relationship: index % 3 === 0 ? 'Mother' : 'Father',
      email: `${seed.parentName.toLowerCase().replaceAll(' ', '.')}@example.com`,
      phone: seed.parentPhone,
      occupation: ['Engineer', 'Teacher', 'Business owner', 'Doctor'][
        index % 4
      ],
    },
    attendance: {
      percentage: seed.attendance,
      present: Math.round(seed.attendance * 1.32),
      absent: Math.max(1, Math.round((100 - seed.attendance) / 2)),
      late: (index % 4) + 1,
      leave: index % 3,
    },
    fees: {
      total: 114000,
      paid: 114000 - pending,
      pending,
      status: seed.feeStatus ?? (pending === 0 ? 'paid' : 'partial'),
    },
    examResults: [
      { subject: 'English', score: 82 + (index % 9), total: 100, grade: 'A' },
      {
        subject: 'Mathematics',
        score: 76 + (index % 12),
        total: 100,
        grade: 'A',
      },
      { subject: 'Science', score: 79 + (index % 10), total: 100, grade: 'A' },
      {
        subject: 'Pakistan Studies',
        score: 72 + (index % 13),
        total: 100,
        grade: 'B+',
      },
    ],
    documents: [
      {
        id: `${seed.id}-doc-1`,
        name: 'Birth certificate',
        type: 'PDF',
        updatedAt: '12 Aug 2026',
      },
      {
        id: `${seed.id}-doc-2`,
        name: 'Previous school record',
        type: 'PDF',
        updatedAt: '12 Aug 2026',
      },
      {
        id: `${seed.id}-doc-3`,
        name: 'Guardian ID copy',
        type: 'Image',
        updatedAt: '14 Aug 2026',
      },
    ],
  };
}

const studentSeeds: StudentSeed[] = [
  {
    id: 'std-ayesha-khan',
    admissionId: 'CRA-2024-0018',
    name: 'Ayesha Khan',
    campusId: 'north',
    className: 'Grade 8',
    section: 'A',
    rollNumber: '08-A-018',
    parentName: 'Imran Khan',
    parentPhone: '+92 300 123 4018',
    attendance: 96.4,
    feeStatus: 'paid',
  },
  {
    id: 'std-hamza-ali',
    admissionId: 'CRA-2024-0024',
    name: 'Hamza Ali',
    campusId: 'central',
    className: 'Grade 7',
    section: 'B',
    rollNumber: '07-B-024',
    parentName: 'Sadia Ali',
    parentPhone: '+92 301 224 5024',
    attendance: 92.1,
  },
  {
    id: 'std-zara-ahmed',
    admissionId: 'CRA-2023-0041',
    name: 'Zara Ahmed',
    campusId: 'south',
    className: 'Grade 9',
    section: 'A',
    rollNumber: '09-A-041',
    parentName: 'Faisal Ahmed',
    parentPhone: '+92 302 325 6041',
    attendance: 97.2,
    feeStatus: 'paid',
  },
  {
    id: 'std-bilal-hussain',
    admissionId: 'CRA-2023-0057',
    name: 'Bilal Hussain',
    campusId: 'north',
    className: 'Grade 10',
    section: 'C',
    rollNumber: '10-C-057',
    parentName: 'Nadia Hussain',
    parentPhone: '+92 303 426 7057',
    attendance: 88.6,
    feeStatus: 'overdue',
  },
  {
    id: 'std-maryam-iqbal',
    admissionId: 'CRA-2025-0062',
    name: 'Maryam Iqbal',
    campusId: 'central',
    className: 'Grade 6',
    section: 'A',
    rollNumber: '06-A-062',
    parentName: 'Javed Iqbal',
    parentPhone: '+92 304 527 8062',
    attendance: 94.8,
  },
  {
    id: 'std-usman-raza',
    admissionId: 'CRA-2024-0075',
    name: 'Usman Raza',
    campusId: 'south',
    className: 'Grade 8',
    section: 'B',
    rollNumber: '08-B-075',
    parentName: 'Farah Raza',
    parentPhone: '+92 305 628 9075',
    attendance: 91.3,
  },
  {
    id: 'std-noor-fatima',
    admissionId: 'CRA-2025-0081',
    name: 'Noor Fatima',
    campusId: 'north',
    className: 'Grade 5',
    section: 'A',
    rollNumber: '05-A-081',
    parentName: 'Ali Hassan',
    parentPhone: '+92 306 729 1081',
    attendance: 98.1,
    feeStatus: 'paid',
  },
  {
    id: 'std-daniyal-sheikh',
    admissionId: 'CRA-2022-0093',
    name: 'Daniyal Sheikh',
    campusId: 'central',
    className: 'Grade 10',
    section: 'A',
    rollNumber: '10-A-093',
    parentName: 'Samina Sheikh',
    parentPhone: '+92 307 820 2093',
    attendance: 86.9,
    status: 'inactive',
    feeStatus: 'overdue',
  },
  {
    id: 'std-maham-noor',
    admissionId: 'CRA-2024-0106',
    name: 'Maham Noor',
    campusId: 'south',
    className: 'Grade 7',
    section: 'C',
    rollNumber: '07-C-106',
    parentName: 'Waqas Noor',
    parentPhone: '+92 308 921 3106',
    attendance: 95.6,
    feeStatus: 'paid',
  },
  {
    id: 'std-ibrahim-malik',
    admissionId: 'CRA-2023-0118',
    name: 'Ibrahim Malik',
    campusId: 'north',
    className: 'Grade 9',
    section: 'B',
    rollNumber: '09-B-118',
    parentName: 'Hina Malik',
    parentPhone: '+92 309 122 4118',
    attendance: 90.4,
  },
  {
    id: 'std-hira-aslam',
    admissionId: 'CRA-2025-0129',
    name: 'Hira Aslam',
    campusId: 'central',
    className: 'Grade 5',
    section: 'B',
    rollNumber: '05-B-129',
    parentName: 'Aslam Qureshi',
    parentPhone: '+92 310 223 5129',
    attendance: 97.7,
    feeStatus: 'paid',
  },
  {
    id: 'std-saif-rehman',
    admissionId: 'CRA-2022-0142',
    name: 'Saif Rehman',
    campusId: 'south',
    className: 'Grade 10',
    section: 'B',
    rollNumber: '10-B-142',
    parentName: 'Khalid Rehman',
    parentPhone: '+92 311 324 6142',
    attendance: 89.2,
    status: 'graduated',
    feeStatus: 'paid',
  },
];

export const studentMocks: Student[] = studentSeeds.map(makeStudent);
