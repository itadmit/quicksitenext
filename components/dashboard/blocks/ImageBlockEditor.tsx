'use client';

import { Tag } from 'lucide-react';
import ImagePickerField from './ImagePickerField';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function ImageBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <ImagePickerField
        value={(data.src as string) ?? ''}
        onChange={(url) => update('src', url)}
        label="תמונה"
        previewHeight="h-32"
      />

      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <Tag className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">מטא-דאטה</span>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
          <div>
            <label className={label}>טקסט חלופי (Alt)</label>
            <input value={(data.alt as string) ?? ''} onChange={(e) => update('alt', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>כיתוב</label>
            <input value={(data.caption as string) ?? ''} onChange={(e) => update('caption', e.target.value)} className={input} />
          </div>
        </div>
      </div>
    </div>
  );
}
