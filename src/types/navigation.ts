import type { LucideIcon } from 'lucide-react';

export type AdminRole = 'super-admin' | 'school-admin';

export interface NavigationItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
  children?: Array<{
    title: string;
    href: string;
  }>;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface AdminShellProfile {
  name: string;
  email: string;
  initials: string;
}

export interface AdminShellConfig {
  role: AdminRole;
  roleLabel: string;
  workspaceLabel: string;
  profile: AdminShellProfile;
  navigation: NavigationGroup[];
  schools: Array<{
    label: string;
    value: string;
  }>;
}
