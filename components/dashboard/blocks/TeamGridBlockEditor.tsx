'use client';

type Member = { name: string; role: string; image: string; link: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

export default function TeamGridBlockEditor({ data, onChange }: Props) {
  const members = (data.members as Member[]) ?? [];

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const next = members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m,
    );
    onChange({ ...data, members: next });
  };

  const addMember = () => {
    onChange({
      ...data,
      members: [...members, { name: '', role: '', image: '', link: '' }],
    });
  };

  const removeMember = (index: number) => {
    onChange({ ...data, members: members.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {members.map((member, i) => (
        <div key={i} className="space-y-3 border border-charcoal/10 bg-charcoal/[0.02] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">חבר/ת צוות {i + 1}</span>
            <button
              type="button"
              onClick={() => removeMember(i)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              הסר
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">שם</label>
              <input
                value={member.name}
                onChange={(e) => updateMember(i, 'name', e.target.value)}
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תפקיד</label>
              <input
                value={member.role}
                onChange={(e) => updateMember(i, 'role', e.target.value)}
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm text-charcoal outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תמונה (URL)</label>
              <input
                value={member.image}
                onChange={(e) => updateMember(i, 'image', e.target.value)}
                dir="ltr"
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm font-mono text-charcoal outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-charcoal/60">קישור</label>
              <input
                value={member.link}
                onChange={(e) => updateMember(i, 'link', e.target.value)}
                dir="ltr"
                className="w-full border border-charcoal/10 bg-background-light px-3 py-2 text-sm font-mono text-charcoal outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addMember}
        className="flex w-full items-center justify-center gap-1 border border-dashed border-charcoal/20 py-2.5 text-xs font-bold uppercase tracking-widest text-charcoal/50 hover:border-primary hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        הוסף חבר/ת צוות
      </button>
    </div>
  );
}
