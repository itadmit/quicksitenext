'use client';

import { Plus, X, Star, Type } from 'lucide-react';

type Item = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function AboutBlockEditor({ data, onChange }: Props) {
  const items = (data.items as Item[]) ?? [];

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ ...data, items: next });
  };

  const addItem = () => {
    onChange({ ...data, items: [...items, { icon: 'star', title: '', description: '' }] });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">פריט {i + 1}</span>
            </div>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={label}>אייקון</label>
                <input value={item.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} dir="ltr" className={input} placeholder="star" />
              </div>
              <div>
                <label className={label}>כותרת</label>
                <input value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} className={input} />
              </div>
            </div>
            <div>
              <label className={label}>תיאור</label>
              <textarea value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} rows={2} className={`${input} resize-none`} />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-2.5 text-[11px] font-semibold text-slate-400 hover:border-ocean hover:text-ocean transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        הוסף פריט
      </button>
    </div>
  );
}
