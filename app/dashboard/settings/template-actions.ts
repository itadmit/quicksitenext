'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getTemplate } from '@/lib/templates';

export type ApplyTemplateState = { error?: string; success?: boolean } | undefined;

export async function applyTemplateAction(templateId: string): Promise<ApplyTemplateState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;

  const template = getTemplate(templateId);
  if (!template) return { error: 'תבנית לא נמצאה' };

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  try {
    await prisma.$transaction(async (tx) => {
      await tx.page.deleteMany({ where: { tenantId } });

      const menus = await tx.menu.findMany({ where: { tenantId }, select: { id: true } });
      for (const m of menus) {
        await tx.menuItem.deleteMany({ where: { menuId: m.id } });
      }
      await tx.menu.deleteMany({ where: { tenantId } });

      for (const page of template.pages) {
        const blocks = JSON.parse(JSON.stringify(page.blocks));
        const heroBlock = blocks.find((b: { type: string }) => b.type === 'hero');
        if (heroBlock && page.isHome && tenant) {
          heroBlock.data.title = `ברוכים הבאים ל-${tenant.name}`;
        }

        await tx.page.create({
          data: {
            tenantId,
            title: page.title,
            slug: page.slug,
            template: page.template,
            isHome: page.isHome,
            status: 'published',
            blocks: JSON.stringify(blocks),
          },
        });
      }

      for (const menuDef of template.menus) {
        const menu = await tx.menu.create({
          data: {
            tenantId,
            name: menuDef.name,
            location: menuDef.location,
          },
        });
        await tx.menuItem.createMany({
          data: menuDef.items.map((item, i) => ({
            menuId: menu.id,
            label: item.label,
            href: item.href,
            sortOrder: i,
          })),
        });
      }

      const existingCpts = await tx.customPostType.findMany({ where: { tenantId }, select: { id: true } });
      for (const c of existingCpts) {
        await tx.customPostEntry.deleteMany({ where: { cptId: c.id } });
      }
      await tx.customPostType.deleteMany({ where: { tenantId } });

      for (const cptDef of template.cpts) {
        const cpt = await tx.customPostType.create({
          data: {
            tenantId,
            name: cptDef.name,
            slug: cptDef.slug,
            fields: JSON.stringify(cptDef.fields),
          },
        });
        if (cptDef.entries.length > 0) {
          await tx.customPostEntry.createMany({
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

      await tx.siteSettings.upsert({
        where: { tenantId },
        update: {
          primaryColor: template.primaryColor,
          tagline: template.siteSettings.tagline,
          footerText: template.siteSettings.footerText,
          ...(template.siteSettings.themeJson ? { themeJson: template.siteSettings.themeJson } : {}),
        },
        create: {
          tenantId,
          siteName: tenant?.name ?? '',
          primaryColor: template.primaryColor,
          tagline: template.siteSettings.tagline,
          footerText: template.siteSettings.footerText,
          ...(template.siteSettings.themeJson ? { themeJson: template.siteSettings.themeJson } : {}),
        },
      });
    });
  } catch {
    return { error: 'שגיאה בהחלת התבנית' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
