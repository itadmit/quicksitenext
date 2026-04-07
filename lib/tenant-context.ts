import { prisma } from './prisma';

export async function getTenantStats(tenantId: string) {
  const [pages, posts, leads, popups] = await Promise.all([
    prisma.page.count({ where: { tenantId } }),
    prisma.post.count({ where: { tenantId } }),
    prisma.lead.count({ where: { tenantId } }),
    prisma.popup.count({ where: { tenantId } }),
  ]);
  const newLeads = await prisma.lead.count({
    where: { tenantId, status: 'NEW' },
  });
  return { pages, posts, leads, newLeads, popups };
}
