type Item = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default function AboutBlock({ data }: Props) {
  const items = (data.items as Item[]) ?? [];
  const variant = (data.variant as string) ?? 'grid';
  if (!items.length) return null;

  if (variant === 'horizontal') {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-10">
          {items.map((item, i) => (
            <div key={i} className="flex w-56 flex-col items-center text-center">
              <span
                className="material-symbols-outlined text-[52px]"
                style={{ color: 'var(--tenant-primary)' }}
              >
                {item.icon}
              </span>
              <h3 className="mt-4 font-noto text-xl font-black text-navy">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === 'alternating') {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl divide-y divide-slate-200">
          {items.map((item, i) => {
            const even = i % 2 === 0;
            return (
              <div
                key={i}
                className={`flex items-center gap-10 py-10 ${even ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex shrink-0 items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[48px]"
                    style={{ color: 'var(--tenant-primary)' }}
                  >
                    {item.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-noto text-lg font-bold text-navy">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="group rounded-2xl border border-slate-200 bg-white p-8 text-center transition-shadow hover:shadow-lg"
          >
            <span
              className="material-symbols-outlined text-[40px]"
              style={{ color: 'var(--tenant-primary)' }}
            >
              {item.icon}
            </span>
            <h3 className="mt-4 font-noto text-lg font-bold text-navy">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-navy/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
