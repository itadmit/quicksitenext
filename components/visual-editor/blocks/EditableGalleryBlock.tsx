'use client';

import { Camera, Plus, X } from 'lucide-react';
import { useEditor } from '../EditorContext';

type GalleryImage = { src: string; alt?: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function EditableGalleryBlock({ data, onChange }: Props) {
  const { openImagePicker } = useEditor();
  const images = (data.images as GalleryImage[]) || [];

  const handleAddImage = () => {
    openImagePicker((url) => {
      onChange({ ...data, images: [...images, { src: url, alt: '' }] });
    });
  };

  const handleReplaceImage = (index: number) => {
    openImagePicker((url) => {
      const newImages = images.map((img, i) =>
        i === index ? { ...img, src: url } : img
      );
      onChange({ ...data, images: newImages });
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange({ ...data, images: newImages });
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-charcoal/5">
            <img
              src={img.src}
              alt={img.alt || ''}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
              <button
                onClick={() => handleReplaceImage(i)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow-md hover:bg-white transition-colors cursor-pointer"
                data-no-select
                title="החלף תמונה"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleRemoveImage(i)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md hover:bg-white transition-colors cursor-pointer"
                data-no-select
                title="הסר תמונה"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add image button */}
        <button
          onClick={handleAddImage}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 hover:border-ocean/40 hover:text-ocean transition-colors cursor-pointer"
          data-no-select
        >
          <Plus className="h-6 w-6" />
          <span className="text-xs font-medium">הוסף תמונה</span>
        </button>
      </div>
    </section>
  );
}
