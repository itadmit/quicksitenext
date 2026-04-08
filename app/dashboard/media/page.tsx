import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MediaClient from './MediaClient';

export default async function MediaPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const items = await prisma.mediaItem.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  return <MediaClient items={JSON.parse(JSON.stringify(items))} />;
}
