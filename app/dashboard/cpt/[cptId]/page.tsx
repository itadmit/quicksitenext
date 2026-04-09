import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/dashboard/PageHeader';
import EntriesClient from './EntriesClient';

export default async function CptEntriesPage({ params }: { params: Promise<{ cptId: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { cptId } = await params;

  const cpt = await prisma.customPostType.findFirst({
    where: { id: cptId, tenantId },
    include: { entries: { orderBy: { createdAt: 'desc' } } },
  });
  if (!cpt) notFound();

  return (
    <div className="space-y-5">
      <PageHeader title={cpt.name} subtitle={`${cpt.entries.length} רשומות`} backHref="/dashboard/cpt" />
      <EntriesClient cpt={JSON.parse(JSON.stringify(cpt))} />
    </div>
  );
}
