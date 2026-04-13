import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
import { CreateToggleProvider, CreateToggleButton } from '@/components/dashboard/CreateToggle';
import DomainsClient from './DomainsClient';

export const metadata = { title: 'דומיינים | דשבורד' };

export default async function DomainsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const domains = await prisma.domain.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  return (
    <CreateToggleProvider>
      <ListPageLayout
        title="דומיינים"
        subtitle={`${domains.length} דומיינים`}
        actionSlot={<CreateToggleButton label="+ הוסף דומיין" />}
        searchBasePath="/dashboard/domains"
        searchPlaceholder="חיפוש דומיין..."
      >
        <DomainsClient domains={JSON.parse(JSON.stringify(domains))} />
      </ListPageLayout>
    </CreateToggleProvider>
  );
}
