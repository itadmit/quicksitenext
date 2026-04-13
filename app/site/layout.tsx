import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import TenantHeader from '@/components/tenant/TenantHeader';
import TenantFooter from '@/components/tenant/TenantFooter';
import TenantPopupHost from '@/components/tenant/PopupHost';
import TrackPageView from '@/components/tenant/TrackPageView';

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

  let themeVars: Record<string, string> = {};
  try {
    const parsed = JSON.parse(settings?.themeJson || '{}');
    if (parsed.primary) themeVars['--tenant-primary'] = parsed.primary;
    if (parsed.headingText) themeVars['--theme-heading'] = parsed.headingText;
    if (parsed.bodyText) themeVars['--theme-body'] = parsed.bodyText;
    if (parsed.buttonText) themeVars['--theme-btn-text'] = parsed.buttonText;
    if (parsed.background) themeVars['--theme-bg'] = parsed.background;
    if (parsed.heroOverlay) themeVars['--theme-overlay'] = parsed.heroOverlay;
    if (parsed.heroGradientFrom) themeVars['--theme-grad-from'] = parsed.heroGradientFrom;
    if (parsed.heroGradientTo) themeVars['--theme-grad-to'] = parsed.heroGradientTo;
  } catch { /* use defaults */ }

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
      style={{ '--tenant-primary': primaryColor, ...themeVars } as React.CSSProperties}
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
      <TrackPageView />

      {settings?.customCss ? (
        <style dangerouslySetInnerHTML={{ __html: settings.customCss }} />
      ) : null}

      {/* Google Tag Manager */}
      {settings?.gtmId && (
        <>
          <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtmId}');` }} />
          <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${settings.gtmId}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>
        </>
      )}

      {/* Google Analytics (standalone, without GTM) */}
      {settings?.analyticsId && !settings?.gtmId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`} />
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.analyticsId}');` }} />
        </>
      )}

      {/* Facebook Pixel */}
      {settings?.fbPixelId && (
        <>
          <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.fbPixelId}');fbq('track','PageView');` }} />
          <noscript><img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${settings.fbPixelId}&ev=PageView&noscript=1`} alt="" /></noscript>
        </>
      )}

      {/* Custom head code */}
      {settings?.customHeadCode && (
        <script dangerouslySetInnerHTML={{ __html: settings.customHeadCode }} />
      )}

      {/* QS Tracking Events Script */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.qsTrack=function(eventName,params){
          params=params||{};
          try{
            if(typeof fbq==='function'){
              if(eventName==='Lead')fbq('track','Lead',params);
              else if(eventName==='ViewContent')fbq('track','ViewContent',params);
              else fbq('trackCustom',eventName,params);
            }
          }catch(e){}
          try{
            if(typeof gtag==='function'){
              gtag('event',eventName,params);
            } else if(window.dataLayer){
              window.dataLayer.push({event:eventName,...params});
            }
          }catch(e){}
        };
      `}} />
    </div>
  );
}
