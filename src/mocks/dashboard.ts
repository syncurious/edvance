import type {
  AttendanceDataPoint,
  DashboardActivity,
  DashboardProgressItem,
  RevenueDataPoint,
  SchoolSummary,
  StudentGrowthDataPoint,
} from '@/features/dashboard/types';

export const revenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 2800000, target: 3000000 },
  { month: 'Feb', revenue: 3100000, target: 3100000 },
  { month: 'Mar', revenue: 3250000, target: 3200000 },
  { month: 'Apr', revenue: 3480000, target: 3350000 },
  { month: 'May', revenue: 3670000, target: 3500000 },
  { month: 'Jun', revenue: 3820000, target: 3650000 },
  { month: 'Jul', revenue: 4050000, target: 3900000 },
  { month: 'Aug', revenue: 4280000, target: 4100000 },
];

export const studentGrowthData: StudentGrowthDataPoint[] = [
  { month: 'Mar', students: 74800, newStudents: 1120 },
  { month: 'Apr', students: 76240, newStudents: 1440 },
  { month: 'May', students: 77830, newStudents: 1590 },
  { month: 'Jun', students: 79320, newStudents: 1490 },
  { month: 'Jul', students: 81010, newStudents: 1690 },
  { month: 'Aug', students: 82450, newStudents: 1440 },
];

export const attendanceData: AttendanceDataPoint[] = [
  { status: 'present', label: 'Present', value: 2303 },
  { status: 'absent', label: 'Absent', value: 72 },
  { status: 'late', label: 'Late', value: 46 },
  { status: 'leave', label: 'Leave', value: 29 },
];

export const recentActivities: DashboardActivity[] = [
  {
    id: 'activity-1',
    title: 'Crescent Academy joined Professional',
    description: 'Subscription upgraded by platform operations.',
    timestamp: '8 minutes ago',
    tone: 'success',
  },
  {
    id: 'activity-2',
    title: 'Attendance submitted for Grade 7-A',
    description: '34 students marked by Nadia Ahmed.',
    timestamp: '22 minutes ago',
    tone: 'info',
  },
  {
    id: 'activity-3',
    title: 'Twelve invoices moved to overdue',
    description: 'The finance team has been notified.',
    timestamp: '1 hour ago',
    tone: 'warning',
  },
  {
    id: 'activity-4',
    title: 'August student import completed',
    description: '186 student profiles were added successfully.',
    timestamp: '3 hours ago',
    tone: 'neutral',
  },
];

export const recentSchools: SchoolSummary[] = [
  {
    id: 'school-1',
    name: 'Crescent Academy',
    code: 'CRA-001',
    plan: 'Professional',
    students: 2450,
    status: 'Active',
  },
  {
    id: 'school-2',
    name: 'Beacon Valley School',
    code: 'BVS-014',
    plan: 'Enterprise',
    students: 3890,
    status: 'Active',
  },
  {
    id: 'school-3',
    name: 'Northstar Learning Campus',
    code: 'NLC-028',
    plan: 'Starter',
    students: 640,
    status: 'Trial',
  },
  {
    id: 'school-4',
    name: 'Riverstone Public School',
    code: 'RPS-033',
    plan: 'Professional',
    students: 1740,
    status: 'Past due',
  },
];

export const progressItems: DashboardProgressItem[] = [
  {
    id: 'onboarding',
    label: 'School onboarding',
    value: 18,
    target: 24,
    detail: '6 schools remaining this month',
  },
  {
    id: 'attendance',
    label: 'Attendance completion',
    value: 31,
    target: 34,
    detail: '3 classes have not submitted',
  },
  {
    id: 'collections',
    label: 'Fee collection target',
    value: 84,
    target: 100,
    detail: 'Rs 1.6M remaining this term',
  },
];
