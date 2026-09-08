'use client';

import {
  BellRing,
  Building2,
  Cable,
  RotateCcw,
  Save,
  ShieldCheck,
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
import type { PlatformSettings } from '@/features/settings/types';

type FieldErrors = Partial<
  Record<
    | 'platformName'
    | 'supportEmail'
    | 'sessionTimeoutMinutes'
    | 'minimumPasswordLength',
    string
  >
>;

const integrations = [
  {
    name: 'SMS gateway',
    description: 'Transactional attendance, fee, and security messages.',
    status: 'Connected',
    tone: 'success' as const,
  },
  {
    name: 'Payment provider',
    description: 'Platform subscription invoices and reconciliation.',
    status: 'Action required',
    tone: 'warning' as const,
  },
  {
    name: 'Email delivery',
    description: 'Invitations, password recovery, and weekly digests.',
    status: 'Connected',
    tone: 'success' as const,
  },
];

export function PlatformSettingsPage({
  service = settingsService,
}: {
  service?: SettingsService;
}) {
  const [values, setValues] = useState<PlatformSettings | null>(null);
  const [saved, setSaved] = useState<PlatformSettings | null>(null);
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
      .getPlatformSettings()
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
  }, [service, version]);

  useEffect(() => {
    const preventExit = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', preventExit);
    return () => window.removeEventListener('beforeunload', preventExit);
  }, [dirty]);

  function validate(current: PlatformSettings) {
    const next: FieldErrors = {};
    if (current.platformName.trim().length < 2) {
      next.platformName = 'Enter a platform name.';
    }
    if (!/^\S+@\S+\.\S+$/.test(current.supportEmail)) {
      next.supportEmail = 'Enter a valid support email.';
    }
    if (
      current.security.sessionTimeoutMinutes < 15 ||
      current.security.sessionTimeoutMinutes > 480
    ) {
      next.sessionTimeoutMinutes = 'Use a timeout from 15 to 480 minutes.';
    }
    if (
      current.security.minimumPasswordLength < 8 ||
      current.security.minimumPasswordLength > 64
    ) {
      next.minimumPasswordLength = 'Use a minimum length from 8 to 64.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function saveChanges() {
    if (!values || !validate(values)) return;
    setSaving(true);
    try {
      const result = await service.savePlatformSettings(values);
      setValues(result);
      setSaved(structuredClone(result));
      toast.add({
        title: 'Platform settings saved',
        description:
          'The latest configuration is ready for all platform administrators.',
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
        eyebrow="System configuration"
        title="Platform settings"
        description="Control platform identity, security defaults, notifications, and service connections."
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

      <Tabs defaultValue="general" className="min-w-0">
        <div className="max-w-full overflow-x-auto pb-1">
          <TabsList aria-label="Platform settings sections" className="w-max">
            <TabsTrigger value="general">
              <Building2 /> General
            </TabsTrigger>
            <TabsTrigger value="security">
              <ShieldCheck /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellRing /> Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Cable /> Integrations
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general" className="grid gap-6 pt-4">
          <SettingsCard
            title="Platform identity"
            description="Defaults shown in system communication and administrative workspaces."
            icon={Building2}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SettingsField
                id="platform-name"
                label="Platform name"
                error={errors.platformName}
              >
                <Input
                  id="platform-name"
                  value={values.platformName}
                  aria-invalid={Boolean(errors.platformName)}
                  aria-describedby={
                    errors.platformName ? 'platform-name-error' : undefined
                  }
                  onChange={(event) =>
                    setValues({ ...values, platformName: event.target.value })
                  }
                />
              </SettingsField>
              <SettingsField
                id="support-email"
                label="Support email"
                error={errors.supportEmail}
              >
                <Input
                  id="support-email"
                  type="email"
                  value={values.supportEmail}
                  aria-invalid={Boolean(errors.supportEmail)}
                  aria-describedby={
                    errors.supportEmail ? 'support-email-error' : undefined
                  }
                  onChange={(event) =>
                    setValues({ ...values, supportEmail: event.target.value })
                  }
                />
              </SettingsField>
              <SettingsField id="platform-timezone" label="Default timezone">
                <NativeSelect
                  id="platform-timezone"
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
              <SettingsField
                id="platform-locale"
                label="Number and date locale"
              >
                <NativeSelect
                  id="platform-locale"
                  className="w-full"
                  value={values.locale}
                  onChange={(event) =>
                    setValues({ ...values, locale: event.target.value })
                  }
                >
                  <option value="en-PK">English (Pakistan)</option>
                  <option value="ur-PK">Urdu (Pakistan)</option>
                </NativeSelect>
              </SettingsField>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="security" className="grid gap-6 pt-4">
          <SettingsCard
            title="Authentication policy"
            description="Baseline controls inherited by every school workspace."
            icon={ShieldCheck}
          >
            <SettingsToggle
              id="require-mfa"
              label="Require multi-factor authentication"
              description="Require an additional verification factor for administrative roles."
              checked={values.security.requireMfa}
              onCheckedChange={(checked) =>
                setValues({
                  ...values,
                  security: { ...values.security, requireMfa: checked },
                })
              }
            />
            <div className="grid gap-5 md:grid-cols-3">
              <SettingsField
                id="session-timeout"
                label="Session timeout (minutes)"
                error={errors.sessionTimeoutMinutes}
              >
                <Input
                  id="session-timeout"
                  type="number"
                  min={15}
                  max={480}
                  value={values.security.sessionTimeoutMinutes}
                  aria-invalid={Boolean(errors.sessionTimeoutMinutes)}
                  aria-describedby={
                    errors.sessionTimeoutMinutes
                      ? 'session-timeout-error'
                      : undefined
                  }
                  onChange={(event) =>
                    setValues({
                      ...values,
                      security: {
                        ...values.security,
                        sessionTimeoutMinutes: Number(event.target.value),
                      },
                    })
                  }
                />
              </SettingsField>
              <SettingsField
                id="invite-expiry"
                label="Invitation expiry (days)"
              >
                <Input
                  id="invite-expiry"
                  type="number"
                  min={1}
                  max={30}
                  value={values.security.invitationExpiryDays}
                  onChange={(event) =>
                    setValues({
                      ...values,
                      security: {
                        ...values.security,
                        invitationExpiryDays: Number(event.target.value),
                      },
                    })
                  }
                />
              </SettingsField>
              <SettingsField
                id="password-length"
                label="Minimum password length"
                error={errors.minimumPasswordLength}
              >
                <Input
                  id="password-length"
                  type="number"
                  min={8}
                  max={64}
                  value={values.security.minimumPasswordLength}
                  aria-invalid={Boolean(errors.minimumPasswordLength)}
                  aria-describedby={
                    errors.minimumPasswordLength
                      ? 'password-length-error'
                      : undefined
                  }
                  onChange={(event) =>
                    setValues({
                      ...values,
                      security: {
                        ...values.security,
                        minimumPasswordLength: Number(event.target.value),
                      },
                    })
                  }
                />
              </SettingsField>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="notifications" className="grid gap-6 pt-4">
          <SettingsCard
            title="Administrator notifications"
            description="Choose the operational events sent to platform administrators."
            icon={BellRing}
          >
            {(
              [
                [
                  'securityAlerts',
                  'Security alerts',
                  'Suspicious access, policy changes, and account recovery events.',
                ],
                [
                  'billingAlerts',
                  'Billing alerts',
                  'Failed subscription charges and overdue platform invoices.',
                ],
                [
                  'schoolLifecycleAlerts',
                  'School lifecycle alerts',
                  'New trials, activations, suspensions, and cancellations.',
                ],
                [
                  'weeklyDigest',
                  'Weekly platform digest',
                  'A consolidated adoption, revenue, and usage summary.',
                ],
              ] as const
            ).map(([key, label, description]) => (
              <SettingsToggle
                key={key}
                id={`platform-${key}`}
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

        <TabsContent value="integrations" className="grid gap-6 pt-4">
          <Alert>
            <Cable />
            <AlertTitle>Connection controls are preview-only</AlertTitle>
            <AlertDescription>
              Credentials and provider callbacks will be configured through
              server-only Next.js API routes.
            </AlertDescription>
          </Alert>
          <div className="grid gap-4 lg:grid-cols-3">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="grid gap-4 rounded-xl border bg-card p-5 shadow-sm"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-black">{integration.name}</h2>
                    <StatusBadge status={integration.tone}>
                      {integration.status}
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      title: `${integration.name} configuration`,
                      description:
                        'Provider credentials will open here after the backend integration is connected.',
                      type: 'info',
                    })
                  }
                >
                  Review connection
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
