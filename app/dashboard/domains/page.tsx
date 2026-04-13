import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
import DomainsClient from './DomainsClient';

export const metadata = { title: 'דומיינים | דשבורד' };

export default async function DomainsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const domains = await prisma.domain.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  return (
    <ListPageLayout
      title="דומיינים"
      subtitle={`${domains.length} דומיינים`}
      searchBasePath="/dashboard/domains"
      searchPlaceholder="חיפוש דומיין..."
    >
      <DomainsClient domains={JSON.parse(JSON.stringify(domains))} />
    </ListPageLayout>
  );
}
