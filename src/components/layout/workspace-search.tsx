'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { AdminShellConfig } from '@/types/navigation';

export function WorkspaceSearch({ config }: { config: AdminShellConfig }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        aria-label="Search pages"
        onClick={() => setOpen(true)}
        className="min-w-0 gap-2 text-muted-foreground md:w-64 md:justify-start md:border md:border-border md:bg-background md:font-normal"
      >
        <Search aria-hidden="true" />
        <span className="hidden md:inline">Search pages…</span>
        <kbd className="ml-auto hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] md:inline">
          ⌘ / Ctrl K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle>Go to a page</DialogTitle>
            <DialogDescription>
              Find a destination in your {config.roleLabel.toLowerCase()}{' '}
              workspace.
            </DialogDescription>
          </DialogHeader>
          <Command>
            <CommandInput
              placeholder="Search students, attendance, settings…"
              aria-label="Search workspace pages"
            />
            <CommandList className="max-h-80 p-2">
              <CommandEmpty>
                No matching pages. Try another search.
              </CommandEmpty>
              {config.navigation.map((group) => (
                <CommandGroup heading={group.label} key={group.label}>
                  {group.items.flatMap((item) => {
                    const Icon = item.icon;
                    const destinations =
                      item.children ??
                      (item.href
                        ? [{ title: item.title, href: item.href }]
                        : []);
                    return destinations.map((destination) => (
                      <CommandItem
                        key={destination.href}
                        value={item.title + ' ' + destination.title}
                        className="min-h-11 gap-3"
                        onSelect={() => {
                          setOpen(false);
                          router.push(destination.href);
                        }}
                      >
                        <Icon
                          aria-hidden="true"
                          className="text-muted-foreground"
                        />
                        {destination.title}
                        {item.children && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            · {item.title}
                          </span>
                        )}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-auto text-muted-foreground"
                        />
                      </CommandItem>
                    ));
                  })}
                </CommandGroup>
              ))}
            </CommandList>
            <div className="border-t px-4 py-3 text-xs text-muted-foreground">
              ↑ ↓ to navigate · Enter to open · Esc to close
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
