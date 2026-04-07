'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const variants = [
  { value: 'primary', label: 'ראשי' },
  { value: 'secondary', label: 'משני' },
  { value: 'outline', label: 'מתאר' },
];

export default function CtaBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</label>
        <input
          value={(data.title as string) ?? ''}
          onChange={(e) => update('title', e.target.value)}
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תיאור</label>
        <textarea
          value={(data.description as string) ?? ''}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">טקסט כפתור</label>
          <input
            value={(data.buttonLabel as string) ?? ''}
            onChange={(e) => update('buttonLabel', e.target.value)}
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">קישור כפתור</label>
          <input
            value={(data.buttonHref as string) ?? ''}
            onChange={(e) => update('buttonHref', e.target.value)}
            dir="ltr"
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm font-mono text-charcoal outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סגנון</label>
        <select
          value={(data.variant as string) ?? 'primary'}
          onChange={(e) => update('variant', e.target.value)}
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
        >
          {variants.map((v) => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
