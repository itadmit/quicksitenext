'use client';

import { useActionState, useState } from 'react';
import { saveMenuAction, type MenuActionState } from './actions';

type MenuItem = { id?: string; label: string; href: string; sortOrder: number; target?: string };
type Menu = { id: string; location: string; items: MenuItem[] };

const inputCls = 'w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-sm text-navy ring-1 ring-slate-200/60 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-colors';
const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400';

function MenuSection({ location, title, initialItems }: { location: string; title: string; initialItems: MenuItem[] }) {
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

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const arr = [...items];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setItems(arr.map((it, i) => ({ ...it, sortOrder: i })));
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-white">
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
                <button type="button" onClick={() => moveItem(i, i - 1)} disabled={i === 0} className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy disabled:opacity-20">
                  <span className="material-symbols-outlined text-[16px]">expand_less</span>
                </button>
                <button type="button" onClick={() => moveItem(i, i + 1)} disabled={i === items.length - 1} className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-navy disabled:opacity-20">
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-400 sm:hidden">תווית</span>
                <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} placeholder="שם הקישור" className={inputCls} />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-400 sm:hidden">קישור</span>
                <input value={item.href} onChange={e => updateItem(i, 'href', e.target.value)} placeholder="/page-slug" dir="ltr" className={inputCls + ' font-mono'} />
              </div>

              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-400 sm:hidden">פתיחה</span>
                <select value={item.target || '_self'} onChange={e => updateItem(i, 'target', e.target.value)} className={inputCls + ' cursor-pointer'}>
                  <option value="_self">רגיל</option>
                  <option value="_blank">חלון חדש</option>
                </select>
              </div>

              <button type="button" onClick={() => removeItem(i)} className="flex h-10 w-10 items-center justify-center self-end rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem} className="mb-5 w-full rounded-xl border border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:border-ocean hover:text-ocean">
          <span className="material-symbols-outlined ml-1 align-middle text-[16px]">add</span>
          הוסף פריט
        </button>

        <form action={formAction}>
          <input type="hidden" name="location" value={location} />
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <button type="submit" disabled={pending} className="rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-navy/85 disabled:opacity-50">{pending ? 'שומר...' : 'שמור תפריט'}</button>
        </form>
      </div>
    </div>
  );
}

export default function MenuEditor({ menus }: { menus: Menu[] }) {
  const headerMenu = menus.find(m => m.location === 'header');
  const footerMenu = menus.find(m => m.location === 'footer');
  const sidebarMenu = menus.find(m => m.location === 'sidebar');

  return (
    <div className="space-y-5">
      <MenuSection location="header" title="תפריט עליון (Header)" initialItems={headerMenu?.items ?? []} />
      <MenuSection location="footer" title="תפריט תחתון (Footer)" initialItems={footerMenu?.items ?? []} />
      <MenuSection location="sidebar" title="תפריט צדדי (Sidebar)" initialItems={sidebarMenu?.items ?? []} />
    </div>
  );
}
