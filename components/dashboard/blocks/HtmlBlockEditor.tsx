'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function HtmlBlockEditor({ data, onChange }: Props) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">קוד HTML</label>
      <textarea
        value={(data.code as string) ?? ''}
        onChange={(e) => onChange({ ...data, code: e.target.value })}
        rows={8}
        dir="ltr"
        className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm font-mono text-charcoal outline-none focus:border-primary transition-colors resize-y"
        placeholder="<div>...</div>"
      />
    </div>
  );
}
