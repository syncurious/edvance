import { ModulePlaceholder } from '@/components/shared/module-placeholder';

function titleize(segment: string) {
  return segment
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

export default async function SuperAdminModulePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const title = titleize(slug.at(-1) ?? 'Module');

  return (
    <ModulePlaceholder
      title={title}
      description="This platform route is connected to the reusable Super Admin shell and ready for its scheduled feature work."
    />
  );
}
