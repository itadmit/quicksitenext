'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUnreadNotifications() {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  return prisma.notification.findMany({
    where: { userId: user.id, tenantId, read: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
}

export async function markNotificationReadAction(id: string) {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });
  revalidatePath('/dashboard');
}

export async function markAllNotificationsReadAction() {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  await prisma.notification.updateMany({
    where: { userId: user.id, tenantId, read: false },
    data: { read: true },
  });
  revalidatePath('/dashboard');
}

export async function createNotification(params: {
  userId: string;
  tenantId: string;
  type: string;
  message: string;
  link?: string;
}) {
  await prisma.notification.create({ data: params });
}
