import {
  BarChart3,
  BookOpenCheck,
  Building2,
  CalendarCheck2,
  CreditCard,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  ReceiptText,
  School,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  WalletCards,
} from 'lucide-react';

import type { AdminShellConfig } from '@/types/navigation';

export const superAdminConfig: AdminShellConfig = {
  role: 'super-admin',
  roleLabel: 'Super Admin',
  workspaceLabel: 'Platform workspace',
  profile: {
    name: 'Areeb Khan',
    email: 'areeb@edvance.pk',
    initials: 'AK',
  },
  schools: [
    { label: 'All schools', value: 'all' },
    { label: 'Crescent Academy', value: 'crescent' },
    { label: 'Beacon Valley School', value: 'beacon' },
  ],
  navigation: [
    {
      label: 'Overview',
      items: [
        {
          title: 'Dashboard',
          href: '/super-admin/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: 'Platform',
      items: [
        {
          title: 'Schools',
          href: '/super-admin/schools',
          icon: Building2,
          children: [
            { title: 'All schools', href: '/super-admin/schools' },
            { title: 'Add school', href: '/super-admin/schools/new' },
          ],
        },
        {
          title: 'Subscriptions',
          href: '/super-admin/subscriptions',
          icon: CreditCard,
          children: [
            { title: 'Plans', href: '/super-admin/subscriptions' },
            { title: 'Billing', href: '/super-admin/billing' },
            { title: 'Usage', href: '/super-admin/subscriptions/usage' },
          ],
        },
        {
          title: 'Users',
          href: '/super-admin/users',
          icon: UsersRound,
        },
      ],
    },
    {
      label: 'System',
      items: [
        {
          title: 'Reports',
          href: '/super-admin/reports',
          icon: BarChart3,
        },
        {
          title: 'Settings',
          href: '/super-admin/settings',
          icon: Settings,
        },
      ],
    },
  ],
};

export const schoolAdminConfig: AdminShellConfig = {
  role: 'school-admin',
  roleLabel: 'School Admin',
  workspaceLabel: 'Crescent Academy',
  profile: {
    name: 'Sara Malik',
    email: 'sara@crescent.edu.pk',
    initials: 'SM',
  },
  schools: [
    { label: 'All campuses', value: 'all' },
    { label: 'North Campus', value: 'north' },
    { label: 'Central Campus', value: 'central' },
    { label: 'South Campus', value: 'south' },
  ],
  navigation: [
    {
      label: 'Overview',
      items: [
        {
          title: 'Dashboard',
          href: '/school-admin/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: 'People',
      items: [
        {
          title: 'Students',
          href: '/school-admin/students',
          icon: GraduationCap,
          badge: '2.4k',
        },
        {
          title: 'Teachers',
          href: '/school-admin/teachers',
          icon: Users,
        },
      ],
    },
    {
      label: 'Academics',
      items: [
        {
          title: 'Classes',
          href: '/school-admin/classes',
          icon: LibraryBig,
        },
        {
          title: 'Attendance',
          href: '/school-admin/attendance',
          icon: CalendarCheck2,
          children: [
            { title: 'Mark attendance', href: '/school-admin/attendance' },
            { title: 'Reports', href: '/school-admin/attendance/reports' },
          ],
        },
        {
          title: 'Exams',
          href: '/school-admin/exams',
          icon: BookOpenCheck,
          children: [
            { title: 'All exams', href: '/school-admin/exams' },
            { title: 'Create exam', href: '/school-admin/exams/new' },
          ],
        },
        {
          title: 'Reports',
          href: '/school-admin/reports',
          icon: FileBarChart,
        },
      ],
    },
    {
      label: 'Finance',
      items: [
        {
          title: 'Fees',
          href: '/school-admin/fees',
          icon: WalletCards,
          children: [
            { title: 'Overview', href: '/school-admin/fees' },
            { title: 'Invoices', href: '/school-admin/fees/invoices' },
            { title: 'Payments', href: '/school-admin/fees/payments' },
            { title: 'Defaulters', href: '/school-admin/fees/defaulters' },
          ],
        },
        {
          title: 'Fee structures',
          href: '/school-admin/fees/structures',
          icon: ReceiptText,
        },
      ],
    },
    {
      label: 'School',
      items: [
        {
          title: 'Settings',
          href: '/school-admin/settings',
          icon: Settings,
        },
      ],
    },
  ],
};

export const roleHomeIcons = {
  'super-admin': ShieldCheck,
  'school-admin': School,
} as const;
