import { getCurrentUser } from '@/lib/auth';
import { getTenantStats } from '@/lib/tenant-context';
import Link from 'next/link';

export default async function DashboardHome() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const stats = await getTenantStats(tenantId);

  const cards = [
    { label: 'עמודים', value: stats.pages, href: '/dashboard/pages', icon: 'description' },
    { label: 'פוסטים', value: stats.posts, href: '/dashboard/posts', icon: 'article' },
    { label: 'לידים חדשים', value: stats.newLeads, href: '/dashboard/leads', icon: 'contact_mail' },
    { label: 'פופאפים', value: stats.popups, href: '/dashboard/popups', icon: 'web_asset' },
  ];

  return (
    <div>
      <h1 className="font-noto text-3xl font-black text-charcoal mb-8">שלום, {user!.name}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="border border-charcoal/10 bg-white p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-primary">{c.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-charcoal/50">{c.label}</span>
            </div>
            <p className="font-noto text-3xl font-black text-charcoal">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="border border-charcoal/10 bg-white p-6">
        <h2 className="font-noto text-lg font-bold text-charcoal mb-3">קישורים מהירים</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/pages/new" className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90">
            עמוד חדש
          </Link>
          <Link href="/dashboard/posts/new" className="border border-charcoal/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:border-primary">
            פוסט חדש
          </Link>
          <Link href="/dashboard/settings" className="border border-charcoal/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-charcoal hover:border-primary">
            הגדרות אתר
          </Link>
        </div>
      </div>
    </div>
  );
}
