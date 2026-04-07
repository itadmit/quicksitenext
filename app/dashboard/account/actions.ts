'use server';

import bcrypt from 'bcryptjs';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type AccountActionState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(prev: AccountActionState, fd: FormData): Promise<AccountActionState> {
  const user = await requireUser();
  const name = (fd.get('name') as string)?.trim();

  if (!name || name.length < 1) return { error: 'שם נדרש' };
  if (name.length > 120) return { error: 'שם ארוך מדי' };

  try {
    await prisma.user.update({ where: { id: user.id }, data: { name } });
  } catch {
    return { error: 'שגיאה בעדכון הפרופיל' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function changePasswordAction(prev: AccountActionState, fd: FormData): Promise<AccountActionState> {
  const user = await requireUser();

  const currentPassword = fd.get('currentPassword') as string;
  const newPassword = fd.get('newPassword') as string;
  const confirmPassword = fd.get('confirmPassword') as string;

  if (!currentPassword || !newPassword) return { error: 'כל השדות נדרשים' };
  if (newPassword.length < 6) return { error: 'סיסמה חדשה חייבת להכיל לפחות 6 תווים' };
  if (newPassword !== confirmPassword) return { error: 'הסיסמאות לא תואמות' };

  const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!fullUser) return { error: 'משתמש לא נמצא' };

  const valid = await bcrypt.compare(currentPassword, fullUser.passwordHash);
  if (!valid) return { error: 'סיסמה נוכחית שגויה' };

  const passwordHash = await bcrypt.hash(newPassword, 12);

  try {
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  } catch {
    return { error: 'שגיאה בשינוי הסיסמה' };
  }

  return { success: true };
}
