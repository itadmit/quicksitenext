import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';

export const metadata = { title: 'דשבורד | CMS Platform' };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tenant = user.memberships[0]?.tenant;
  if (!tenant) redirect('/register');

  return (
    <div className="min-h-screen bg-background-light">
      <Sidebar tenantName={tenant.name} tenantSlug={tenant.slug} userName={user.name} />
      <main className="min-h-screen p-4 pt-16 md:mr-64 md:p-6 md:pt-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
