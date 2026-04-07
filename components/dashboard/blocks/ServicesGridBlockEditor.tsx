'use client';

type Service = { icon: string; title: string; description: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function ServicesGridBlockEditor({ data, onChange }: Props) {
  const services = (data.services as Service[]) ?? [];

  const updateService = (index: number, field: keyof Service, value: string) => {
    const next = services.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    );
    onChange({ ...data, services: next });
  };

  const addService = () => {
    onChange({
      ...data,
      services: [...services, { icon: 'star', title: '', description: '' }],
    });
  };

  const removeService = (index: number) => {
    onChange({ ...data, services: services.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {services.map((service, i) => (
        <div key={i} className="space-y-3 border border-charcoal/10 bg-charcoal/[0.02] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">שירות {i + 1}</span>
            <button
              type="button"
              onClick={() => removeService(i)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              הסר
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">אייקון</label>
              <input
                value={service.icon}
                onChange={(e) => updateService(i, 'icon', e.target.value)}
                dir="ltr"
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
                placeholder="material icon name"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</label>
              <input
                value={service.title}
                onChange={(e) => updateService(i, 'title', e.target.value)}
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תיאור</label>
            <textarea
              value={service.description}
              onChange={(e) => updateService(i, 'description', e.target.value)}
              rows={2}
              className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addService}
        className="flex w-full items-center justify-center gap-1 border border-dashed border-charcoal/20 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal/50 hover:border-primary hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        הוסף שירות
      </button>
    </div>
  );
}
