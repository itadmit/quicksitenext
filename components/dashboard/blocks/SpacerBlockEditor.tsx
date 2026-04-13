'use client';

import { Minus } from 'lucide-react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function SpacerBlockEditor({ data, onChange }: Props) {
  const height = (data.height as number) ?? 64;

  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5">
        <Minus className="h-3 w-3 text-slate-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">מרווח</span>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">גובה</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={8}
                max={400}
                value={height}
                onChange={(e) => onChange({ ...data, height: parseInt(e.target.value) || 64 })}
                className="flex-1 accent-ocean cursor-pointer"
              />
              <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={height}
                  onChange={(e) => onChange({ ...data, height: parseInt(e.target.value) || 0 })}
                  className="w-14 bg-transparent px-2 py-1.5 text-center text-sm text-navy outline-none"
                />
                <span className="border-r border-slate-200 px-1.5 text-[10px] text-slate-400">px</span>
              </div>
            </div>
          </div>
        </div>
        {/* Visual preview */}
        <div
          className="mt-3 rounded-lg border border-dashed border-slate-200 bg-white/50 transition-all"
          style={{ height: Math.min(height, 100) }}
        >
          <div className="flex h-full items-center justify-center text-[10px] text-slate-300">{height}px</div>
        </div>
      </div>
    </div>
  );
}
