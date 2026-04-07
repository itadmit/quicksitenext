import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import TenantHeader from '@/components/tenant/TenantHeader';
import TenantFooter from '@/components/tenant/TenantFooter';
import TenantPopupHost from '@/components/tenant/PopupHost';

async function resolveTenant() {
  const h = await headers();
  const slug = h.get('x-tenant-slug');
  const host = h.get('x-tenant-host');

  if (slug) {
    return prisma.tenant.findUnique({
      where: { slug },
      include: {
        siteSettings: true,
        menus: { include: { items: { orderBy: { sortOrder: 'asc' } } } },
        popups: { where: { enabled: true }, orderBy: { priority: 'asc' } },
      },
    });
  }

  if (host) {
    const domain = await prisma.domain.findFirst({
      where: { hostname: host, verified: true },
      select: { tenantId: true },
    });
    if (!domain) return null;
    return prisma.tenant.findUnique({
      where: { id: domain.tenantId },
      include: {
        siteSettings: true,
        menus: { include: { items: { orderBy: { sortOrder: 'asc' } } } },
        popups: { where: { enabled: true }, orderBy: { priority: 'asc' } },
      },
    });
  }

  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await resolveTenant();
  if (!tenant) return { title: 'לא נמצא' };
  const s = tenant.siteSettings;
  return {
    title: s?.defaultSeoTitle || s?.siteName || tenant.name,
    description: s?.defaultSeoDesc || s?.tagline || '',
    icons: s?.faviconUrl ? [{ url: s.faviconUrl }] : undefined,
  };
}

export default async function TenantSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenant = await resolveTenant();
  if (!tenant) notFound();

  const settings = tenant.siteSettings;
  const headerMenu = tenant.menus.find((m) => m.location === 'header');
  const footerMenu = tenant.menus.find((m) => m.location === 'footer');

  const primaryColor = settings?.primaryColor || '#a28b5d';

  const popups = tenant.popups.map((p) => ({
    id: p.id,
    enabled: p.enabled,
    priority: p.priority,
    trigger: p.trigger as 'on_load' | 'exit_intent' | 'time_on_site' | 'scroll_depth',
    delayMs: p.delayMs,
    timeOnSiteMs: p.timeOnSiteMs,
    scrollDepthPercent: p.scrollDepthPercent,
    title: p.title,
    body: p.body,
    imageUrl: p.imageUrl,
    ctaLabel: p.ctaLabel,
    ctaHref: p.ctaHref,
    dismissLabel: p.dismissLabel,
    frequency: p.frequency as 'always' | 'once_per_session' | 'once_per_days_after_dismiss',
    hideDaysAfterDismiss: p.hideDaysAfterDismiss,
  }));

  return (
    <div
      className="flex min-h-screen flex-col font-sans text-charcoal"
      style={{ '--tenant-primary': primaryColor } as React.CSSProperties}
    >
      <TenantHeader
        siteName={settings?.siteName || tenant.name}
        logoUrl={settings?.logoUrl ?? null}
        menuItems={headerMenu?.items ?? []}
      />

      <main className="flex-1">{children}</main>

      <TenantFooter
        siteName={settings?.siteName || tenant.name}
        footerText={settings?.footerText || ''}
        socialLinks={settings?.socialLinks || '[]'}
        menuItems={footerMenu?.items ?? []}
      />

      <TenantPopupHost popups={popups} />

      {settings?.customCss ? (
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
      ) : null}

      {settings?.analyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`} />
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.analyticsId}');` }} />
        </>
      )}
    </div>
  );
}
