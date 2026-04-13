'use client';

import { MessageSquareQuote, User } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function QuoteBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <MessageSquareQuote className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">ציטוט</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <textarea
            value={(data.text as string) ?? ''}
            onChange={(e) => update('text', e.target.value)}
            rows={4}
            className={`${input} resize-none`}
            placeholder="הכניסו ציטוט..."
          />
        </div>
      </div>

      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <User className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">מחבר</span>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div>
            <label className={label}>שם</label>
            <input value={(data.author as string) ?? ''} onChange={(e) => update('author', e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>תפקיד</label>
            <input value={(data.role as string) ?? ''} onChange={(e) => update('role', e.target.value)} className={input} />
          </div>
        </div>
      </div>
    </div>
  );
}
