import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OnboardingWizard from './OnboardingWizard';

export const metadata = { title: 'הגדרת האתר | QuickSite' };

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) redirect('/register');

  const [tenant, settings] = await Promise.all([
    prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true, slug: true } }),
    prisma.siteSettings.findUnique({ where: { tenantId }, select: { siteName: true, primaryColor: true, tagline: true } }),
  ]);

  if (!tenant) redirect('/register');

  return (
    <OnboardingWizard
      initialName={settings?.siteName || tenant.name}
      initialColor={settings?.primaryColor || '#635BFF'}
      initialTagline={settings?.tagline || ''}
      slug={tenant.slug}
    />
  );
}
