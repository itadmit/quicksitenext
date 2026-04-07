type Item = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function AboutBlock({ data }: Props) {
  const items = (data.items as Item[]) ?? [];
  if (!items.length) return null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="group border border-charcoal/5 bg-white p-8 text-center transition-shadow hover:shadow-lg"
          >
            <span
              className="material-symbols-outlined text-[40px]"
              style={{ color: 'var(--tenant-primary)' }}
            >
              {item.icon}
            </span>
            <h3 className="mt-4 font-noto text-lg font-bold text-charcoal">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
