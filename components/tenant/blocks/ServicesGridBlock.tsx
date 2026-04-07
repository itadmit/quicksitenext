type Service = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function ServicesGridBlock({ data }: Props) {
  const services = (data.services as Service[]) ?? [];
  if (!services.length) return null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <div
            key={i}
            className="group border border-charcoal/5 bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <span
              className="material-symbols-outlined text-[32px]"
              style={{ color: 'var(--tenant-primary)' }}
            >
              {service.icon}
            </span>
            <h3 className="mt-3 font-noto text-base font-bold text-charcoal">
              {service.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
