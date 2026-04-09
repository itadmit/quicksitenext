import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import SidebarNav from './SidebarNav';
import NotificationBell from './NotificationBell';

const navItems = [
  { href: '/dashboard', label: 'ראשי', icon: 'dashboard' },
  { href: '/dashboard/pages', label: 'עמודים', icon: 'description' },
  { href: '/dashboard/posts', label: 'פוסטים', icon: 'article' },
  { href: '/dashboard/cpt', label: 'תוכן מותאם', icon: 'extension' },
  { href: '/dashboard/menu', label: 'תפריט', icon: 'menu' },
  { href: '/dashboard/popups', label: 'פופאפים', icon: 'web_asset' },
  { href: '/dashboard/leads', label: 'לידים', icon: 'contact_mail' },
  { href: '/dashboard/media', label: 'מדיה', icon: 'image' },
  { href: '/dashboard/settings', label: 'הגדרות', icon: 'settings' },
  { href: '/dashboard/domains', label: 'דומיינים', icon: 'language' },
  { href: '/dashboard/team', label: 'צוות', icon: 'group' },
  { href: '/dashboard/activity', label: 'לוג פעילות', icon: 'history' },
];

type Props = {
  tenantName: string;
  tenantSlug?: string;
  userName: string;
};

export default function Sidebar({ tenantName, tenantSlug, userName }: Props) {
  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2);

  const platformDomain = process.env.PLATFORM_DOMAIN ?? 'localhost:3000';
  const isLocal = platformDomain.includes('localhost') || platformDomain.includes('127.') || platformDomain.includes('lvh.me');
  const protocol = isLocal ? 'http' : 'https';
  const siteUrl = tenantSlug ? `${protocol}://${tenantSlug}.${platformDomain}` : null;

  const header = (
    <div className="px-5 pb-4 pt-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-navy">
            <span className="font-logo text-sm font-bold leading-none text-white">Q</span>
          </div>
          <span className="font-logo text-lg font-bold text-navy" style={{ letterSpacing: '-0.02em' }}>
            Quick<span className="text-ocean">Site</span>
          </span>
        </Link>
        {siteUrl && (
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-slate-400 transition-colors hover:bg-ocean/10 hover:text-ocean"
          >
            <span className="text-[11px] font-medium">צפייה באתר</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );

  const footer = (
    <div className="border-t border-slate-100/80 px-4 py-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/account" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean/20 to-ocean/5 text-xs font-bold text-ocean">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-navy group-hover:text-ocean transition-colors">{userName}</p>
            <p className="truncate text-[11px] text-slate-400">{tenantName}</p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <a href="/logout" className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-red-500">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarNav navItems={navItems} header={header} footer={footer} />
  );
}
