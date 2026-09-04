'use client';

import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    'group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
    active
      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
      : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    collapsed && 'justify-center px-2',
  );

  if (item.children?.length) {
    return (
      <div>
        <Tooltip>
          <TooltipTrigger
            render={
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
            }
          >
            <Icon aria-hidden="true" className="size-4.5 shrink-0" />
            {!collapsed ? (
              <span className="flex-1 text-left">{item.title}</span>
            ) : null}
            {!collapsed ? (
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'size-4 transition-transform',
                  open && 'rotate-180',
                )}
              />
            ) : null}
          </TooltipTrigger>
          {collapsed ? (
            <TooltipContent side="right">{item.title}</TooltipContent>
          ) : null}
        </Tooltip>

        {!collapsed && open ? (
          <div className="ml-5 border-l border-sidebar-border pl-3 pt-1">
            {item.children.map((child) => {
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
                      ? 'font-bold text-sidebar-primary'
                      : 'text-sidebar-foreground/62 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
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

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={item.href ?? '#'}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            aria-label={collapsed ? item.title : undefined}
            className={itemClasses}
          />
        }
      >
        <Icon aria-hidden="true" className="size-4.5 shrink-0" />
        {!collapsed ? (
          <span className="flex-1 text-left">{item.title}</span>
        ) : null}
        {!collapsed && item.badge ? (
          <span className="rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-bold text-sidebar-accent-foreground">
            {item.badge}
          </span>
        ) : null}
      </TooltipTrigger>
      {collapsed ? (
        <TooltipContent side="right">{item.title}</TooltipContent>
      ) : null}
    </Tooltip>
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
            'flex min-h-18 items-center border-b border-sidebar-border px-4',
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
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sm font-black text-sidebar-primary-foreground">
              E
            </span>
            {!collapsed ? (
              <span>
                <span className="block text-sm font-black tracking-tight">
                  Edvance
                </span>
                <span className="block text-[11px] text-sidebar-foreground/55">
                  {config.roleLabel}
                </span>
              </span>
            ) : null}
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

        <nav
          aria-label={`${config.roleLabel} navigation`}
          className="flex-1 overflow-y-auto px-3 py-4"
        >
          {config.navigation.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              {!collapsed ? (
                <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-sidebar-foreground/38">
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
