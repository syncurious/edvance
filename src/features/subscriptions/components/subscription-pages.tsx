'use client';

import {
  ArrowLeft,
  Building2,
  Check,
  CreditCard,
  HardDrive,
  MessageSquareText,
  ReceiptText,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/shared/data-table';
import { StatCard } from '@/components/shared/stat-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BillingStatusBadge,
  SubscriptionStatusBadge,
} from '@/features/subscriptions/components/subscription-status';
import { subscriptionService } from '@/features/subscriptions/services';
import type { SubscriptionService } from '@/features/subscriptions/services';
import type {
  BillingRecord,
  SchoolUsage,
  SubscriptionPlan,
  SubscriptionRecord,
  UsageMetric,
} from '@/features/subscriptions/types';
import { useServiceData } from '@/hooks/use-service-data';
import { cn } from '@/lib/utils';

const currency = new Intl.NumberFormat('en-PK');
const shortDate = new Intl.DateTimeFormat('en-PK', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const loadOverview = (service: SubscriptionService) => service.getOverview();
const loadBilling = (service: SubscriptionService) => service.getBilling();
const loadUsage = (service: SubscriptionService) => service.getUsage();

const subscriptionColumns: DataTableColumn<SubscriptionRecord>[] = [
  {
    id: 'school',
    header: 'School',
    cell: (record) => <span className="font-bold">{record.school}</span>,
  },
  { id: 'plan', header: 'Plan', cell: (record) => record.plan },
  {
    id: 'amount',
    header: 'Monthly amount',
    className: 'text-right',
    cell: (record) => `Rs ${currency.format(record.monthlyAmount)}`,
  },
  {
    id: 'renews',
    header: 'Renews',
    cell: (record) => shortDate.format(new Date(record.renewsAt)),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (record) => <SubscriptionStatusBadge status={record.status} />,
  },
];

const billingColumns: DataTableColumn<BillingRecord>[] = [
  {
    id: 'invoice',
    header: 'Invoice',
    cell: (record) => (
      <span className="font-mono text-xs font-bold">{record.invoice}</span>
    ),
  },
  {
    id: 'school',
    header: 'School',
    cell: (record) => <span className="font-bold">{record.school}</span>,
  },
  { id: 'plan', header: 'Plan', cell: (record) => record.plan },
  {
    id: 'amount',
    header: 'Amount',
    className: 'text-right',
    cell: (record) => `Rs ${currency.format(record.amount)}`,
  },
  {
    id: 'due',
    header: 'Due date',
    cell: (record) => shortDate.format(new Date(record.dueAt)),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (record) => <BillingStatusBadge status={record.status} />,
  },
];

const usageColumns: DataTableColumn<SchoolUsage>[] = [
  {
    id: 'school',
    header: 'School',
    cell: (record) => <span className="font-bold">{record.school}</span>,
  },
  { id: 'plan', header: 'Plan', cell: (record) => record.plan },
  {
    id: 'sms',
    header: 'SMS',
    className: 'text-right',
    cell: (record) => currency.format(record.sms),
  },
  {
    id: 'storage',
    header: 'Storage',
    className: 'text-right',
    cell: (record) => `${record.storage} GB`,
  },
  {
    id: 'users',
    header: 'Staff users',
    className: 'text-right',
    cell: (record) => currency.format(record.users),
  },
];

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  return (
    <Card className={cn(plan.highlighted && 'ring-2 ring-primary')}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
              {plan.highlighted ? 'Most popular' : `${plan.schools} schools`}
            </p>
            <CardTitle className="mt-2 text-xl">{plan.name}</CardTitle>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
            {plan.schools} subscribed
          </span>
        </div>
        <CardDescription className="mt-2 min-h-10">
          {plan.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div>
          <span className="text-3xl font-black">
            Rs {currency.format(plan.monthlyPrice)}
          </span>
          <span className="text-sm text-muted-foreground"> / month</span>
          <p className="mt-1 text-xs text-muted-foreground">
            Rs {currency.format(plan.annualPrice)} billed annually
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2 rounded-lg bg-muted/55 p-3 text-center text-xs">
          <div>
            <dt className="text-muted-foreground">Students</dt>
            <dd className="mt-1 font-bold">{plan.limits.students}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">SMS</dt>
            <dd className="mt-1 font-bold">{plan.limits.sms}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Storage</dt>
            <dd className="mt-1 font-bold">{plan.limits.storage}</dd>
          </div>
        </dl>
        <ul className="grid gap-2" aria-label={`${plan.name} features`}>
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check
                aria-hidden="true"
                className="size-4 text-success-foreground"
              />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          variant={plan.highlighted ? 'default' : 'outline'}
          nativeButton={false}
          render={<Link href="/super-admin/schools" />}
        >
          View schools
        </Button>
      </CardContent>
    </Card>
  );
}

function PlanSkeletons() {
  return [0, 1, 2].map((item) => (
    <Card key={item} aria-label="Loading subscription plan">
      <CardContent className="grid gap-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-28 w-full" />
      </CardContent>
    </Card>
  ));
}

function PageError({ message, retry }: { message: string; retry: () => void }) {
  return (
    <Card>
      <CardContent>
        <DashboardErrorState message={message} onRetry={retry} />
      </CardContent>
    </Card>
  );
}

export function SubscriptionsPage({
  service = subscriptionService,
}: {
  service?: SubscriptionService;
}) {
  const { data, state, retry } = useServiceData(service, loadOverview);
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="SaaS operations"
        title="Subscriptions"
        description="Compare plans, understand adoption, and monitor every active school subscription."
        actions={
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/super-admin/billing" />}
            >
              <ReceiptText /> Billing
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/super-admin/subscriptions/usage" />}
            >
              <HardDrive /> Usage
            </Button>
          </>
        }
      />
      {state === 'error' ? (
        <PageError
          message="Subscription information could not be loaded."
          retry={retry}
        />
      ) : (
        <>
          <section
            aria-label="Subscription summary"
            className="grid gap-4 sm:grid-cols-3"
          >
            <StatCard
              label="Active subscriptions"
              value={currency.format(data?.activeSubscriptions ?? 0)}
              icon={CreditCard}
              tone="success"
              state={state}
              description="Schools with active access"
            />
            <StatCard
              label="Trial subscriptions"
              value={currency.format(data?.trialSubscriptions ?? 0)}
              icon={Building2}
              tone="info"
              state={state}
              description="Schools currently evaluating"
            />
            <StatCard
              label="Monthly recurring revenue"
              value={`Rs ${currency.format(data?.monthlyRecurringRevenue ?? 0)}`}
              icon={WalletCards}
              state={state}
              description="Current contracted MRR"
            />
          </section>
          <section
            aria-label="Subscription plans"
            className="grid gap-4 xl:grid-cols-3"
          >
            {state === 'loading' ? (
              <PlanSkeletons />
            ) : data?.plans.length ? (
              data.plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)
            ) : (
              <div className="xl:col-span-3">
                <DashboardEmptyState
                  title="No plans configured"
                  description="Subscription plans will appear here when they are available."
                />
              </div>
            )}
          </section>
          <DataTable
            title="School subscriptions"
            description="Renewal and account status for current customers"
            data={data?.subscriptions ?? []}
            columns={subscriptionColumns}
            getRowKey={(record) => record.id}
            state={state}
            emptyTitle="No subscriptions found"
            onRetry={retry}
          />
        </>
      )}
    </div>
  );
}

