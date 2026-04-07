'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'ראשי', icon: 'dashboard' },
  { href: '/dashboard/pages', label: 'עמודים', icon: 'description' },
  { href: '/dashboard/posts', label: 'פוסטים', icon: 'article' },
  { href: '/dashboard/cpt', label: 'תוכן מותאם', icon: 'extension' },
  { href: '/dashboard/menu', label: 'תפריט', icon: 'menu' },
  { href: '/dashboard/popups', label: 'פופאפים', icon: 'web_asset' },
  { href: '/dashboard/leads', label: 'לידים', icon: 'contact_mail' },
  { href: '/dashboard/media', label: 'מדיה', icon: 'image' },
  { href: '/dashboard/settings', label: 'הגדרות אתר', icon: 'settings' },
  { href: '/dashboard/domains', label: 'דומיינים', icon: 'language' },
];

type Props = {
  tenantName: string;
  tenantSlug: string;
  userName: string;
};

export default function Sidebar({ tenantName, tenantSlug, userName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <>
      <div className="border-b border-charcoal/10 px-5 py-4">
        <Link href="/dashboard" className="font-display text-xl font-bold text-primary">
          CMS
        </Link>
        <p className="mt-1 truncate text-xs font-medium text-charcoal/70">{tenantName}</p>
        <p className="truncate text-[10px] text-charcoal/40 font-mono" dir="ltr">{tenantSlug}.platform.com</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active ? 'bg-primary/10 text-primary font-bold' : 'text-charcoal/70 hover:bg-charcoal/5'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-charcoal/10 px-5 py-3">
        <p className="truncate text-sm font-medium text-charcoal">{userName}</p>
        <div className="mt-1 flex gap-3 text-xs">
          <Link href="/dashboard/account" className="text-charcoal/50 hover:text-primary">חשבון</Link>
          <a href="/logout" className="text-charcoal/50 hover:text-red-500">יציאה</a>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-charcoal/10 bg-white shadow-sm md:hidden"
        aria-label="תפריט"
      >
        <span className="material-symbols-outlined text-charcoal">{open ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed right-0 top-0 z-40 flex h-screen w-64 flex-col border-l border-charcoal/10 bg-white transition-transform md:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        {sidebar}
      </aside>
    </>
  );
}
