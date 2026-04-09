'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function HeroBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כותרת</label>
          <input
            value={(data.title as string) ?? ''}
            onChange={(e) => update('title', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">תת כותרת</label>
          <input
            value={(data.subtitle as string) ?? ''}
            onChange={(e) => update('subtitle', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">תמונת רקע (URL)</label>
          <input
            value={(data.backgroundImage as string) ?? ''}
            onChange={(e) => update('backgroundImage', e.target.value)}
            dir="ltr"
            className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm font-mono text-navy outline-none focus:border-ocean transition-colors"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כפתור ראשי - טקסט</label>
          <input
            value={(data.primaryBtnLabel as string) ?? ''}
            onChange={(e) => update('primaryBtnLabel', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כפתור ראשי - קישור</label>
          <input
            value={(data.primaryBtnHref as string) ?? ''}
            onChange={(e) => update('primaryBtnHref', e.target.value)}
            dir="ltr"
            className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm font-mono text-navy outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כפתור משני - טקסט</label>
          <input
            value={(data.secondaryBtnLabel as string) ?? ''}
            onChange={(e) => update('secondaryBtnLabel', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כפתור משני - קישור</label>
          <input
            value={(data.secondaryBtnHref as string) ?? ''}
            onChange={(e) => update('secondaryBtnHref', e.target.value)}
            dir="ltr"
            className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm font-mono text-navy outline-none focus:border-ocean transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
