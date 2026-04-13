'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import { z } from 'zod';
import { getTemplate, templates } from '@/lib/templates';

const schema = z.object({
  name: z.string().min(1, 'שם נדרש').max(120),
  email: z.string().email('אימייל לא תקין'),
  password: z.string().min(6, 'סיסמה חייבת להכיל לפחות 6 תווים'),
  slug: z
    .string()
    .min(2, 'לפחות 2 תווים')
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'רק אותיות קטנות באנגלית, מספרים ומקפים'),
  templateId: z.string().min(1),
});

export type RegisterState = { error?: string; fieldErrors?: Record<string, string[]> } | undefined;

export async function registerAction(_prev: RegisterState, fd: FormData): Promise<RegisterState> {
  const parsed = schema.safeParse({
    name: fd.get('name'),
    email: fd.get('email'),
    password: fd.get('password'),
    slug: fd.get('slug'),
    templateId: fd.get('templateId'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, email, password, slug, templateId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'אימייל זה כבר רשום' };

  const slugTaken = await prisma.tenant.findUnique({ where: { slug } });
  if (slugTaken) return { error: 'כתובת האתר תפוסה, נסו אחרת' };

  const template = getTemplate(templateId) ?? templates[0];
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
      name: name,
      members: { create: { userId: user.id, role: 'owner' } },
      siteSettings: {
        create: {
          siteName: name,
          primaryColor: template.primaryColor,
          tagline: template.siteSettings.tagline,
          footerText: template.siteSettings.footerText,
        },
      },
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

  for (const page of template.pages) {
    const heroBlock = page.blocks.find(b => b.type === 'hero');
    if (heroBlock && page.isHome) {
      heroBlock.data.title = `ברוכים הבאים ל-${name}`;
    }

    await prisma.page.create({
      data: {
        tenantId: tenant.id,
        title: page.title,
        slug: page.slug,
        template: page.template,
        isHome: page.isHome,
        status: 'published',
        blocks: JSON.stringify(page.blocks),
      },
    });
  }

  for (const menuDef of template.menus) {
    const menu = await prisma.menu.create({
      data: {
        tenantId: tenant.id,
        name: menuDef.name,
        location: menuDef.location,
      },
    });
    await prisma.menuItem.createMany({
      data: menuDef.items.map((item, i) => ({
        menuId: menu.id,
        label: item.label,
        href: item.href,
        sortOrder: i,
      })),
    });
  }

  for (const cptDef of template.cpts) {
    const cpt = await prisma.customPostType.create({
      data: {
        tenantId: tenant.id,
        name: cptDef.name,
        slug: cptDef.slug,
        fields: JSON.stringify(cptDef.fields),
      },
    });
    if (cptDef.entries.length > 0) {
      await prisma.customPostEntry.createMany({
        data: cptDef.entries.map(entry => ({
          cptId: cpt.id,
          title: entry.title,
          slug: entry.slug,
          status: entry.status,
          data: JSON.stringify(entry.data),
        })),
      });
    }
  }

  await createSession(user.id);
  redirect('/onboarding');
}
