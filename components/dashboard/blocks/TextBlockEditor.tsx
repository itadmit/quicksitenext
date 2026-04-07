'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function TextBlockEditor({ data, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תוכן</label>
      <textarea
        value={(data.content as string) ?? ''}
        onChange={(e) => onChange({ ...data, content: e.target.value })}
        rows={6}
        className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors resize-y font-mono"
        placeholder="<p>הכניסו תוכן כאן...</p>"
      />
    </div>
  );
}
