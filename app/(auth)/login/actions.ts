'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = (fd.get('email') as string)?.trim().toLowerCase();
  const password = fd.get('password') as string;

  if (!email || !password) return { error: 'נא למלא את כל השדות' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'אימייל או סיסמה שגויים' };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: 'אימייל או סיסמה שגויים' };

  await createSession(user.id);
  redirect('/dashboard');
}
