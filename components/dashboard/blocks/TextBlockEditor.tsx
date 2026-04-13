'use client';

import { FileText } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function TextBlockEditor({ data, onChange }: Props) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5">
        <FileText className="h-3 w-3 text-slate-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">תוכן</span>
      </div>
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
        <p className="mb-2 text-[10px] text-slate-400">ניתן להשתמש ב-HTML לעיצוב הטקסט</p>
        <textarea
          value={(data.content as string) ?? ''}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          rows={8}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors resize-y font-mono"
          placeholder="<p>הכניסו תוכן כאן...</p>"
        />
      </div>
    </div>
  );
}
