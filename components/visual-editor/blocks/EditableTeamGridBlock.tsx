'use client';

import { Camera } from 'lucide-react';
import EditableText from '../EditableText';
import { useEditor } from '../EditorContext';

type Member = { name: string; role: string; image: string; link: string };

type Props = {
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
};

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

export default function EditableTeamGridBlock({ data, onChange }: Props) {
  const { openImagePicker } = useEditor();
  const members = (data.members as Member[]) ?? [];

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const newMembers = members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onChange({ ...data, members: newMembers });
  };

  if (!members.length) {
    return (
      <section className="px-6 py-20 text-center text-sm text-slate-400">
        הוסיפו חברי צוות דרך פנל המאפיינים
      </section>
    );
  }

  return (
    <section className="px-6 py-20 bg-nude/50">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, i) => (
          <div
            key={i}
            className="group overflow-hidden border border-charcoal/5 bg-white transition-all hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-charcoal/5">
              {member.image ? (
                <>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => openImagePicker((url) => updateMember(i, 'image', url))}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100 cursor-pointer"
                    data-no-select
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => openImagePicker((url) => updateMember(i, 'image', url))}
                  className="flex h-full w-full items-center justify-center text-3xl font-bold text-white cursor-pointer"
                  style={{ backgroundColor: 'var(--tenant-primary)' }}
                  data-no-select
                >
                  {getInitials(member.name)}
                </button>
              )}
            </div>
            <div className="p-5 text-center">
              <EditableText
                value={member.name}
                onChange={(v) => updateMember(i, 'name', v)}
                tag="h3"
                className="font-noto text-base font-bold text-charcoal"
                placeholder="שם"
              />
              <EditableText
                value={member.role}
                onChange={(v) => updateMember(i, 'role', v)}
                tag="p"
                className="mt-1 text-xs tracking-wide text-charcoal/50"
                placeholder="תפקיד"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
