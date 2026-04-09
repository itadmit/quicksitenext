'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function TextBlockEditor({ data, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">תוכן</label>
      <textarea
        value={(data.content as string) ?? ''}
        onChange={(e) => onChange({ ...data, content: e.target.value })}
        rows={6}
        className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors resize-y font-mono"
        placeholder="<p>הכניסו תוכן כאן...</p>"
      />
    </div>
  );
}
