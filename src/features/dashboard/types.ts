export type DashboardViewState = 'ready' | 'loading' | 'empty' | 'error';

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
}

export interface StudentGrowthDataPoint {
  month: string;
  students: number;
  newStudents: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceDataPoint {
  status: AttendanceStatus;
  label: string;
  value: number;
}

export type ActivityTone = 'success' | 'info' | 'warning' | 'neutral';

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone: ActivityTone;
}

export interface SchoolSummary {
  id: string;
  name: string;
  code: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  students: number;
  status: 'Active' | 'Trial' | 'Past due';
}

export interface DashboardProgressItem {
  id: string;
  label: string;
  value: number;
  target: number;
  detail: string;
}

export type SuperAdminMetricId =
  | 'total-schools'
  | 'active-schools'
  | 'total-students'
  | 'total-teachers'
  | 'monthly-revenue'
  | 'sms-usage';

export interface SuperAdminMetric {
  id: SuperAdminMetricId;
  label: string;
  value: string;
  trendValue: string;
  trendLabel: string;
  trendDirection: 'up' | 'down' | 'flat';
  positive?: boolean;
}

export interface SchoolGrowthDataPoint {
  month: string;
  total: number;
  active: number;
}

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';

export interface SubscriptionDataPoint {
  plan: SubscriptionPlan;
  label: string;
  value: number;
}

export interface PaymentSummary {
  id: string;
  invoice: string;
  school: string;
  amount: number;
  paidAt: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface SuperAdminDashboardData {
  updatedAt: string;
  metrics: SuperAdminMetric[];
  revenue: RevenueDataPoint[];
  schoolGrowth: SchoolGrowthDataPoint[];
  studentGrowth: StudentGrowthDataPoint[];
  subscriptions: SubscriptionDataPoint[];
  recentSchools: SchoolSummary[];
  recentPayments: PaymentSummary[];
  recentActivity: DashboardActivity[];
  progress: DashboardProgressItem[];
}
