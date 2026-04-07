'use client';

import { useState } from 'react';
import Link from 'next/link';

type MenuItem = {
  id: string;
  label: string;
  href: string;
  target: string;
  parentId: string | null;
  children?: MenuItem[];
};

type Props = {
  siteName: string;
  logoUrl: string | null;
  menuItems: MenuItem[];
};

export default function TenantHeader({ siteName, logoUrl, menuItems }: Props) {
  const [open, setOpen] = useState(false);
  const topLevel = menuItems.filter((i) => !i.parentId);

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/5 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-display text-xl font-bold tracking-wide" style={{ color: 'var(--tenant-primary)' }}>
              {siteName}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {topLevel.map((item) => {
            const children = menuItems.filter((c) => c.parentId === item.id);
            if (children.length > 0) {
              return (
                <div key={item.id} className="group relative">
                  <Link href={item.href} target={item.target} className="rounded-md px-3 py-2 text-sm font-medium text-charcoal/80 transition hover:bg-charcoal/5 hover:text-charcoal">
                    {item.label}
                  </Link>
                  <div className="invisible absolute end-0 top-full z-50 min-w-[180px] rounded-lg border border-charcoal/10 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    {children.map((child) => (
                      <Link key={child.id} href={child.href} target={child.target} className="block px-4 py-2 text-sm text-charcoal/80 transition hover:bg-charcoal/5 hover:text-charcoal">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.id} href={item.href} target={item.target} className="rounded-md px-3 py-2 text-sm font-medium text-charcoal/80 transition hover:bg-charcoal/5 hover:text-charcoal">
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        {topLevel.length > 0 && (
          <button onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center md:hidden" aria-label="תפריט">
            <span className="material-symbols-outlined text-charcoal">{open ? 'close' : 'menu'}</span>
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-charcoal/5 bg-white px-4 py-3 md:hidden">
          {topLevel.map((item) => (
            <Link key={item.id} href={item.href} target={item.target} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-medium text-charcoal/80">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
