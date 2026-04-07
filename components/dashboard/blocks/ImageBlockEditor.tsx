'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function ImageBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כתובת תמונה (URL)</label>
        <input
          value={(data.src as string) ?? ''}
          onChange={(e) => update('src', e.target.value)}
          dir="ltr"
          className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm font-mono text-charcoal outline-none focus:border-primary transition-colors"
          placeholder="https://..."
        />
      </div>
      {typeof data.src === 'string' && data.src && (
        <div className="border border-charcoal/5 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.src as string} alt={(data.alt as string) ?? ''} className="max-h-40 object-contain" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">טקסט חלופי (Alt)</label>
          <input
            value={(data.alt as string) ?? ''}
            onChange={(e) => update('alt', e.target.value)}
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כיתוב</label>
          <input
            value={(data.caption as string) ?? ''}
            onChange={(e) => update('caption', e.target.value)}
            className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
