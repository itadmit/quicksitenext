'use client';

import { useActionState, useState } from 'react';
import { saveMenuAction, type MenuActionState } from './actions';

type MenuItem = { id?: string; label: string; href: string; sortOrder: number };
type Menu = { id: string; location: string; items: MenuItem[] };

function MenuSection({
  location,
  title,
  initialItems,
}: {
  location: string;
  title: string;
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [state, formAction, pending] = useActionState<MenuActionState, FormData>(saveMenuAction, undefined);

  function addItem() {
    setItems([...items, { label: '', href: '', sortOrder: items.length }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof MenuItem, value: string | number) {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  return (
    <div className="border border-charcoal/10 bg-white p-6">
      <h2 className="font-noto text-lg font-bold text-charcoal mb-4">{title}</h2>

      {state?.error && <p className="text-sm text-red-600 bg-red-50 p-3 border border-red-200 mb-4">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600 bg-green-50 p-3 border border-green-200 mb-4">נשמר בהצלחה</p>}

      <div className="space-y-3 mb-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              value={item.label}
              onChange={(e) => updateItem(i, 'label', e.target.value)}
              placeholder="תווית"
              className="flex-1 border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal focus:border-primary focus:outline-none"
            />
            <input
              value={item.href}
              onChange={(e) => updateItem(i, 'href', e.target.value)}
              placeholder="קישור"
              dir="ltr"
              className="flex-1 border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal focus:border-primary focus:outline-none font-mono"
            />
            <input
              type="number"
              value={item.sortOrder}
              onChange={(e) => updateItem(i, 'sortOrder', parseInt(e.target.value) || 0)}
              className="w-20 border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal focus:border-primary focus:outline-none text-center"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="border border-dashed border-charcoal/20 px-4 py-2 text-xs font-bold text-charcoal/50 hover:border-primary hover:text-primary w-full mb-4"
      >
        + הוסף פריט
      </button>

      <form action={formAction}>
        <input type="hidden" name="location" value={location} />
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <button
          type="submit"
          disabled={pending}
          className="bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'שומר...' : 'שמור תפריט'}
        </button>
      </form>
    </div>
  );
}

export default function MenuEditor({ menus }: { menus: Menu[] }) {
  const headerMenu = menus.find((m) => m.location === 'header');
  const footerMenu = menus.find((m) => m.location === 'footer');

  return (
    <div className="space-y-6 max-w-3xl">
      <MenuSection location="header" title="תפריט עליון (Header)" initialItems={headerMenu?.items ?? []} />
      <MenuSection location="footer" title="תפריט תחתון (Footer)" initialItems={footerMenu?.items ?? []} />
    </div>
  );
}
