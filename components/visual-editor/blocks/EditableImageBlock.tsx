'use client';

import { Camera, ImageIcon } from 'lucide-react';
import EditableText from '../EditableText';
import { useEditor } from '../EditorContext';

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableImageBlock({ data, onChange }: Props) {
  const { openImagePicker } = useEditor();
  const src = (data.src as string) || '';
  const alt = (data.alt as string) || '';
  const caption = (data.caption as string) || '';

  const handleImageChange = () => {
    openImagePicker((url) => onChange({ ...data, src: url }));
  };

  return (
    <figure className="mx-auto max-w-4xl px-4 py-10">
      {src ? (
        <div className="group relative overflow-hidden rounded-lg">
          <img
            src={src}
            alt={alt}
            className="w-full object-cover"
            loading="lazy"
          />
          <button
            onClick={handleImageChange}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 text-white opacity-0 transition-all hover:bg-black/40 hover:opacity-100 cursor-pointer"
            data-no-select
          >
            <Camera className="mb-2 h-8 w-8" />
            <span className="text-sm font-medium">החלף תמונה</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleImageChange}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center hover:border-ocean/40 transition-colors cursor-pointer"
          data-no-select
        >
          <ImageIcon className="h-10 w-10 text-slate-300" />
          <div>
            <p className="text-sm font-medium text-slate-500">לחצו לבחירת תמונה</p>
            <p className="mt-0.5 text-xs text-slate-400">מספריית המדיה או העלאה חדשה</p>
          </div>
        </button>
      )}
      <EditableText
        value={caption}
        onChange={(v) => onChange({ ...data, caption: v })}
        tag="figcaption"
        className="mt-3 text-center text-sm text-charcoal/60"
        placeholder="הוסיפו כיתוב..."
      />
    </figure>
  );
}
