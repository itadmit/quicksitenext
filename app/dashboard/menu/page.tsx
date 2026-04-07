import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import MenuEditor from './MenuEditor';

export default async function MenuPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = user.memberships[0].tenantId;
  const menus = await prisma.menu.findMany({
    where: { tenantId },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return (
    <div>
      <h1 className="font-noto text-3xl font-black text-charcoal mb-8">עורך תפריטים</h1>
      <MenuEditor menus={JSON.parse(JSON.stringify(menus))} />
    </div>
  );
}
