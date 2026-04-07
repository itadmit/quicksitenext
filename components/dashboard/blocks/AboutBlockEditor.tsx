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
        <div key={i} className="space-y-3 border border-charcoal/10 bg-charcoal/[0.02] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">פריט {i + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              הסר
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">אייקון</label>
              <input
                value={item.icon}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
                dir="ltr"
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
                placeholder="material icon name"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</label>
              <input
                value={item.title}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תיאור</label>
            <textarea
              value={item.description}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
              rows={2}
              className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center gap-1 border border-dashed border-charcoal/20 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal/50 hover:border-primary hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        הוסף פריט
      </button>
    </div>
  );
}
