'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'שם נדרש').max(120),
  email: z.string().email('אימייל לא תקין'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  slug: z
    .string()
    .min(2, 'לפחות 2 תווים')
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'רק אותיות קטנות באנגלית, מספרים ומקפים'),
});

export type RegisterState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function registerAction(_prev: RegisterState, fd: FormData): Promise<RegisterState> {
  const parsed = schema.safeParse({
    name: fd.get('name'),
    email: fd.get('email'),
    password: fd.get('password'),
    slug: fd.get('slug'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, email, password, slug } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'אימייל זה כבר רשום' };

  const slugTaken = await prisma.tenant.findUnique({ where: { slug } });
  if (slugTaken) return { error: 'כתובת האתר תפוסה, נסו אחרת' };

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      slug,
      name: name + ' Site',
      members: { create: { userId: user.id, role: 'owner' } },
      siteSettings: { create: { siteName: name + ' Site' } },
    },
  });

  await prisma.domain.create({
    data: {
      tenantId: tenant.id,
      hostname: slug,
      type: 'subdomain',
      verified: true,
      verifiedAt: new Date(),
    },
  });

  await prisma.page.create({
    data: {
      tenantId: tenant.id,
      title: 'דף הבית',
      slug: 'home',
      template: 'home',
      isHome: true,
      status: 'published',
      blocks: JSON.stringify([
        {
          id: 'init-hero',
          type: 'hero',
          data: {
            title: `ברוכים הבאים ל-${name}`,
            subtitle: 'האתר החדש שלנו',
            backgroundImage: '',
            primaryBtnLabel: 'צרו קשר',
            primaryBtnHref: '/contact',
            secondaryBtnLabel: '',
            secondaryBtnHref: '',
          },
        },
      ]),
    },
  });

  await prisma.page.create({
    data: {
      tenantId: tenant.id,
      title: 'צור קשר',
      slug: 'contact',
      template: 'contact',
      isHome: false,
      status: 'published',
      blocks: JSON.stringify([
        { id: 'init-text', type: 'text', data: { content: '<h2 style="text-align:center">צרו קשר</h2><p style="text-align:center">נשמח לשמוע מכם</p>' } },
        { id: 'init-form', type: 'contactForm', data: { title: 'השאירו פרטים', buttonLabel: 'שליחה' } },
      ]),
    },
  });

  const menu = await prisma.menu.create({
    data: {
      tenantId: tenant.id,
      name: 'תפריט ראשי',
      location: 'header',
    },
  });
  await prisma.menuItem.createMany({
    data: [
      { menuId: menu.id, label: 'דף הבית', href: '/', sortOrder: 0 },
      { menuId: menu.id, label: 'צור קשר', href: '/contact', sortOrder: 1 },
    ],
  });

  await createSession(user.id);
  redirect('/dashboard');
}
