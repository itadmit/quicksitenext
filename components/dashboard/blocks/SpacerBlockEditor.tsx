'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function SpacerBlockEditor({ data, onChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">גובה (px)</label>
        <input
          type="number"
          min={0}
          max={500}
          value={(data.height as number) ?? 64}
          onChange={(e) => onChange({ ...data, height: parseInt(e.target.value) || 0 })}
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
        />
      </div>
      <div
        className="border border-dashed border-charcoal/20 bg-charcoal/[0.02] flex-1 flex items-center justify-center text-[10px] text-charcoal/30 uppercase tracking-widest"
        style={{ height: Math.min((data.height as number) ?? 64, 120) }}
      >
        {(data.height as number) ?? 64}px
      </div>
    </div>
  );
}
