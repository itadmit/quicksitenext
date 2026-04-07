'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function PostsGridBlockEditor({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">מספר פוסטים</label>
        <input
          type="number"
          min={1}
          max={50}
          value={(data.count as number) ?? 6}
          onChange={(e) => onChange({ ...data, count: parseInt(e.target.value) || 6 })}
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">עמודות</label>
        <select
          value={(data.columns as number) ?? 3}
          onChange={(e) => onChange({ ...data, columns: parseInt(e.target.value) })}
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </div>
    </div>
  );
}
