export const platformReportTypes = [
  'school-health',
  'subscriptions',
  'revenue',
  'usage',
] as const;

export type PlatformReportType = (typeof platformReportTypes)[number];

export interface PlatformReportQuery {
  type: PlatformReportType;
  search: string;
  startDate: string;
  endDate: string;
}

export interface PlatformReport {
  title: string;
  description: string;
  metrics: Array<{
    label: string;
    value: string;
    tone: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  }>;
  columns: string[];
  rows: Array<{ id: string; cells: string[] }>;
}
