'use server';

import { createHmac } from 'crypto';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export type ResetPasswordState = { error?: string } | undefined;

function hashToken(token: string): string {
  const secret = process.env.AUTH_SECRET || 'dev-fallback-not-for-production';
  return createHmac('sha256', secret).update(token).digest('hex');
}

export async function resetPasswordAction(
  _prev: ResetPasswordState,
  fd: FormData,
): Promise<ResetPasswordState> {
  const token = fd.get('token') as string;
  const password = fd.get('password') as string;
  const confirmPassword = fd.get('confirmPassword') as string;

  if (!token) return { error: 'קישור לא תקין' };
  if (!password || password.length < 6) return { error: 'סיסמה חייבת להכיל לפחות 6 תווים' };
  if (password !== confirmPassword) return { error: 'הסיסמאות לא תואמות' };

  const hashed = hashToken(token);

  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token: hashed },
    include: { user: true },
  });

  if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
    return { error: 'הקישור פג תוקף או כבר נוצל. בקשו קישור חדש.' };
  }

  const newHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newHash },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
    prisma.session.deleteMany({
      where: { userId: resetRecord.userId },
    }),
  ]);

  redirect('/login?reset=success');
}
