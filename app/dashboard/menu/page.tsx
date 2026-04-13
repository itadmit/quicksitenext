import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import MenuEditor from './MenuEditor';

export const metadata = { title: 'תפריט | דשבורד' };

export default async function MenuPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const [menus, pages] = await Promise.all([
    prisma.menu.findMany({
      where: { tenantId },
      include: { items: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.page.findMany({
      where: { tenantId },
      select: { title: true, slug: true, isHome: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader title="תפריטים" subtitle="ניהול תפריטי האתר" />
      <MenuEditor menus={JSON.parse(JSON.stringify(menus))} pages={pages} />
    </div>
  );
}
