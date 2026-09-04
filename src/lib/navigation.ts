import type { NavigationGroup } from '@/types/navigation';

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

function titleize(segment: string) {
  return segment
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

export function isNavigationItemActive(
  pathname: string,
  href: string | undefined,
  childHrefs: string[] = [],
) {
  const paths = [href, ...childHrefs].filter(Boolean) as string[];

  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function getBreadcrumbs(
  pathname: string,
  roleLabel: string,
  navigation: NavigationGroup[],
): BreadcrumbEntry[] {
  const segments = pathname.split('/').filter(Boolean);
  const rolePath = segments[0] ? `/${segments[0]}/dashboard` : '/';
  const labelByHref = new Map<string, string>();

  for (const group of navigation) {
    for (const item of group.items) {
      if (item.href) labelByHref.set(item.href, item.title);
      for (const child of item.children ?? []) {
        if (!labelByHref.has(child.href)) {
          labelByHref.set(child.href, child.title);
        }
      }
    }
  }

  const crumbs: BreadcrumbEntry[] = [
    {
      label: roleLabel,
      href: segments.length > 1 ? rolePath : undefined,
    },
  ];

  for (let index = 1; index < segments.length; index += 1) {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    crumbs.push(
      isLast
        ? { label: labelByHref.get(href) ?? titleize(segments[index]) }
        : {
            label: labelByHref.get(href) ?? titleize(segments[index]),
            href,
          },
    );
  }

  return crumbs;
}
