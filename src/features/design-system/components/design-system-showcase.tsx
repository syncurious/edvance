'use client';

import {
  Bell,
  Check,
  CircleHelp,
  LoaderCircle,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  UserRound,
} from 'lucide-react';

import { StatusBadge } from '@/components/shared/status-badge';
import { TextField } from '@/components/shared/text-field';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const colors = [
  { name: 'Primary', className: 'bg-primary', value: 'Action blue' },
  { name: 'Accent', className: 'bg-accent', value: 'Signal teal' },
  { name: 'Success', className: 'bg-success', value: 'Positive green' },
  { name: 'Warning', className: 'bg-warning', value: 'Attention amber' },
  { name: 'Destructive', className: 'bg-destructive', value: 'Critical red' },
  { name: 'Surface', className: 'bg-card', value: 'Canvas white' },
] as const;

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-border py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:py-14">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
          {number}
        </p>
        <h2 className="mt-2 text-xl font-black tracking-tight">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function DesignSystemShowcase() {
  return (
    <div>
      <Section
        number="01 · Foundations"
        title="Color and type"
        description="A calm operational palette with strong hierarchy and unambiguous status colors."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {colors.map((color) => (
            <div
              key={color.name}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className={`h-20 ${color.className}`} />
              <div className="p-3">
                <p className="text-sm font-bold">{color.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {color.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Display
            </p>
            <p className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              School work, made clear.
            </p>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              Body copy stays compact and readable, while labels use weight and
              spacing to make dense interfaces easy to scan.
            </p>
          </div>
          <code className="w-fit rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            4 / 8 / 12 / 16 / 24 / 32
          </code>
        </div>
      </Section>

      <Section
        number="02 · Actions"
        title="Buttons and status"
        description="Every action communicates priority; every status includes text and an icon rather than color alone."
      >
        <Card>
          <CardHeader>
            <CardTitle>Action hierarchy</CardTitle>
            <CardDescription>
              Primary, secondary, quiet, destructive, loading, and unavailable
              states.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>
              <Plus data-icon="inline-start" /> Add student
            </Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="outline">Export report</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Delete</Button>
            <Button disabled>
              <LoaderCircle className="animate-spin" data-icon="inline-start" />{' '}
              Saving
            </Button>
            <Button disabled>Unavailable</Button>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <StatusBadge status="success">Paid</StatusBadge>
            <StatusBadge status="info">In review</StatusBadge>
            <StatusBadge status="warning">Payment due</StatusBadge>
            <StatusBadge status="error">Overdue</StatusBadge>
            <StatusBadge>Draft</StatusBadge>
            <Badge variant="outline">Grade 7-A</Badge>
          </CardFooter>
        </Card>
      </Section>

      <Section
        number="03 · Forms"
        title="Inputs and choices"
        description="Labels, guidance, validation, and keyboard-visible focus are part of the component contract."
      >
        <div className="grid gap-5 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-6">
          <TextField
            label="School name"
            placeholder="e.g. Crescent Academy"
            description="Use the official registered name."
          />
          <TextField
            label="School code"
            defaultValue="CR-2048"
            success="Code is available."
          />
          <TextField
            label="Administrator email"
            defaultValue="admin@"
            error="Enter a complete email address."
          />
          <TextField label="Website" placeholder="https://" optional />

          <div className="grid gap-2">
            <Label htmlFor="campus-select">Default campus</Label>
            <Select defaultValue="north">
              <SelectTrigger id="campus-select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north">North Campus</SelectItem>
                <SelectItem value="central">Central Campus</SelectItem>
                <SelectItem value="south">South Campus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="search-preview">Search field</Label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="search-preview"
                className="pl-9"
                placeholder="Search students"
              />
            </div>
          </div>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold">
              Notification channels
            </legend>
            <label
              htmlFor="email-notifications"
              className="flex min-h-10 items-center gap-3 rounded-lg border border-border px-3 text-sm"
            >
              <Checkbox id="email-notifications" defaultChecked /> Email
            </label>
            <label
              htmlFor="sms-notifications"
              className="flex min-h-10 items-center gap-3 rounded-lg border border-border px-3 text-sm"
            >
              <Checkbox id="sms-notifications" /> SMS
            </label>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold">
              Attendance default
            </legend>
            <RadioGroup defaultValue="present">
              <label
                htmlFor="attendance-present"
                className="flex min-h-10 items-center gap-3 rounded-lg border border-border px-3 text-sm"
              >
                <RadioGroupItem id="attendance-present" value="present" />{' '}
                Present
              </label>
              <label
                htmlFor="attendance-unmarked"
                className="flex min-h-10 items-center gap-3 rounded-lg border border-border px-3 text-sm"
              >
                <RadioGroupItem id="attendance-unmarked" value="unmarked" />{' '}
                Leave unmarked
              </label>
            </RadioGroup>
          </fieldset>
        </div>
      </Section>

      <Section
        number="04 · Navigation"
        title="Tabs and identity"
        description="Compact patterns preserve context while moving through profile-heavy admin workflows."
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  NA
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Nadia Ahmed</CardTitle>
                <CardDescription>Student · ST-2048</CardDescription>
              </div>
            </div>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="icon" />}
                >
                  <MoreHorizontal />
                  <span className="sr-only">Open student actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Student actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit profile</DropdownMenuItem>
                  <DropdownMenuItem>View attendance</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Archive student
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="w-full sm:w-fit">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
              </TabsList>
              <TabsContent
                value="overview"
                className="pt-4 leading-6 text-muted-foreground"
              >
                Profile summary, guardian details, and the student&apos;s
                current academic placement.
              </TabsContent>
              <TabsContent
                value="attendance"
                className="pt-4 leading-6 text-muted-foreground"
              >
                Attendance history and term-level patterns will appear here.
              </TabsContent>
              <TabsContent
                value="fees"
                className="pt-4 leading-6 text-muted-foreground"
              >
                Invoices, payments, and outstanding balances will appear here.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Section>

      <Section
        number="05 · Feedback"
        title="Overlays and messages"
        description="Dialogs, menus, tooltips, and toasts keep confirmation and feedback close to the triggering action."
      >
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm school activation</DialogTitle>
                <DialogDescription>
                  Activating Crescent Academy will allow its administrators to
                  sign in.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton>
                <Button
                  onClick={() =>
                    toast.add({
                      title: 'School activated',
                      description: 'Crescent Academy can now sign in.',
                      type: 'success',
                    })
                  }
                >
                  <Check data-icon="inline-start" /> Activate school
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="secondary"
            onClick={() =>
              toast.add({
                title: 'Changes saved',
                description: 'The school profile is up to date.',
                type: 'success',
              })
            }
          >
            Show success toast
          </Button>

          <TooltipProvider delay={250}>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
                <CircleHelp />
                <span className="sr-only">More information</span>
              </TooltipTrigger>
              <TooltipContent>
                Keyboard-accessible contextual help
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Section>

      <Section
        number="06 · Loading"
        title="Skeleton states"
        description="Loading layouts preserve the final content shape and reduce visual movement."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[Bell, UserRound, Settings].map((Icon, index) => (
            <Card key={index} aria-label="Loading card preview">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground/35"
                  />
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-7 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
