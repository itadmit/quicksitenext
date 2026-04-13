import Link from 'next/link';
import { ExternalLink, LogOut, Paintbrush, Settings } from 'lucide-react';
import SidebarNav from './SidebarNav';
import NotificationBell from './NotificationBell';

type Props = {
  tenantName: string;
  tenantSlug?: string;
  userName: string;
  homePageId?: string;
};

export default function Sidebar({ tenantSlug, userName, homePageId }: Props) {
  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2);

  const platformDomain = process.env.PLATFORM_DOMAIN ?? 'localhost:3000';
  const isLocal = platformDomain.includes('localhost') || platformDomain.includes('127.') || platformDomain.includes('lvh.me');
  const protocol = isLocal ? 'http' : 'https';
  const siteUrl = tenantSlug ? `${protocol}://${tenantSlug}.${platformDomain}` : null;

  const builderHref = homePageId ? `/dashboard/pages/${homePageId}/visual` : null;

  const header = (
    <div className="px-4 pb-2 pt-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/account" className="group flex flex-1 cursor-pointer items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-slate-50">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-ocean-light text-xs font-bold text-white">
            {initials}
          </div>
          <span className="truncate text-[14px] font-semibold text-navy">{userName}</span>
        </Link>
        {siteUrl && (
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
            title="צפייה באתר"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
      <div className="mt-4 border-b border-slate-100" />
    </div>
  );

  const footer = (
    <div className="border-t border-slate-100 px-3 py-3">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/settings"
          className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-700"
        >
          <Settings className="h-[18px] w-[18px] text-slate-400" />
          <span>הגדרות</span>
        </Link>
        <div className="flex items-center gap-0.5">
          <NotificationBell />
          <a
            href="/logout"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
            aria-label="התנתקות"
            title="התנתקות"
          >
            <LogOut className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarNav header={header} footer={footer} builderHref={builderHref} />
  );
}
