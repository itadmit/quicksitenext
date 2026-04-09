import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import LeadsClient from './LeadsClient';

export const metadata = { title: 'לידים | דשבורד' };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { status, q } = await searchParams;

  const where: Record<string, unknown> = { tenantId };
  if (status && status !== 'ALL') where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { company: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [leads, totalCount] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } }),
    prisma.lead.count({ where: { tenantId } }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader title="לידים" subtitle={`${totalCount} לידים סה״כ`} />
      <LeadsClient leads={JSON.parse(JSON.stringify(leads))} currentStatus={status || 'ALL'} currentSearch={q || ''} />
    </div>
  );
}
