import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import EntriesClient from './EntriesClient';

export default async function CptEntriesPage({ params }: { params: Promise<{ cptId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = user.memberships[0].tenantId;
  const { cptId } = await params;

  const cpt = await prisma.customPostType.findFirst({
    where: { id: cptId, tenantId },
    include: { entries: { orderBy: { createdAt: 'desc' } } },
  });
  if (!cpt) notFound();

  return <EntriesClient cpt={JSON.parse(JSON.stringify(cpt))} />;
}
