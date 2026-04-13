'use client';

import { FileText, LayoutGrid } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors cursor-pointer';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function PostsGridBlockEditor({ data, onChange }: Props) {
  const columns = (data.columns as number) ?? 3;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2.5 flex items-center gap-1.5">
          <FileText className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">הגדרות תצוגה</span>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
          <div>
            <label className={label}>מספר פוסטים</label>
            <input
              type="number"
              min={1}
              max={50}
              value={(data.count as number) ?? 6}
              onChange={(e) => onChange({ ...data, count: parseInt(e.target.value) || 6 })}
              className={input}
            />
          </div>
          <div>
            <label className={label}>
              <LayoutGrid className="mb-px ml-1 inline h-2.5 w-2.5" />
              עמודות
            </label>
            <div className="flex gap-2">
              {[2, 3, 4].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange({ ...data, columns: c })}
                  className={`flex-1 rounded-lg border py-2 text-center text-sm font-medium transition-all cursor-pointer ${
                    columns === c
                      ? 'border-ocean bg-ocean/[0.06] text-ocean'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
