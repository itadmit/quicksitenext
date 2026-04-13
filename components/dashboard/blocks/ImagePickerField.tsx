'use client';

import { Camera, X, ImageIcon } from 'lucide-react';
import { useEditorSafe } from '@/components/visual-editor/EditorContext';

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewHeight?: string;
};

export default function ImagePickerField({ value, onChange, label = 'תמונה', previewHeight = 'h-24' }: Props) {
  const editor = useEditorSafe();
  const canPick = !!editor?.openImagePicker;

  const handlePick = () => {
    if (canPick) {
      editor!.openImagePicker((url) => onChange(url));
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  if (value) {
    return (
      <div>
        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">{label}</span>
        <div className="group relative overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={`w-full object-cover ${previewHeight}`} />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            {canPick && (
              <button
                type="button"
                onClick={handlePick}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5 text-navy" />
              </button>
            )}
            <button
              type="button"
              onClick={handleClear}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 cursor-pointer"
            >
              <X className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (canPick) {
    return (
      <div>
        <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">{label}</span>
        <button
          type="button"
          onClick={handlePick}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-white py-4 text-slate-400 transition-all hover:border-ocean hover:text-ocean cursor-pointer"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="text-[11px] font-medium">בחרו תמונה</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors"
        placeholder="https://..."
      />
    </div>
  );
}
