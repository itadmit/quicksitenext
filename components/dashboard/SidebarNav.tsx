'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

type NavItem = { href: string; label: string; icon: string };

type Props = {
  navItems: NavItem[];
  header: React.ReactNode;
  footer: React.ReactNode;
};

export default function SidebarNav({ navItems, header, footer }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  function handleClick(href: string) {
    setOpen(false);
    const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);
    if (!isActive) setPendingHref(href);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:hidden"
        aria-label="תפריט"
      >
        <span className="material-symbols-outlined text-navy">{open ? 'close' : 'menu'}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed right-0 top-0 z-40 flex h-screen w-64 flex-col bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-out md:translate-x-0 ${
          open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {header}

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
              const pending = pendingHref === item.href;
              const highlighted = active || pending;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleClick(item.href)}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-[13px] transition-all duration-150 ${
                    highlighted
                      ? 'bg-navy font-semibold text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-navy'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      highlighted ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {pending && (
                    <span className="mr-auto h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
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
