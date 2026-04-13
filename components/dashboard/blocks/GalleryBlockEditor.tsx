'use client';

import { Plus, X, Grid3X3, Camera } from 'lucide-react';
import { useEditorSafe } from '@/components/visual-editor/EditorContext';

type GalleryImage = { src: string; alt?: string; caption?: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function GalleryBlockEditor({ data, onChange }: Props) {
  const editor = useEditorSafe();
  const canPick = !!editor?.openImagePicker;
  const images = (data.images as GalleryImage[]) ?? [];

  const handleAddImage = () => {
    if (canPick) {
      editor!.openImagePicker((url) => {
        onChange({ ...data, images: [...images, { src: url, alt: '' }] });
      });
    } else {
      onChange({ ...data, images: [...images, { src: '', alt: '' }] });
    }
  };

  const handleReplaceImage = (index: number) => {
    if (canPick) {
      editor!.openImagePicker((url) => {
        const next = images.map((img, i) => (i === index ? { ...img, src: url } : img));
        onChange({ ...data, images: next });
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange({ ...data, images: images.filter((_, i) => i !== index) });
  };

  const handleUpdateAlt = (index: number, alt: string) => {
    const next = images.map((img, i) => (i === index ? { ...img, alt } : img));
    onChange({ ...data, images: next });
  };

  return (
    <div>
      <div className="mb-2.5 flex items-center gap-1.5">
        <Grid3X3 className="h-3 w-3 text-slate-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">תמונות</span>
        {images.length > 0 && (
          <span className="rounded-full bg-ocean/10 px-1.5 py-px text-[9px] font-semibold text-ocean">{images.length}</span>
        )}
      </div>

      <div className="space-y-2">
        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5">
            {images.map((img, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {img.src ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt || ''} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                      {canPick && (
                        <button
                          type="button"
                          onClick={() => handleReplaceImage(i)}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow cursor-pointer"
                        >
                          <Camera className="h-3 w-3 text-navy" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow cursor-pointer"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReplaceImage(i)}
                    className="flex h-full w-full items-center justify-center text-slate-300 hover:text-ocean cursor-pointer"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/50 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] text-white">#{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expanded image details */}
        {images.length > 0 && (
          <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 text-[10px]">
                <span className="flex-shrink-0 font-bold text-slate-400">#{i + 1}</span>
                <input
                  value={img.alt || ''}
                  onChange={(e) => handleUpdateAlt(i, e.target.value)}
                  placeholder="טקסט חלופי (alt)"
                  className="min-w-0 flex-1 bg-transparent text-navy outline-none placeholder:text-slate-300"
                />
              </div>
            ))}
          </div>
        )}

        {/* Add button */}
        <button
          type="button"
          onClick={handleAddImage}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-2.5 text-[11px] font-semibold text-slate-400 hover:border-ocean hover:text-ocean transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          הוסף תמונה
        </button>
      </div>
    </div>
  );
}
