import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import EntryForm from './EntryForm';

export default async function EditEntryPage({ params }: { params: Promise<{ cptId: string; entryId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = user.memberships[0].tenantId;
  const { cptId, entryId } = await params;

  const entry = await prisma.customPostEntry.findUnique({
    where: { id: entryId },
    include: { cpt: true },
  });
  if (!entry || entry.cpt.tenantId !== tenantId) notFound();

  return <EntryForm entry={JSON.parse(JSON.stringify(entry))} cptId={cptId} />;
}
