import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CptClient from './CptClient';

export default async function CptPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const cpts = await prisma.customPostType.findMany({
    where: { tenantId },
    include: { _count: { select: { entries: true } } },
    orderBy: { name: 'asc' },
  });

  return <CptClient cpts={JSON.parse(JSON.stringify(cpts))} />;
}
