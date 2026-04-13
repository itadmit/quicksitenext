'use client';

import type { LucideIcon } from 'lucide-react';

export type VariantOption = {
  id: string;
  label: string;
  Icon: LucideIcon;
};

type Props = {
  options: VariantOption[];
  value: string;
  onChange: (id: string) => void;
};

export default function VariantPicker({ options, value, onChange }: Props) {
  return (
    <div className="mb-4">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-navy/60">סגנון תצוגה</span>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 4)}, 1fr)` }}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 transition-all ${
                active
                  ? 'border-ocean bg-ocean/[0.06] text-ocean'
                  : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
              }`}
            >
              <opt.Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold leading-none">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
