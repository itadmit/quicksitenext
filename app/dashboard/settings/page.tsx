import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = user.memberships[0].tenantId;
  const settings = await prisma.siteSettings.findUnique({ where: { tenantId } });

  return (
    <div>
      <h1 className="font-noto text-3xl font-black text-charcoal mb-8">הגדרות אתר</h1>
      <SettingsForm settings={settings ? JSON.parse(JSON.stringify(settings)) : null} />
    </div>
  );
}
