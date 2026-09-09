'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  ArrowUpRight,
  Settings2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Brand } from '@/components/shared/brand';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isNavigationItemActive } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import type { AdminShellConfig, NavigationItem } from '@/types/navigation';

interface AdminSidebarProps {
  config: AdminShellConfig;
  collapsed?: boolean;
  mobile?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onNavigate?: () => void;
}

function NavItem({
  item,
  collapsed,
  onExpand,
  onNavigate,
}: {
  item: NavigationItem;
  collapsed: boolean;
  onExpand: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const childHrefs = item.children?.map((child) => child.href) ?? [];
  const active = isNavigationItemActive(pathname, item.href, childHrefs);
  const [openOverride, setOpenOverride] = useState<boolean | null>(null);
  const open = openOverride ?? active;
  const Icon = item.icon;
  const itemClasses = cn(
    'group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
    active
      ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
      : 'text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    collapsed && 'justify-center px-2',
  );

  const hasChildren = Boolean(item.children?.length);

  return (
    <div>
      <Tooltip key={pathname} disabled={!collapsed}>
        <TooltipTrigger
          render={
            hasChildren ? (
              <button
                type="button"
                className={itemClasses}
                aria-expanded={collapsed ? undefined : open}
                aria-label={collapsed ? item.title : undefined}
                onClick={() => {
                  if (collapsed) {
                    onExpand();
                    setOpenOverride(true);
                    return;
                  }
                  setOpenOverride(!open);
                }}
              />
            ) : (
              <Link
                href={item.href ?? '#'}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                aria-label={collapsed ? item.title : undefined}
                className={itemClasses}
              />
            )
          }
        >
          <Icon aria-hidden="true" className="size-4.5 shrink-0" />
          {!collapsed ? (
            <span className="flex-1 text-left">{item.title}</span>
          ) : null}
          {!collapsed && hasChildren ? (
            <ChevronDown
              aria-hidden="true"
              className={cn(
                'size-4 transition-transform',
                open && 'rotate-180',
              )}
            />
          ) : null}
          {!collapsed && !hasChildren && item.badge ? (
            <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-bold text-sidebar-accent-foreground">
              {item.badge}
            </span>
          ) : null}
        </TooltipTrigger>
        {collapsed ? (
          <TooltipContent side="right">{item.title}</TooltipContent>
        ) : null}
      </Tooltip>

      {!collapsed && open && hasChildren ? (
        <div className="ml-5 border-l border-sidebar-border pl-3 pt-1">
          {item.children?.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                aria-current={childActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-9 items-center rounded-md px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  childActive
                    ? 'font-semibold text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                {child.title}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function AdminSidebar({
  config,
  collapsed = false,
  mobile = false,
  onCollapsedChange,
  onNavigate,
}: AdminSidebarProps) {
  return (
    <TooltipProvider delay={250}>
      <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
        <div
          className={cn(
            'flex min-h-17 items-center border-b border-sidebar-border px-4',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          <Link
            href={
              config.role === 'super-admin'
                ? '/super-admin/dashboard'
                : '/school-admin/dashboard'
            }
            onClick={onNavigate}
            aria-label={collapsed ? 'Edvance dashboard' : undefined}
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <Brand compact={collapsed} />
          </Link>
          {!mobile && !collapsed ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Collapse sidebar"
              className="text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => onCollapsedChange?.(true)}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
          ) : null}
        </div>

        {!collapsed && (
          <div className="mx-4 mt-5 flex items-center gap-2.5 rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-sidebar-border bg-sidebar">
              <Building2 aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">
                {config.workspaceLabel}
              </p>
              <p className="mt-0.5 text-[10px] text-sidebar-foreground/80">
                {config.roleLabel}
              </p>
            </div>
          </div>
        )}

        <nav
          aria-label={`${config.roleLabel} navigation`}
          className="flex-1 overflow-y-auto px-3 py-4"
        >
          {config.navigation.map((group) => (
            <div key={group.label} className="mb-4 last:mb-0">
              {!collapsed ? (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/75">
                  {group.label}
                </p>
              ) : null}
              <div className="grid gap-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.title}
                    item={item}
                    collapsed={collapsed}
                    onExpand={() => onCollapsedChange?.(false)}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <Link
              href={'/' + config.role + '/settings'}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-lg p-2 text-xs text-sidebar-foreground hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <Settings2 aria-hidden="true" className="size-4" />
              <span className="flex-1">Workspace preferences</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
            <p className="mt-3 px-2 text-[10px] text-sidebar-foreground/75">
              Edvance · School management
            </p>
          </div>
        )}

        {!mobile && collapsed ? (
          <div className="border-t border-sidebar-border p-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Expand sidebar"
              className="w-full text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => onCollapsedChange?.(false)}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}
