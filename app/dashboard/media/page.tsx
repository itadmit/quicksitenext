import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import MediaClient from './MediaClient';

export default async function MediaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = user.memberships[0].tenantId;
  const items = await prisma.mediaItem.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  return <MediaClient items={JSON.parse(JSON.stringify(items))} />;
}
