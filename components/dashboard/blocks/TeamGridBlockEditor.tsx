'use client';

import { Plus, X, User, Link as LinkIcon } from 'lucide-react';
import ImagePickerField from './ImagePickerField';

type Member = { name: string; role: string; image: string; link: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

const input = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-slate-300 outline-none focus:border-ocean focus:ring-1 focus:ring-ocean/30 transition-colors';
const label = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-navy/60';

export default function TeamGridBlockEditor({ data, onChange }: Props) {
  const members = (data.members as Member[]) ?? [];

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const next = members.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    onChange({ ...data, members: next });
  };

  const addMember = () => {
    onChange({ ...data, members: [...members, { name: '', role: '', image: '', link: '' }] });
  };

  const removeMember = (index: number) => {
    onChange({ ...data, members: members.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      {members.map((member, i) => (
        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">חבר/ת צוות {i + 1}</span>
            </div>
            <button
              type="button"
              onClick={() => removeMember(i)}
              className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            <ImagePickerField
              value={member.image}
              onChange={(url) => updateMember(i, 'image', url)}
              label="תמונה"
              previewHeight="h-20"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className={label}>שם</label>
                <input value={member.name} onChange={(e) => updateMember(i, 'name', e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>תפקיד</label>
                <input value={member.role} onChange={(e) => updateMember(i, 'role', e.target.value)} className={input} />
              </div>
            </div>
            <div>
              <label className={label}>
                <LinkIcon className="mb-px ml-1 inline h-2.5 w-2.5" />
                קישור
              </label>
              <input value={member.link} onChange={(e) => updateMember(i, 'link', e.target.value)} dir="ltr" className={`${input} font-mono text-[11px]`} placeholder="https://..." />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addMember}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 py-2.5 text-[11px] font-semibold text-slate-400 hover:border-ocean hover:text-ocean transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        הוסף חבר/ת צוות
      </button>
    </div>
  );
}
