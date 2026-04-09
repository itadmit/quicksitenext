'use client';

type Item = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function AboutBlockEditor({ data, onChange }: Props) {
  const items = (data.items as Item[]) ?? [];

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...data, items: next });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...items, { icon: 'star', title: '', description: '' }],
    });
  };

  const removeItem = (index: number) => {
    onChange({ ...data, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">פריט {i + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              הסר
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-navy/60">אייקון</label>
              <input
                value={item.icon}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
                placeholder="material icon name"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כותרת</label>
              <input
                value={item.title}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-navy/60">תיאור</label>
            <textarea
              value={item.description}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors resize-none"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1 rounded-full border border-dashed border-slate-200 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:border-ocean hover:text-ocean transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        הוסף פריט
      </button>
    </div>
  );
}
