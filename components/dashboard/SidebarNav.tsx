'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, FileText, BookOpen, Puzzle, Menu,
  Zap, Mail, ImageIcon, Globe, Users, History, X, LayoutTemplate, Paintbrush,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'ראשי', icon: LayoutDashboard },
  { href: '/dashboard/pages', label: 'עמודים', icon: FileText },
  { href: '/dashboard/templates', label: 'תבניות', icon: LayoutTemplate },
  { href: '/dashboard/posts', label: 'פוסטים', icon: BookOpen },
  { href: '/dashboard/cpt', label: 'תוכן מותאם', icon: Puzzle },
  { href: '/dashboard/menu', label: 'תפריט', icon: Menu },
  { href: '/dashboard/popups', label: 'פופאפים', icon: Zap },
  { href: '/dashboard/leads', label: 'לידים', icon: Mail },
  { href: '/dashboard/media', label: 'מדיה', icon: ImageIcon },
  { href: '/dashboard/domains', label: 'דומיינים', icon: Globe },
  { href: '/dashboard/team', label: 'צוות', icon: Users },
  { href: '/dashboard/activity', label: 'לוג פעילות', icon: History },
];

type Props = {
  header: React.ReactNode;
  footer: React.ReactNode;
  builderHref?: string | null;
};

export default function SidebarNav({ header, footer, builderHref }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60 md:hidden"
        aria-label="תפריט"
      >
        {open ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-40 flex h-screen w-64 flex-col border-l border-slate-100 bg-white transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {header}

        <nav className="flex-1 overflow-y-auto px-3 pb-2">
          <div className="space-y-0.5">
            {navItems.map((item, i) => {
              const active = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <div key={item.href}>
                  {/* Builder link before תבניות */}
                  {builderHref && item.href === '/dashboard/templates' && (
                    <Link
                      href={builderHref}
                      onClick={() => setOpen(false)}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-700"
                    >
                      <Paintbrush className="h-[18px] w-[18px] text-slate-400 transition-colors duration-150 group-hover:text-slate-500" />
                      <span className="flex-1">עורך האתר</span>
                    </Link>
                  )}
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                      active
                        ? 'bg-slate-100 font-semibold text-navy'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] transition-colors duration-150 ${
                        active ? 'text-navy' : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {footer}
      </aside>
    </>
  );
}
