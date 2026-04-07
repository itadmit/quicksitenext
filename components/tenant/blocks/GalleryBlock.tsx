type GalleryImage = {
  src: string;
  alt?: string;
};

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function GalleryBlock({ data }: Props) {
  const images = (data.images as GalleryImage[]) || [];

  if (!images.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <div key={i} className="group aspect-square overflow-hidden rounded-lg bg-charcoal/5">
            <img
              src={img.src}
              alt={img.alt || ''}
              className="h-full w-full object-cover transition group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
