import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import DomainsClient from './DomainsClient';

export const metadata = { title: 'דומיינים | דשבורד' };

export default async function DomainsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const domains = await prisma.domain.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-5">
      <PageHeader title="דומיינים" />
      <DomainsClient domains={JSON.parse(JSON.stringify(domains))} />
    </div>
  );
}
