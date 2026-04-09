import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import PopupsClient from './PopupsClient';

export const metadata = { title: 'פופאפים | דשבורד' };

export default async function PopupsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const popups = await prisma.popup.findMany({ where: { tenantId }, orderBy: { priority: 'asc' } });

  return (
    <div className="space-y-5">
      <PageHeader title="פופאפים" subtitle={`${popups.length} פופאפים`} />
      <PopupsClient popups={JSON.parse(JSON.stringify(popups))} />
    </div>
  );
}
