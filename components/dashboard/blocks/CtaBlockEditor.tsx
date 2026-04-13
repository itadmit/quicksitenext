'use client';

import { Type, MousePointer, Moon, Sun, Zap } from 'lucide-react';
import LinkPicker from './LinkPicker';
import VariantPicker from './VariantPicker';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const CTA_VARIANTS = [
  { id: 'dark', label: 'כהה', Icon: Moon },
  { id: 'light', label: 'בהיר', Icon: Sun },
  { id: 'banner', label: 'באנר', Icon: Zap },
];

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function CtaBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <VariantPicker
        options={CTA_VARIANTS}
        value={(data.variant as string) ?? 'dark'}
        onChange={(v) => onChange({ ...data, variant: v })}
      />

      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <Type className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">תוכן</span>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
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
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
          <div>
            <label className={label}>טקסט</label>
            <input value={(data.buttonLabel as string) ?? ''} onChange={(e) => update('buttonLabel', e.target.value)} className={input} />
          </div>
          <LinkPicker value={(data.buttonHref as string) ?? ''} onChange={(v) => update('buttonHref', v)} />
        </div>
      </div>
    </div>
  );
}
