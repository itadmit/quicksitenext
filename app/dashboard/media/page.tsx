import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import MediaClient from './MediaClient';

export const metadata = { title: 'מדיה | דשבורד' };

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { q } = await searchParams;

  const where: Record<string, unknown> = { tenantId };
  if (q) where.filename = { contains: q, mode: 'insensitive' };

  const items = await prisma.mediaItem.findMany({ where, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-5">
      <PageHeader title="ספריית מדיה" subtitle={`${items.length} קבצים`} />
      <MediaClient items={JSON.parse(JSON.stringify(items))} />
    </div>
  );
}
