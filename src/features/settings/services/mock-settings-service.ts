import type { SettingsService } from '@/features/settings/services/settings-service';
import type {
  PlatformSettings,
  SchoolSettings,
} from '@/features/settings/types';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const platformDefaults: PlatformSettings = {
  platformName: 'Edvance',
  supportEmail: 'support@edvance.pk',
  timezone: 'Asia/Karachi',
  locale: 'en-PK',
  security: {
    requireMfa: true,
    sessionTimeoutMinutes: 60,
    invitationExpiryDays: 7,
    minimumPasswordLength: 10,
  },
  notifications: {
    securityAlerts: true,
    billingAlerts: true,
    schoolLifecycleAlerts: true,
    weeklyDigest: false,
  },
};

const schoolDefaults: SchoolSettings = {
  schoolName: 'Crescent Academy',
  schoolCode: 'CRA-001',
  contactEmail: 'admin@crescent.edu.pk',
  contactPhone: '+92 51 843 2100',
  address: '14 Margalla Avenue, Islamabad',
  timezone: 'Asia/Karachi',
  academic: {
    academicYear: '2026-2027',
    weekStartsOn: 'Monday',
    gradingScale: 'percentage',
    defaultPassMark: 40,
  },
  attendance: {
    lockAfterHours: 48,
    allowTeacherNotes: true,
    guardianAbsenceAlerts: true,
  },
  fees: {
    currency: 'PKR',
    monthlyDueDay: 10,
    lateFee: 500,
    onlinePayments: false,
  },
  notifications: {
    dailyAttendanceSummary: true,
    overdueFeeDigest: true,
    resultPublicationAlerts: true,
  },
};

export class MockSettingsService implements SettingsService {
  private platform = structuredClone(platformDefaults);
  private readonly schools = new Map<string, SchoolSettings>();

  constructor(private readonly latency = 220) {}

  async getPlatformSettings() {
    if (this.latency) await wait(this.latency);
    return structuredClone(this.platform);
  }

  async savePlatformSettings(values: PlatformSettings) {
    if (this.latency) await wait(this.latency);
    this.platform = structuredClone(values);
    return structuredClone(this.platform);
  }

  async getSchoolSettings(schoolId: string) {
    if (this.latency) await wait(this.latency);
    return structuredClone(this.schools.get(schoolId) ?? schoolDefaults);
  }

  async saveSchoolSettings(schoolId: string, values: SchoolSettings) {
    if (this.latency) await wait(this.latency);
    this.schools.set(schoolId, structuredClone(values));
    return structuredClone(values);
  }
}
