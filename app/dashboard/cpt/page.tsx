import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
import CptClient from './CptClient';

export const metadata = { title: 'תוכן מותאם | דשבורד' };

export default async function CptPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const cpts = await prisma.customPostType.findMany({
    where: { tenantId },
    include: { _count: { select: { entries: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <ListPageLayout
      title="סוגי תוכן מותאמים"
      subtitle={`${cpts.length} סוגים`}
      searchBasePath="/dashboard/cpt"
      searchPlaceholder="חיפוש סוג תוכן..."
    >
      <CptClient cpts={JSON.parse(JSON.stringify(cpts))} />
    </ListPageLayout>
  );
}
