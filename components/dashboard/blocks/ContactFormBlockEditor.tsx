'use client';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function ContactFormBlockEditor({ data, onChange }: Props) {
  const update = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">כותרת</label>
        <input
          value={(data.title as string) ?? ''}
          onChange={(e) => update('title', e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">טקסט כפתור</label>
        <input
          value={(data.buttonLabel as string) ?? ''}
          onChange={(e) => update('buttonLabel', e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-background-light px-3 py-2 text-sm text-navy outline-none focus:border-ocean transition-colors"
        />
      </div>
    </div>
  );
}
