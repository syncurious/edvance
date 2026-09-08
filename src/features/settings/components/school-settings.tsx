'use client';

import {
  BellRing,
  BookOpenCheck,
  Building2,
  CalendarCheck2,
  RotateCcw,
  Save,
  WalletCards,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import {
  SettingsCard,
  SettingsError,
  SettingsField,
  SettingsLoading,
  SettingsToggle,
} from '@/features/settings/components/settings-primitives';
import { settingsService } from '@/features/settings/services';
import type { SettingsService } from '@/features/settings/services';
import type { SchoolSettings } from '@/features/settings/types';
import {
  selectSelectedCampusId,
  selectSelectedSchoolId,
} from '@/store/slices/workspace-slice';
import { useAppSelector } from '@/store/hooks';

type FieldErrors = Partial<
  Record<
    | 'schoolName'
    | 'schoolCode'
    | 'contactEmail'
    | 'academicYear'
    | 'defaultPassMark'
    | 'monthlyDueDay',
    string
  >
>;

const campusLabels = {
  all: 'All campuses',
  north: 'North Campus',
  central: 'Central Campus',
  south: 'South Campus',
} as const;

export function SchoolSettingsPage({
  service = settingsService,
}: {
  service?: SettingsService;
}) {
  const schoolId = useAppSelector(selectSelectedSchoolId);
  const campusId = useAppSelector(selectSelectedCampusId);
  const [values, setValues] = useState<SchoolSettings | null>(null);
  const [saved, setSaved] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [version, setVersion] = useState(0);
  const dirty = Boolean(
    values && saved && JSON.stringify(values) !== JSON.stringify(saved),
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    void service
      .getSchoolSettings(schoolId)
      .then((result) => {
        if (!active) return;
        setValues(result);
        setSaved(structuredClone(result));
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [schoolId, service, version]);

  useEffect(() => {
    const preventExit = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', preventExit);
    return () => window.removeEventListener('beforeunload', preventExit);
  }, [dirty]);

  function validate(current: SchoolSettings) {
    const next: FieldErrors = {};
    if (current.schoolName.trim().length < 2)
      next.schoolName = 'Enter the school name.';
    if (current.schoolCode.trim().length < 3)
      next.schoolCode = 'Enter a school code.';
    if (!/^\S+@\S+\.\S+$/.test(current.contactEmail)) {
      next.contactEmail = 'Enter a valid contact email.';
    }
    if (!/^\d{4}-\d{4}$/.test(current.academic.academicYear)) {
      next.academicYear = 'Use the format YYYY-YYYY.';
    }
    if (
      current.academic.defaultPassMark < 1 ||
      current.academic.defaultPassMark > 100
    ) {
      next.defaultPassMark = 'Use a pass mark from 1 to 100.';
    }
    if (current.fees.monthlyDueDay < 1 || current.fees.monthlyDueDay > 28) {
      next.monthlyDueDay = 'Use a due day from 1 to 28.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function saveChanges() {
    if (!values || !validate(values)) return;
    setSaving(true);
    try {
      const result = await service.saveSchoolSettings(schoolId, values);
      setValues(result);
      setSaved(structuredClone(result));
      toast.add({
        title: 'School settings saved',
        description: `${values.schoolName} is using the latest configuration.`,
        type: 'success',
      });
    } catch {
      toast.add({
        title: 'Unable to save settings',
        description: 'Your changes are still on this page. Try again.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <SettingsLoading />;
  if (loadError || !values || !saved) {
    return (
      <SettingsError onRetry={() => setVersion((current) => current + 1)} />
    );
  }

  return (
    <div className="grid min-w-0 gap-7">
      <PageHeader
        eyebrow="School configuration"
        title="School settings"
        description="Manage identity, academic defaults, attendance rules, fee policy, and operational notifications."
        actions={
          <>
            <StatusBadge status={dirty ? 'warning' : 'success'}>
              {dirty ? 'Unsaved changes' : 'All changes saved'}
            </StatusBadge>
            <Button
              type="button"
              variant="outline"
              disabled={!dirty || saving}
              onClick={() => {
                setValues(structuredClone(saved));
                setErrors({});
              }}
            >
              <RotateCcw /> Discard
            </Button>
            <Button
              type="button"
              disabled={!dirty || saving}
              onClick={() => void saveChanges()}
            >
              {saving ? <Spinner /> : <Save />}{' '}
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      />

      <Alert>
        <Building2 />
        <AlertTitle>Editing {campusLabels[campusId]}</AlertTitle>
        <AlertDescription>
          School identity and academic defaults apply everywhere. Attendance and
          fee rules use the active campus scope when the backend is connected.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="profile" className="min-w-0">
        <div className="max-w-full overflow-x-auto pb-1">
          <TabsList aria-label="School settings sections" className="w-max">
            <TabsTrigger value="profile">
              <Building2 /> Profile
            </TabsTrigger>
            <TabsTrigger value="academic">
              <BookOpenCheck /> Academic
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <CalendarCheck2 /> Attendance
            </TabsTrigger>
            <TabsTrigger value="fees">
              <WalletCards /> Fees
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellRing /> Notifications
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="grid gap-6 pt-4">
          <SettingsCard
            title="School identity"
            description="Contact and identity details used across documents and communication."
            icon={Building2}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SettingsField
                id="school-name"
                label="School name"
                error={errors.schoolName}
              >
                <Input
                  id="school-name"
                  value={values.schoolName}
                  aria-invalid={Boolean(errors.schoolName)}
                  aria-describedby={
                    errors.schoolName ? 'school-name-error' : undefined
                  }
                  onChange={(event) =>
                    setValues({ ...values, schoolName: event.target.value })
                  }
                />
              </SettingsField>
              <SettingsField
                id="school-code"
                label="School code"
                error={errors.schoolCode}
              >
                <Input
                  id="school-code"
                  value={values.schoolCode}
                  aria-invalid={Boolean(errors.schoolCode)}
                  aria-describedby={
                    errors.schoolCode ? 'school-code-error' : undefined
                  }
                  onChange={(event) =>
                    setValues({ ...values, schoolCode: event.target.value })
                  }
                />
              </SettingsField>
              <SettingsField
                id="school-email"
                label="Contact email"
                error={errors.contactEmail}
              >
                <Input
                  id="school-email"
                  type="email"
                  value={values.contactEmail}
                  aria-invalid={Boolean(errors.contactEmail)}
                  aria-describedby={
                    errors.contactEmail ? 'school-email-error' : undefined
                  }
                  onChange={(event) =>
                    setValues({ ...values, contactEmail: event.target.value })
                  }
                />
              </SettingsField>
              <SettingsField id="school-phone" label="Contact phone">
                <Input
                  id="school-phone"
                  value={values.contactPhone}
                  onChange={(event) =>
                    setValues({ ...values, contactPhone: event.target.value })
                  }
                />
              </SettingsField>
              <SettingsField
                id="school-address"
                label="Address"
                className="md:col-span-2"
              >
                <Textarea
                  id="school-address"
                  value={values.address}
                  onChange={(event) =>
                    setValues({ ...values, address: event.target.value })
                  }
                />
              </SettingsField>
              <SettingsField id="school-timezone" label="Timezone">
                <NativeSelect
                  id="school-timezone"
                  className="w-full"
                  value={values.timezone}
                  onChange={(event) =>
                    setValues({ ...values, timezone: event.target.value })
                  }
                >
                  <option value="Asia/Karachi">Pakistan Standard Time</option>
                  <option value="UTC">Coordinated Universal Time</option>
                  <option value="Asia/Dubai">Gulf Standard Time</option>
                </NativeSelect>
              </SettingsField>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="academic" className="grid gap-6 pt-4">
          <SettingsCard
            title="Academic defaults"
            description="Default calendar and grading behavior for new academic records."
            icon={BookOpenCheck}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SettingsField
                id="academic-year"
                label="Academic year"
                error={errors.academicYear}
              >
                <Input
                  id="academic-year"
                  value={values.academic.academicYear}
                  aria-invalid={Boolean(errors.academicYear)}
                  aria-describedby={
                    errors.academicYear ? 'academic-year-error' : undefined
                  }
                  onChange={(event) =>
                    setValues({
                      ...values,
                      academic: {
                        ...values.academic,
                        academicYear: event.target.value,
                      },
                    })
                  }
                />
              </SettingsField>
              <SettingsField id="week-start" label="Week starts on">
                <NativeSelect
                  id="week-start"
                  className="w-full"
                  value={values.academic.weekStartsOn}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      academic: {
                        ...values.academic,
                        weekStartsOn: event.target
                          .value as SchoolSettings['academic']['weekStartsOn'],
                      },
                    })
                  }
                >
                  <option value="Monday">Monday</option>
                  <option value="Sunday">Sunday</option>
                </NativeSelect>
              </SettingsField>
              <SettingsField id="grading-scale" label="Grading scale">
                <NativeSelect
                  id="grading-scale"
                  className="w-full"
                  value={values.academic.gradingScale}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      academic: {
                        ...values.academic,
                        gradingScale: event.target
                          .value as SchoolSettings['academic']['gradingScale'],
                      },
                    })
                  }
                >
                  <option value="percentage">Percentage</option>
                  <option value="letter">Letter grades</option>
                </NativeSelect>
              </SettingsField>
              <SettingsField
                id="default-pass-mark"
                label="Default pass mark (%)"
                error={errors.defaultPassMark}
              >
                <Input
                  id="default-pass-mark"
                  type="number"
                  min={1}
                  max={100}
                  value={values.academic.defaultPassMark}
                  aria-invalid={Boolean(errors.defaultPassMark)}
                  aria-describedby={
                    errors.defaultPassMark
                      ? 'default-pass-mark-error'
                      : undefined
                  }
                  onChange={(event) =>
                    setValues({
                      ...values,
                      academic: {
                        ...values.academic,
                        defaultPassMark: Number(event.target.value),
                      },
                    })
                  }
                />
              </SettingsField>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="attendance" className="grid gap-6 pt-4">
          <SettingsCard
            title="Attendance policy"
            description="Control editing windows and guardian communication for attendance."
            icon={CalendarCheck2}
          >
            <SettingsField
              id="attendance-lock"
              label="Lock attendance after (hours)"
              hint="Use 0 to keep sheets editable until an administrator locks them."
            >
              <Input
                id="attendance-lock"
                type="number"
                min={0}
                max={168}
                value={values.attendance.lockAfterHours}
                onChange={(event) =>
                  setValues({
                    ...values,
                    attendance: {
                      ...values.attendance,
                      lockAfterHours: Number(event.target.value),
                    },
                  })
                }
              />
            </SettingsField>
            <SettingsToggle
              id="teacher-notes"
              label="Allow teacher notes"
              description="Let teachers add contextual notes to individual attendance records."
              checked={values.attendance.allowTeacherNotes}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  attendance: {
                    ...values.attendance,
                    allowTeacherNotes: checked,
                  },
                })
              }
            />
            <SettingsToggle
              id="absence-alerts"
              label="Send guardian absence alerts"
              description="Notify guardians after an absence is saved and verified."
              checked={values.attendance.guardianAbsenceAlerts}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  attendance: {
                    ...values.attendance,
                    guardianAbsenceAlerts: checked,
                  },
                })
              }
            />
          </SettingsCard>
        </TabsContent>

        <TabsContent value="fees" className="grid gap-6 pt-4">
          <SettingsCard
            title="Fee policy"
            description="Defaults applied when monthly invoices and payment options are created."
            icon={WalletCards}
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SettingsField id="fee-currency" label="Currency">
                <Input
                  id="fee-currency"
                  value={values.fees.currency}
                  disabled
                />
              </SettingsField>
              <SettingsField
                id="monthly-due-day"
                label="Monthly due day"
                error={errors.monthlyDueDay}
              >
                <Input
                  id="monthly-due-day"
                  type="number"
                  min={1}
                  max={28}
                  value={values.fees.monthlyDueDay}
                  aria-invalid={Boolean(errors.monthlyDueDay)}
                  aria-describedby={
                    errors.monthlyDueDay ? 'monthly-due-day-error' : undefined
                  }
                  onChange={(event) =>
                    setValues({
                      ...values,
                      fees: {
                        ...values.fees,
                        monthlyDueDay: Number(event.target.value),
                      },
                    })
                  }
                />
              </SettingsField>
              <SettingsField id="late-fee" label="Default late fee">
                <Input
                  id="late-fee"
                  type="number"
                  min={0}
                  value={values.fees.lateFee}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      fees: {
                        ...values.fees,
                        lateFee: Number(event.target.value),
                      },
                    })
                  }
                />
              </SettingsField>
            </div>
            <SettingsToggle
              id="online-payments"
              label="Enable online payments"
              description="Show online payment options after a payment provider is connected."
              checked={values.fees.onlinePayments}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  fees: { ...values.fees, onlinePayments: checked },
                })
              }
            />
          </SettingsCard>
        </TabsContent>

        <TabsContent value="notifications" className="grid gap-6 pt-4">
          <SettingsCard
            title="Operational notifications"
            description="Choose the automated summaries sent to school administrators."
            icon={BellRing}
          >
            {(
              [
                [
                  'dailyAttendanceSummary',
                  'Daily attendance summary',
                  'A campus-level attendance summary after the marking window closes.',
                ],
                [
                  'overdueFeeDigest',
                  'Overdue fee digest',
                  'A daily list of newly overdue and partially paid invoices.',
                ],
                [
                  'resultPublicationAlerts',
                  'Result publication alerts',
                  'Notify administrators when an exam result set becomes publishable.',
                ],
              ] as const
            ).map(([key, label, description]) => (
              <SettingsToggle
                key={key}
                id={`school-${key}`}
                label={label}
                description={description}
                checked={values.notifications[key]}
                onCheckedChange={(checked) =>
                  setValues({
                    ...values,
                    notifications: { ...values.notifications, [key]: checked },
                  })
                }
              />
            ))}
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