export function BillingPage({
  service = subscriptionService,
}: {
  service?: SubscriptionService;
}) {
  const { data, state, retry } = useServiceData(service, loadBilling);
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Subscriptions"
        title="Billing"
        description="Track collected, outstanding, overdue, and failed subscription payments."
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/super-admin/subscriptions" />}
          >
            <ArrowLeft /> Plans
          </Button>
        }
      />
      {state === 'error' ? (
        <PageError
          message="Billing information could not be loaded."
          retry={retry}
        />
      ) : (
        <>
          <section
            aria-label="Billing summary"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              label="Collected this month"
              value={`Rs ${currency.format(data?.collected ?? 0)}`}
              icon={WalletCards}
              tone="success"
              state={state}
              description="Settled payments"
            />
            <StatCard
              label="Outstanding"
              value={`Rs ${currency.format(data?.outstanding ?? 0)}`}
              icon={ReceiptText}
              tone="info"
              state={state}
              description="Pending collection"
            />
            <StatCard
              label="Overdue"
              value={`Rs ${currency.format(data?.overdue ?? 0)}`}
              icon={CreditCard}
              tone="warning"
              state={state}
              description="Past due invoices"
            />
            <StatCard
              label="Failed payments"
              value={currency.format(data?.failedPayments ?? 0)}
              icon={CreditCard}
              tone="warning"
              state={state}
              description="Requires follow-up"
            />
          </section>
          <DataTable
            title="Recent invoices"
            description="Latest billing activity across school subscriptions"
            data={data?.records ?? []}
            columns={billingColumns}
            getRowKey={(record) => record.id}
            state={state}
            emptyTitle="No invoices found"
            onRetry={retry}
          />
        </>
      )}
    </div>
  );
}

