export type PlanId = 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'past-due' | 'cancelled';
export type BillingStatus = 'paid' | 'pending' | 'overdue' | 'failed';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  schools: number;
  highlighted?: boolean;
  features: string[];
  limits: {
    students: string;
    sms: string;
    storage: string;
  };
}

export interface SubscriptionRecord {
  id: string;
  school: string;
  plan: string;
  status: SubscriptionStatus;
  monthlyAmount: number;
  renewsAt: string;
}

export interface BillingRecord {
  id: string;
  invoice: string;
  school: string;
  plan: string;
  amount: number;
  dueAt: string;
  status: BillingStatus;
}

export interface UsageMetric {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
  detail: string;
}

export interface SchoolUsage {
  id: string;
  school: string;
  plan: string;
  sms: number;
  storage: number;
  users: number;
}

export interface SubscriptionOverview {
  plans: SubscriptionPlan[];
  subscriptions: SubscriptionRecord[];
  activeSubscriptions: number;
  trialSubscriptions: number;
  monthlyRecurringRevenue: number;
}

export interface BillingOverview {
  records: BillingRecord[];
  collected: number;
  outstanding: number;
  overdue: number;
  failedPayments: number;
}

export interface UsageOverview {
  metrics: UsageMetric[];
  schools: SchoolUsage[];
}
