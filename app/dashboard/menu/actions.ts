'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type MenuActionState = { error?: string; success?: boolean } | undefined;

export async function saveMenuAction(
  prev: MenuActionState,
  fd: FormData,
): Promise<MenuActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const location = fd.get('location') as string;
  const itemsJson = fd.get('items') as string;

  if (!location) return { error: 'מיקום תפריט נדרש' };

  let items: { id?: string; label: string; href: string; sortOrder: number }[];
  try {
    items = JSON.parse(itemsJson || '[]');
  } catch {
    return { error: 'נתוני פריטים לא תקינים' };
  }

  try {
    let menu = await prisma.menu.findUnique({
      where: { tenantId_location: { tenantId, location } },
    });

    if (!menu) {
      menu = await prisma.menu.create({
        data: { tenantId, name: location === 'header' ? 'תפריט עליון' : 'תפריט תחתון', location },
      });
    }

    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });

    if (items.length > 0) {
      await prisma.menuItem.createMany({
        data: items.map((item, i) => ({
          menuId: menu.id,
          label: item.label,
          href: item.href || '#',
          sortOrder: item.sortOrder ?? i,
        })),
      });
    }
  } catch {
    return { error: 'שגיאה בשמירת התפריט' };
  }

  revalidatePath('/dashboard/menu');
  return { success: true };
}

export async function deleteMenuItemAction(itemId: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const item = await prisma.menuItem.findUnique({
    where: { id: itemId },
    include: { menu: true },
  });
  if (!item || item.menu.tenantId !== tenantId) return;

  await prisma.menuItem.delete({ where: { id: itemId } });
  revalidatePath('/dashboard/menu');
}
