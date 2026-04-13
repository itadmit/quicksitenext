'use client';

import { Type, MousePointer, Palette } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const variants = [
  { value: 'primary', label: 'ראשי (כהה)' },
  { value: 'secondary', label: 'משני (בהיר)' },
  { value: 'outline', label: 'מתאר' },
];

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function CtaBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <Type className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">תוכן</span>
        </div>
        <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div>
            <label className={label}>כותרת</label>
            <input value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>תיאור</label>
            <textarea
              value={(data.description as string) ?? ''}
              onChange={(e) => update('description', e.target.value)}
              rows={2}
              className={`${input} resize-none`}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <MousePointer className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">כפתור</span>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div>
            <label className={label}>טקסט</label>
            <input value={(data.buttonLabel as string) ?? ''} onChange={(e) => update('buttonLabel', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>קישור</label>
            <input value={(data.buttonHref as string) ?? ''} onChange={(e) => update('buttonHref', e.target.value)} dir="ltr" className={`${input} font-mono`} placeholder="#" />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <Palette className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">סגנון</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div className="flex gap-2">
            {variants.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => update('variant', v.value)}
                className={`flex-1 rounded-lg border px-2 py-2 text-[11px] font-medium transition-all cursor-pointer ${
                  (data.variant ?? 'primary') === v.value
                    ? 'border-ocean bg-ocean/[0.06] text-ocean'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
