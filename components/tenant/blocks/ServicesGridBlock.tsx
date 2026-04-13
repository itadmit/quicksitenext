type Service = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

function CardsVariant({ services }: { services: Service[] }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <span
            className="material-symbols-outlined text-[32px]"
            style={{ color: 'var(--tenant-primary)' }}
          >
            {service.icon}
          </span>
          <h3 className="mt-3 font-noto text-base font-bold text-navy">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-navy/60">
            {service.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function MinimalVariant({ services }: { services: Service[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-100">
      {services.map((service, i) => (
        <div key={i} className="flex gap-5 py-6">
          <span
            className="material-symbols-outlined mt-0.5 shrink-0 text-[28px]"
            style={{ color: 'var(--tenant-primary)' }}
          >
            {service.icon}
          </span>
          <div>
            <h3 className="font-noto text-base font-bold text-navy">
              {service.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-navy/60">
              {service.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ServicesGridBlock({ data }: Props) {
  const services = (data.services as Service[]) ?? [];
  const variant = (data.variant as string) || 'cards';
  if (!services.length) return null;

  return (
    <section className="px-6 py-20">
      {variant === 'minimal' ? (
        <MinimalVariant services={services} />
      ) : (
        <CardsVariant services={services} />
      )}
    </section>
  );
}
