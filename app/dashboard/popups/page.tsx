import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PopupsClient from './PopupsClient';

export default async function PopupsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const popups = await prisma.popup.findMany({ where: { tenantId }, orderBy: { priority: 'asc' } });

  return <PopupsClient popups={JSON.parse(JSON.stringify(popups))} />;
}
