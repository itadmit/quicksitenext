import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PageHeader from '@/components/dashboard/PageHeader';
import SettingsTabs from './SettingsTabs';

export const metadata = { title: 'הגדרות אתר | דשבורד' };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const [settings, redirects, tenant] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { tenantId } }),
    prisma.redirect.findMany({ where: { tenantId }, orderBy: { fromPath: 'asc' } }),
    prisma.tenant.findUnique({ where: { id: tenantId }, select: { slug: true } }),
  ]);

  const siteUrl = `${tenant?.slug}.quicksite.co.il`;

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title="הגדרות אתר" />
      <SettingsTabs
        settings={settings ? { ...JSON.parse(JSON.stringify(settings)), siteUrl } : null}
        redirects={JSON.parse(JSON.stringify(redirects))}
      />
    </div>
  );
}
