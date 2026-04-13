'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavItem = { href: string; label: string; icon: string };

type Props = {
  navItems: NavItem[];
  header: React.ReactNode;
  footer: React.ReactNode;
};

export default function SidebarNav({ navItems, header, footer }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60 md:hidden"
        aria-label="תפריט"
      >
        <span className="material-symbols-outlined text-[20px] text-slate-600">
          {open ? 'close' : 'menu'}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-40 flex h-screen w-64 flex-col bg-white transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {header}

        <nav className="flex-1 overflow-y-auto px-3 pb-2">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] transition-colors duration-150 ${
                    active
                      ? 'bg-slate-100 font-semibold text-navy'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] transition-colors duration-150 ${
                      active ? 'text-navy' : 'text-slate-400 group-hover:text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {footer}
      </aside>
    </>
  );
}
