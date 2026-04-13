'use client';

import { Mail, MousePointer, AlignCenter, Columns } from 'lucide-react';
import VariantPicker from './VariantPicker';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const VARIANTS = [
  { id: 'standalone', label: 'רגיל', Icon: AlignCenter },
  { id: 'split', label: 'מפוצל', Icon: Columns },
];

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function ContactFormBlockEditor({ data, onChange }: Props) {
  const variant = (data.variant as string) || 'standalone';
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <VariantPicker
        options={VARIANTS}
        value={variant}
        onChange={(id) => onChange({ ...data, variant: id })}
      />

      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <Mail className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">טופס יצירת קשר</span>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
          <div>
            <label className={label}>כותרת</label>
            <input value={(data.title as string) ?? ''} onChange={(e) => update('title', e.target.value)} className={input} placeholder="צור קשר" />
          </div>
          {variant === 'split' && (
            <div>
              <label className={label}>תיאור משנה</label>
              <textarea
                value={(data.subtitle as string) ?? ''}
                onChange={(e) => update('subtitle', e.target.value)}
                className={`${input} resize-none`}
                rows={2}
                placeholder="תיאור קצר או פרטי יצירת קשר..."
              />
            </div>
          )}
          <div>
            <label className={label}>
              <MousePointer className="mb-px ml-1 inline h-2.5 w-2.5" />
              טקסט כפתור
            </label>
            <input value={(data.buttonLabel as string) ?? ''} onChange={(e) => update('buttonLabel', e.target.value)} className={input} placeholder="שליחה" />
          </div>
        </div>
      </div>
    </div>
  );
}