const usageIcons = {
  sms: MessageSquareText,
  storage: HardDrive,
  users: UsersRound,
} as const;

function UsageCard({ metric }: { metric: UsageMetric }) {
  const percentage = Math.min(
    100,
    Math.round((metric.used / metric.limit) * 100),
  );
  const Icon = usageIcons[metric.id as keyof typeof usageIcons] ?? HardDrive;
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_auto]">
        <div>
          <CardTitle>{metric.label}</CardTitle>
          <CardDescription className="mt-1">{metric.detail}</CardDescription>
        </div>
        <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Progress
          value={percentage}
          aria-label={`${metric.label}: ${percentage}% used`}
        >
          <ProgressLabel>{metric.label}</ProgressLabel>
          <ProgressValue>{() => `${percentage}%`}</ProgressValue>
        </Progress>
        <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
          <p className="font-bold text-foreground">
            {currency.format(metric.used)} {metric.unit} used
          </p>
          <p>
            Limit: {currency.format(metric.limit)} {metric.unit}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function UsagePage({
  service = subscriptionService,
}: {
  service?: SubscriptionService;
}) {
  const { data, state, retry } = useServiceData(service, loadUsage);
  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Subscriptions"
        title="Platform usage"
        description="See aggregate capacity and identify schools with the highest resource use."
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/super-admin/subscriptions" />}
          >
            <ArrowLeft /> Plans
          </Button>
        }
      />
      {state === 'error' ? (
        <PageError
          message="Usage information could not be loaded."
          retry={retry}
        />
      ) : (
        <>
          <section
            aria-label="Usage summary"
            className="grid gap-4 xl:grid-cols-3"
          >
            {state === 'loading' ? (
              <PlanSkeletons />
            ) : data?.metrics.length ? (
              data.metrics.map((metric) => (
                <UsageCard key={metric.id} metric={metric} />
              ))
            ) : (
              <div className="xl:col-span-3">
                <DashboardEmptyState
                  title="No usage reported"
                  description="Resource usage will appear after schools begin using the platform."
                />
              </div>
            )}
          </section>
          <DataTable
            title="Highest school usage"
            description="Schools consuming the most platform resources this month"
            data={data?.schools ?? []}
            columns={usageColumns}
            getRowKey={(record) => record.id}
            state={state}
            emptyTitle="No usage reported"
            onRetry={retry}
          />
        </>
      )}
    </div>
  );
}
