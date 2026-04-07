import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlockRenderer from '@/components/tenant/BlockRenderer';

async function getTenantId(): Promise<string | null> {
  const h = await headers();
  const slug = h.get('x-tenant-slug');
  const host = h.get('x-tenant-host');

  if (slug) {
    const t = await prisma.tenant.findUnique({ where: { slug }, select: { id: true } });
    return t?.id ?? null;
  }
  if (host) {
    const d = await prisma.domain.findUnique({ where: { hostname: host }, select: { tenantId: true } });
    return d?.tenantId ?? null;
  }
  return null;
}

export default async function TenantHomePage() {
  const tenantId = await getTenantId();
  if (!tenantId) notFound();

  const page = await prisma.page.findFirst({
    where: { tenantId, isHome: true, status: 'published' },
  });

  if (!page) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <h1 className="font-display text-4xl">ברוכים הבאים</h1>
          <p className="mt-4 text-charcoal/60">עמוד הבית טרם הוגדר.</p>
        </div>
      </section>
    );
  }

  return <BlockRenderer blocks={page.blocks} tenantId={tenantId} />;
}
