'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  Bell,
  CheckCircle2,
  LogOut,
  Menu,
  Moon,
  Palette,
  Sun,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkspaceSearch } from '@/components/layout/workspace-search';
import { WorkspaceSelector } from '@/components/shared/workspace-selector';
import { clearAuthSession } from '@/features/auth/auth-storage';
import type { CampusId } from '@/features/dashboard/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authSignedOut } from '@/store/slices/auth-slice';
import {
  campusSelected,
  selectSelectedCampusId,
} from '@/store/slices/workspace-slice';
import type { AdminShellConfig } from '@/types/navigation';

interface AdminHeaderProps {
  config: AdminShellConfig;
  onOpenNavigation: () => void;
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  );

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={dark ? 'Use light theme' : 'Use dark theme'}
      aria-pressed={dark}
      onClick={() => {
        const nextDark = !dark;
        document.documentElement.classList.toggle('dark', nextDark);
      }}
    >
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}

export function AdminHeader({ config, onOpenNavigation }: AdminHeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const selectedCampusId = useAppSelector(selectSelectedCampusId);
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    config.schools[0]?.value ?? '',
  );
  const workspaceValue =
    config.role === 'school-admin' ? selectedCampusId : selectedSchoolId;

  function signOut() {
    clearAuthSession();
    dispatch(authSignedOut());
    router.replace('/login');
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-17 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open navigation"
        className="lg:hidden"
        onClick={onOpenNavigation}
      >
        <Menu aria-hidden="true" />
      </Button>

      <WorkspaceSearch config={config} />

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:block">
          <WorkspaceSelector
            id="workspace-selector"
            label={`Select ${config.role === 'super-admin' ? 'school' : 'campus'}`}
            value={workspaceValue}
            options={config.schools}
            onValueChange={(value) => {
              if (config.role === 'school-admin') {
                dispatch(campusSelected(value as CampusId));
              } else {
                setSelectedSchoolId(value);
              }
            }}
            className="w-36 lg:w-44"
          />
        </div>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="relative" />}
          >
            <Bell aria-hidden="true" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-destructive" />
            <span className="sr-only">Open notifications</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-sm text-foreground">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="items-start gap-3 px-3 py-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 text-success-foreground"
                />
                <span>
                  <span className="block font-semibold">
                    Attendance submitted
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Grade 7-A · 8 minutes ago
                  </span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="items-start gap-3 px-3 py-3">
                <Bell
                  aria-hidden="true"
                  className="mt-0.5 text-warning-foreground"
                />
                <span>
                  <span className="block font-semibold">
                    12 fee invoices are overdue
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Finance · 24 minutes ago
                  </span>
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-11 gap-2 px-1.5 sm:pr-3" />
            }
          >
            <Avatar>
              <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                {config.profile.initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-left lg:block">
              <span className="block max-w-28 truncate text-xs font-bold">
                {config.profile.name}
              </span>
              <span className="block text-[10px] font-normal text-muted-foreground">
                {config.roleLabel}
              </span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2">
                <span className="block text-sm text-foreground">
                  {config.profile.name}
                </span>
                <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                  {config.profile.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href={'/' + config.role + '/settings'} />}
              >
                <UserRound aria-hidden="true" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/design-system" />}>
                <Palette aria-hidden="true" /> Design system
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={signOut}>
                <LogOut aria-hidden="true" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
