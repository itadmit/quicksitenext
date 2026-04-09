import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
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
    <div className="space-y-5">
      <PageHeader title="סוגי תוכן מותאמים" />
      <CptClient cpts={JSON.parse(JSON.stringify(cpts))} />
    </div>
  );
}
