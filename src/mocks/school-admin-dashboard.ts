import type {
  CampusId,
  CampusOption,
  SchoolAdminDashboardData,
} from '@/features/dashboard/types';

export const campusOptions: CampusOption[] = [
  { id: 'all', name: 'All campuses' },
  { id: 'north', name: 'North Campus' },
  { id: 'central', name: 'Central Campus' },
  { id: 'south', name: 'South Campus' },
];

const campusNumbers: Record<
  CampusId,
  {
    students: number;
    teachers: number;
    attendance: [number, number, number, number];
    fees: number;
    enrollments: number[];
  }
> = {
  all: {
    students: 2450,
    teachers: 168,
    attendance: [2303, 72, 46, 29],
    fees: 3820000,
    enrollments: [41, 54, 47, 62, 58, 71],
  },
  north: {
    students: 980,
    teachers: 64,
    attendance: [944, 17, 12, 7],
    fees: 1620000,
    enrollments: [18, 21, 19, 26, 24, 31],
  },
  central: {
    students: 860,
    teachers: 59,
    attendance: [807, 28, 16, 9],
    fees: 1280000,
    enrollments: [14, 20, 17, 22, 21, 25],
  },
  south: {
    students: 610,
    teachers: 45,
    attendance: [552, 27, 18, 13],
    fees: 920000,
    enrollments: [9, 13, 11, 14, 13, 15],
  },
};

const campusEvents: Record<
  CampusId,
  SchoolAdminDashboardData['upcomingEvents']
> = {
  all: [
    {
      id: 'event-1',
      day: '08',
      month: 'SEP',
      title: 'Parent–teacher conferences',
      detail: 'All campuses · Grades 6–10',
      time: '9:00 AM–1:00 PM',
    },
    {
      id: 'event-2',
      day: '12',
      month: 'SEP',
      title: 'Inter-campus science fair',
      detail: 'North Campus auditorium',
      time: '10:30 AM',
    },
    {
      id: 'event-3',
      day: '16',
      month: 'SEP',
      title: 'September fee due date',
      detail: 'Finance office · All families',
      time: 'End of day',
    },
  ],
  north: [
    {
      id: 'north-event-1',
      day: '08',
      month: 'SEP',
      title: 'Parent–teacher conferences',
      detail: 'North Campus · Grades 6–10',
      time: '9:00 AM–1:00 PM',
    },
    {
      id: 'north-event-2',
      day: '12',
      month: 'SEP',
      title: 'Inter-campus science fair',
      detail: 'Main auditorium',
      time: '10:30 AM',
    },
  ],
  central: [
    {
      id: 'central-event-1',
      day: '09',
      month: 'SEP',
      title: 'Grade 8 curriculum review',
      detail: 'Central Campus · Faculty room',
      time: '2:30 PM',
    },
    {
      id: 'central-event-2',
      day: '14',
      month: 'SEP',
      title: 'Student council election',
      detail: 'Central Campus courtyard',
      time: '11:00 AM',
    },
  ],
  south: [
    {
      id: 'south-event-1',
      day: '10',
      month: 'SEP',
      title: 'Sports trials',
      detail: 'South Campus grounds',
      time: '8:00 AM',
    },
    {
      id: 'south-event-2',
      day: '15',
      month: 'SEP',
      title: 'Primary years showcase',
      detail: 'South Campus multipurpose hall',
      time: '4:00 PM',
    },
  ],
};

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

function buildDashboard(campusId: CampusId): SchoolAdminDashboardData {
  const campus = campusNumbers[campusId];
  const campusName =
    campusOptions.find((option) => option.id === campusId)?.name ??
    'All campuses';
  const presentRate =
    Math.round((campus.attendance[0] / campus.students) * 1000) / 10;

  return {
    schoolName: 'Crescent Academy',
    campusId,
    campusName,
    updatedAt: '05 Sep 2026 · 9:42 AM PKT',
    metrics: [
      {
        id: 'students',
        label: 'Students',
        value: campus.students.toLocaleString('en-PK'),
        trendValue: `+${campus.enrollments.at(-1)}`,
        trendLabel: 'new this month',
        trendDirection: 'up',
      },
      {
        id: 'teachers',
        label: 'Teachers',
        value: campus.teachers.toLocaleString('en-PK'),
        trendValue: `${Math.round(campus.students / campus.teachers)}:1`,
        trendLabel: 'student–teacher ratio',
        trendDirection: 'flat',
      },
      {
        id: 'attendance',
        label: 'Attendance today',
        value: `${presentRate}%`,
        trendValue: '+1.8%',
        trendLabel: 'from last Friday',
        trendDirection: 'up',
      },
      {
        id: 'fees-collected',
        label: 'Fees collected',
        value: `Rs ${(campus.fees / 1000000).toFixed(2)}M`,
        trendValue: '84%',
        trendLabel: 'of September target',
        trendDirection: 'up',
      },
    ],
    attendance: [
      { status: 'present', label: 'Present', value: campus.attendance[0] },
      { status: 'absent', label: 'Absent', value: campus.attendance[1] },
      { status: 'late', label: 'Late', value: campus.attendance[2] },
      { status: 'leave', label: 'Leave', value: campus.attendance[3] },
    ],
    feeCollection: months.map((month, index) => {
      const scale = 0.72 + index * 0.055;
      const target = Math.round(campus.fees / 0.84);
      return {
        month,
        revenue: Math.round(campus.fees * scale),
        target,
      };
    }),
    studentGrowth: months.map((month, index) => ({
      month,
      students:
        campus.students -
        campus.enrollments
          .slice(index + 1)
          .reduce((sum, value) => sum + value, 0),
      newStudents: campus.enrollments[index] ?? 0,
    })),
    upcomingEvents: campusEvents[campusId],
    recentActivity: [
      {
        id: `${campusId}-activity-1`,
        title: 'Morning attendance submitted',
        description: `${campusName} · 42 of 44 classes completed.`,
        timestamp: '18 minutes ago',
        tone: 'success',
      },
      {
        id: `${campusId}-activity-2`,
        title: 'Fee payment recorded',
        description: 'Receipt FEE-260905-184 was issued to the family.',
        timestamp: '37 minutes ago',
        tone: 'info',
      },
      {
        id: `${campusId}-activity-3`,
        title: 'Attendance needs review',
        description: 'Two class registers are still awaiting submission.',
        timestamp: '1 hour ago',
        tone: 'warning',
      },
    ],
  };
}

export const schoolAdminDashboardMocks: Record<
  CampusId,
  SchoolAdminDashboardData
> = {
  all: buildDashboard('all'),
  north: buildDashboard('north'),
  central: buildDashboard('central'),
  south: buildDashboard('south'),
};
