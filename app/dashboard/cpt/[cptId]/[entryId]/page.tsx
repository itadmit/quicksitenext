import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardCard from '@/components/dashboard/DashboardCard';
import EntryForm from './EntryForm';

export default async function EditEntryPage({ params }: { params: Promise<{ cptId: string; entryId: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { cptId, entryId } = await params;

  const entry = await prisma.customPostEntry.findUnique({
    where: { id: entryId },
    include: { cpt: true },
  });
  if (!entry || entry.cpt.tenantId !== tenantId) notFound();

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader
        title="עריכת רשומה"
        subtitle={entry.title}
        backHref={`/dashboard/cpt/${cptId}`}
      />
      <DashboardCard>
        <EntryForm entry={JSON.parse(JSON.stringify(entry))} cptId={cptId} />
      </DashboardCard>
    </div>
  );
}
