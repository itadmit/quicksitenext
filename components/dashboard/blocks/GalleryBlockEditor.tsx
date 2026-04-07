'use client';

import { useState } from 'react';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function GalleryBlockEditor({ data, onChange }: Props) {
  const [jsonError, setJsonError] = useState('');

  const imagesJson = JSON.stringify(data.images ?? [], null, 2);
  const [raw, setRaw] = useState(imagesJson);

  const handleChange = (value: string) => {
    setRaw(value);
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        setJsonError('');
        onChange({ ...data, images: parsed });
      } else {
        setJsonError('הערך חייב להיות מערך');
      }
    } catch {
      setJsonError('JSON לא תקין');
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">
        תמונות (JSON)
      </label>
      <p className="mb-2 text-[11px] text-charcoal/40">
        מערך של אובייקטים עם שדות: src, alt, caption
      </p>
      <textarea
        value={raw}
        onChange={(e) => handleChange(e.target.value)}
        rows={8}
        dir="ltr"
        className={`w-full border bg-background-light px-3 py-2 text-sm font-mono text-charcoal outline-none transition-colors resize-y ${
          jsonError ? 'border-red-300 focus:border-red-400' : 'border-charcoal/10 focus:border-primary'
        }`}
        placeholder='[{"src": "https://...", "alt": "תיאור", "caption": "כיתוב"}]'
      />
      {jsonError && <p className="mt-1 text-xs text-red-600">{jsonError}</p>}
    </div>
  );
}
