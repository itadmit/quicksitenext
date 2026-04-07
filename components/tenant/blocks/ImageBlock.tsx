type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function ImageBlock({ data }: Props) {
  const src = (data.src as string) || '';
  const alt = (data.alt as string) || '';
  const caption = (data.caption as string) || '';

  if (!src) return null;

  return (
    <figure className="mx-auto max-w-4xl px-4 py-10">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg object-cover"
        loading="lazy"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-charcoal/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
