'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, Search, Users } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/components/layout/page-header';
import {
  DashboardEmptyState,
  DashboardErrorState,
} from '@/components/shared/dashboard-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { classService } from '@/features/classes/services/class-service';
import type { ClassSection, ClassService } from '@/features/classes/types';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedCampusId } from '@/store/slices/workspace-slice';

export function ClassesList({
  service = classService,
}: {
  service?: ClassService;
}) {
  const campusId = useAppSelector(selectSelectedCampusId);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [items, setItems] = useState<ClassSection[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    service
      .list({ campusId, search: appliedSearch })
      .then((data) => {
        if (active) {
          setItems(data);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [appliedSearch, campusId, service, version]);
  const grades = useMemo(
    () =>
      Object.entries(Object.groupBy(items, (item) => item.gradeName)).sort(
        ([a], [b]) => a.localeCompare(b, undefined, { numeric: true }),
      ),
    [items],
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setAppliedSearch(search);
  };
  const reset = () => {
    setSearch('');
    setAppliedSearch('');
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Academic structure"
        title="Classes"
        description="Browse each grade and its campus sections without losing the academic hierarchy."
      />
      <Card>
        <CardHeader>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={submit}
          >
            <div className="grid flex-1 gap-2">
              <Label htmlFor="class-search">Search classes</Label>
              <Input
                id="class-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Grade, section, room, or class teacher"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search /> Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={reset}
              disabled={!appliedSearch}
            >
              <RotateCcw /> Reset
            </Button>
          </form>
        </CardHeader>
      </Card>
      {state === 'loading' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton className="h-64 rounded-2xl" key={item} />
          ))}
        </div>
      ) : null}
      {state === 'error' ? (
        <DashboardErrorState
          message="We could not load the class hierarchy."
          onRetry={() => setVersion((value) => value + 1)}
        />
      ) : null}
      {state === 'ready' && grades.length === 0 ? (
        <DashboardEmptyState
          title="No classes found"
          description="Try another class, room, teacher, or campus."
          action={
            <Button variant="outline" onClick={reset}>
              Clear search
            </Button>
          }
        />
      ) : null}
      {state === 'ready' && grades.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {grades.map(([gradeName, sections]) => (
            <Card key={gradeName}>
              <CardHeader>
                <CardTitle>{gradeName}</CardTitle>
                <CardDescription>
                  {sections?.length ?? 0} section
                  {sections?.length === 1 ? '' : 's'} in the selected workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {sections?.map((item) => (
                  <div key={item.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">
                          Section {item.section}{' '}
                          <Badge className="ml-2" variant="outline">
                            {item.room}
                          </Badge>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Class teacher: {item.classTeacherName}
                        </p>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`View ${item.gradeName} Section ${item.section}`}
                        nativeButton={false}
                        render={
                          <Link href={`/school-admin/classes/${item.id}`} />
                        }
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" /> {item.studentCount}/
                        {item.capacity} students
                      </span>
                      <span>{item.campusName}</span>
                    </div>
                    <Progress
                      className="mt-2"
                      value={(item.studentCount / item.capacity) * 100}
                      aria-label={`${item.gradeName} Section ${item.section} capacity`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
