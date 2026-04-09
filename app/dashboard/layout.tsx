import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';
import CommandPalette from '@/components/dashboard/CommandPalette';
import NavigationProgress from '@/components/dashboard/NavigationProgress';

export const metadata = { title: 'דשבורד | QuickSite' };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tenant = user.memberships[0]?.tenant;
  if (!tenant) redirect('/register');

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <NavigationProgress />
      <Sidebar tenantName={tenant.name} tenantSlug={tenant.slug} userName={user.name} />
      <CommandPalette />
      <main className="min-h-screen p-4 pt-16 md:mr-64 md:p-6 md:pt-6">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
