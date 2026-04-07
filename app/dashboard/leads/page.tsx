import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import LeadsClient from './LeadsClient';

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = user.memberships[0].tenantId;
  const { status } = await searchParams;

  const where: Record<string, unknown> = { tenantId };
  if (status && status !== 'ALL') where.status = status;

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } });

  return <LeadsClient leads={JSON.parse(JSON.stringify(leads))} currentStatus={status || 'ALL'} />;
}
