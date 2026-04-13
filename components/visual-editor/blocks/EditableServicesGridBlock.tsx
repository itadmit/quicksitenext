'use client';

import { Zap } from 'lucide-react';
import EditableText from '../EditableText';

type Service = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

function CardsVariant({
  services,
  updateService,
}: {
  services: Service[];
  updateService: (i: number, f: keyof Service, v: string) => void;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tenant-primary) 10%, transparent)' }}
          >
            <Zap className="h-5 w-5" style={{ color: 'var(--tenant-primary)' }} />
          </div>
          <EditableText
            value={service.title}
            onChange={(v) => updateService(i, 'title', v)}
            tag="h3"
            className="mt-3 font-noto text-base font-bold text-navy"
            placeholder="שם השירות"
          />
          <EditableText
            value={service.description}
            onChange={(v) => updateService(i, 'description', v)}
            tag="p"
            className="mt-2 text-sm leading-relaxed text-navy/60"
            placeholder="תיאור השירות"
          />
        </div>
      ))}
    </div>
  );
}

function MinimalVariant({
  services,
  updateService,
}: {
  services: Service[];
  updateService: (i: number, f: keyof Service, v: string) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-100">
      {services.map((service, i) => (
        <div key={i} className="flex gap-5 py-6">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tenant-primary) 10%, transparent)' }}
          >
            <Zap className="h-5 w-5" style={{ color: 'var(--tenant-primary)' }} />
          </div>
          <div>
            <EditableText
              value={service.title}
              onChange={(v) => updateService(i, 'title', v)}
              tag="h3"
              className="font-noto text-base font-bold text-navy"
              placeholder="שם השירות"
            />
            <EditableText
              value={service.description}
              onChange={(v) => updateService(i, 'description', v)}
              tag="p"
              className="mt-1 text-sm leading-relaxed text-navy/60"
              placeholder="תיאור השירות"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EditableServicesGridBlock({ data, onChange }: Props) {
  const services = (data.services as Service[]) ?? [];
  const variant = (data.variant as string) || 'cards';

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = services.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange({ ...data, services: newServices });
  };

  if (!services.length) {
    return (
      <section className="px-6 py-20 text-center text-sm text-slate-400">
        הוסיפו שירותים דרך פנל המאפיינים
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      {variant === 'minimal' ? (
        <MinimalVariant services={services} updateService={updateService} />
      ) : (
        <CardsVariant services={services} updateService={updateService} />
      )}
    </section>
  );
}
