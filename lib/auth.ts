import { cache } from 'react';
import { cookies } from 'next/headers';
import { createHmac, randomBytes } from 'crypto';
import { prisma } from './prisma';

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET environment variable is required in production');
}
const EFFECTIVE_SECRET = AUTH_SECRET || 'dev-fallback-not-for-production';

const SESSION_COOKIE = 'saas_session';
const SESSION_DAYS = 30;

function hashToken(token: string): string {
  return createHmac('sha256', EFFECTIVE_SECRET).update(token).digest('hex');
}

export async function createSession(userId: string): Promise<string> {
  const raw = randomBytes(32).toString('hex');
  const hashed = hashToken(raw);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await prisma.session.create({
    data: { userId, token: hashed, expiresAt },
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 86_400,
  });

  return raw;
}

export const getSession = cache(async () => {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const hashed = hashToken(raw);
  const session = await prisma.session.findUnique({
    where: { token: hashed },
    include: {
      user: {
        include: {
          memberships: {
            include: { tenant: true },
          },
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  return session.user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('unauthorized');
  return user;
}

export async function destroySession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (raw) {
    const hashed = hashToken(raw);
    await prisma.session.delete({ where: { token: hashed } }).catch(() => {});
  }
  jar.delete(SESSION_COOKIE);
}
