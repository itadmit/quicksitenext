'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function QuoteBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">ציטוט</label>
        <textarea
          value={(data.text as string) ?? ''}
          onChange={(e) => update('text', e.target.value)}
          rows={4}
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">שם המצטט</label>
          <input
            value={(data.author as string) ?? ''}
            onChange={(e) => update('author', e.target.value)}
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תפקיד</label>
          <input
            value={(data.role as string) ?? ''}
            onChange={(e) => update('role', e.target.value)}
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
