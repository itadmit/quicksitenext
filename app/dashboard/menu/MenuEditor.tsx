'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { saveMenuAction, type MenuActionState } from './actions';
import { ChevronUp, ChevronDown, X, Plus, FileText, Link, ExternalLink } from 'lucide-react';

type MenuItem = { id?: string; label: string; href: string; sortOrder: number; target?: string };
type Menu = { id: string; location: string; items: MenuItem[] };
type PageOption = { title: string; slug: string; isHome: boolean };

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400';

function LinkPicker({ value, onChange, pages }: { value: string; onChange: (v: string) => void; pages: PageOption[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedPage = pages.find(p => value === `/${p.slug === 'home' ? '' : p.slug}` || (p.isHome && value === '/'));
  const isCustom = !selectedPage && value !== '';

  return (
    <div className="relative" ref={ref}>
      <div
        className={inputCls + ' flex cursor-pointer items-center gap-2'}
        onClick={() => setOpen(!open)}
      >
        {selectedPage ? (
          <>
            <FileText className="h-3.5 w-3.5 shrink-0 text-ocean" />
            <span className="flex-1 truncate text-navy">{selectedPage.title}</span>
            <span className="text-[10px] text-slate-300" dir="ltr">/{selectedPage.isHome ? '' : selectedPage.slug}</span>
          </>
        ) : value ? (
          <>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="flex-1 truncate font-mono text-navy" dir="ltr">{value}</span>
          </>
        ) : (
          <span className="text-slate-300">בחרו עמוד או הזינו קישור</span>
        )}
        <ChevronDown className={`h-3.5 w-3.5 text-slate-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* Pages list */}
          <div className="border-b border-slate-100 px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">עמודי האתר</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {pages.map(p => {
              const href = p.isHome ? '/' : `/${p.slug}`;
              const isActive = value === href;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => { onChange(href); setOpen(false); }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-right text-sm transition-colors ${
                    isActive ? 'bg-ocean/5 text-ocean' : 'text-navy hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  <span className="flex-1">{p.title}</span>
                  <span className="font-mono text-[10px] text-slate-300" dir="ltr">{href}</span>
                </button>
              );
            })}
          </div>

          {/* Custom URL input */}
          <div className="border-t border-slate-100 px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">קישור מותאם</span>
          </div>
          <div className="px-3 pb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={isCustom ? value : ''}
                onChange={e => onChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setOpen(false); } }}
                placeholder="https://... או /path"
                dir="ltr"
                className="flex-1 rounded-lg border-0 bg-slate-50 px-3 py-2 font-mono text-xs text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy/85 cursor-pointer"
              >
                אישור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuSection({ location, title, initialItems, pages }: {
  location: string;
  title: string;
  initialItems: MenuItem[];
  pages: PageOption[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [state, formAction, pending] = useActionState<MenuActionState, FormData>(saveMenuAction, undefined);

  function addItem() {
    setItems([...items, { label: '', href: '', sortOrder: items.length, target: '_self' }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof MenuItem, value: string | number) {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function onHrefChange(index: number, href: string) {
    const page = pages.find(p => (p.isHome ? '/' : `/${p.slug}`) === href);
    if (page && !items[index].label) {
      setItems(items.map((item, i) => i === index ? { ...item, href, label: page.title } : item));
    } else {
      updateItem(index, 'href', href);
    }
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const arr = [...items];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setItems(arr.map((it, i) => ({ ...it, sortOrder: i })));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-[14px] font-semibold text-navy">{title}</h2>
        <p className="mt-0.5 text-xs text-slate-400">{items.length} פריטים</p>
      </div>
      <div className="px-5 py-4">
        {state?.error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
        {state?.success && <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">נשמר בהצלחה</p>}

        {items.length > 0 && (
          <div className="mb-2 hidden grid-cols-[auto_1fr_1fr_120px_40px] items-end gap-3 px-1 sm:grid">
            <div className="w-6" />
            <span className={labelCls}>תווית</span>
            <span className={labelCls}>קישור</span>
            <span className={labelCls}>פתיחה</span>
            <div />
          </div>
        )}

        <div className="mb-5 space-y-3">
          {items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 items-center gap-3 rounded-xl bg-slate-50/50 p-3 ring-1 ring-slate-100 sm:grid-cols-[auto_1fr_1fr_120px_40px] sm:bg-transparent sm:p-0 sm:ring-0">
              <div className="hidden flex-col gap-0.5 sm:flex">
                <button type="button" onClick={() => moveItem(i, i - 1)} disabled={i === 0} className="cursor-pointer rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy disabled:opacity-20">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => moveItem(i, i + 1)} disabled={i === items.length - 1} className="cursor-pointer rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy disabled:opacity-20">
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-400 sm:hidden">תווית</span>
                <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} placeholder="שם הקישור" className={inputCls} />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-400 sm:hidden">קישור</span>
                <LinkPicker value={item.href} onChange={(v) => onHrefChange(i, v)} pages={pages} />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-400 sm:hidden">פתיחה</span>
                <select value={item.target || '_self'} onChange={e => updateItem(i, 'target', e.target.value)} className={inputCls + ' cursor-pointer'}>
                  <option value="_self">רגיל</option>
                  <option value="_blank">חלון חדש</option>
                </select>
              </div>

              <button type="button" onClick={() => removeItem(i)} className="flex h-10 w-10 cursor-pointer items-center justify-center self-end rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem} className="mb-5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:border-ocean hover:text-ocean">
          <Plus className="h-4 w-4" />
          הוסף פריט
        </button>

        <form action={formAction}>
          <input type="hidden" name="location" value={location} />
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <button type="submit" disabled={pending} className="cursor-pointer rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy/85 disabled:opacity-50">{pending ? 'שומר...' : 'שמור תפריט'}</button>
        </form>
      </div>
    </div>
  );
}

export default function MenuEditor({ menus, pages }: { menus: Menu[]; pages: PageOption[] }) {
  const headerMenu = menus.find(m => m.location === 'header');
  const footerMenu = menus.find(m => m.location === 'footer');
  const sidebarMenu = menus.find(m => m.location === 'sidebar');

  return (
    <div className="space-y-5">
      <MenuSection location="header" title="תפריט עליון (Header)" initialItems={headerMenu?.items ?? []} pages={pages} />
      <MenuSection location="footer" title="תפריט תחתון (Footer)" initialItems={footerMenu?.items ?? []} pages={pages} />
      <MenuSection location="sidebar" title="תפריט צדדי (Sidebar)" initialItems={sidebarMenu?.items ?? []} pages={pages} />
    </div>
  );
}
