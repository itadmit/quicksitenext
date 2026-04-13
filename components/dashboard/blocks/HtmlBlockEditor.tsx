'use client';

import { Code } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function HtmlBlockEditor({ data, onChange }: Props) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5">
        <Code className="h-3 w-3 text-slate-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">קוד HTML</span>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
        <textarea
          value={(data.code as string) ?? ''}
          onChange={(e) => onChange({ ...data, code: e.target.value })}
          rows={10}
          dir="ltr"
          className="w-full rounded-lg border border-slate-200 bg-navy/[0.03] px-3 py-2 text-[11px] font-mono text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors resize-y"
          placeholder="<div>...</div>"
        />
      </div>
    </div>
  );
}
