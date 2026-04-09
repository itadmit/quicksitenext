import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import MenuEditor from './MenuEditor';

export const metadata = { title: 'תפריט | דשבורד' };

export default async function MenuPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const menus = await prisma.menu.findMany({
    where: { tenantId },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="תפריטים" />
      <MenuEditor menus={JSON.parse(JSON.stringify(menus))} />
    </div>
  );
}
