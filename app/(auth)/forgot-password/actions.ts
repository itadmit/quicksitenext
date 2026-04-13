'use server';

import { randomBytes, createHmac } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export type ForgotPasswordState = { success?: boolean; error?: string } | undefined;

const RESET_EXPIRY_MINUTES = 60;

function hashToken(token: string): string {
  const secret = process.env.AUTH_SECRET || 'dev-fallback-not-for-production';
  return createHmac('sha256', secret).update(token).digest('hex');
}

export async function forgotPasswordAction(
  _prev: ForgotPasswordState,
  fd: FormData,
): Promise<ForgotPasswordState> {
  const email = (fd.get('email') as string)?.trim().toLowerCase();
  if (!email) return { error: 'נא להזין אימייל' };

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) return { success: true };

  // Invalidate previous unused tokens
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const raw = randomBytes(32).toString('hex');
  const hashed = hashToken(raw);
  const expiresAt = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60_000);

  await prisma.passwordReset.create({
    data: { userId: user.id, token: hashed, expiresAt },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://${process.env.PLATFORM_DOMAIN || 'localhost:3000'}`;
  const resetUrl = `${baseUrl}/reset-password?token=${raw}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch {
    return { error: 'שליחת המייל נכשלה. נסו שוב מאוחר יותר.' };
  }

  return { success: true };
}
