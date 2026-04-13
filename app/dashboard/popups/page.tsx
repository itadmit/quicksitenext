import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ListPageLayout from '@/components/dashboard/ListPageLayout';
import PopupsClient from './PopupsClient';

export const metadata = { title: 'פופאפים | דשבורד' };

export default async function PopupsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const popups = await prisma.popup.findMany({ where: { tenantId }, orderBy: { priority: 'asc' } });

  return (
    <ListPageLayout
      title="פופאפים"
      subtitle={`${popups.length} פופאפים`}
      searchBasePath="/dashboard/popups"
      searchPlaceholder="חיפוש לפי שם..."
    >
      <PopupsClient popups={JSON.parse(JSON.stringify(popups))} />
    </ListPageLayout>
  );
}
