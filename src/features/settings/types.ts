export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  timezone: string;
  locale: string;
  security: {
    requireMfa: boolean;
    sessionTimeoutMinutes: number;
    invitationExpiryDays: number;
    minimumPasswordLength: number;
  };
  notifications: {
    securityAlerts: boolean;
    billingAlerts: boolean;
    schoolLifecycleAlerts: boolean;
    weeklyDigest: boolean;
  };
}

export interface SchoolSettings {
  schoolName: string;
  schoolCode: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  timezone: string;
  academic: {
    academicYear: string;
    weekStartsOn: 'Sunday' | 'Monday';
    gradingScale: 'percentage' | 'letter';
    defaultPassMark: number;
  };
  attendance: {
    lockAfterHours: number;
    allowTeacherNotes: boolean;
    guardianAbsenceAlerts: boolean;
  };
  fees: {
    currency: 'PKR';
    monthlyDueDay: number;
    lateFee: number;
    onlinePayments: boolean;
  };
  notifications: {
    dailyAttendanceSummary: boolean;
    overdueFeeDigest: boolean;
    resultPublicationAlerts: boolean;
  };
}
