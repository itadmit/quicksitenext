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

function GridCard({
  member,
  index,
  updateMember,
  openImagePicker,
}: {
  member: Member;
  index: number;
  updateMember: (i: number, f: keyof Member, v: string) => void;
  openImagePicker: (cb: (url: string) => void) => void;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {member.image ? (
          <>
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => openImagePicker((url) => updateMember(index, 'image', url))}
              className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100 cursor-pointer"
              data-no-select
            >
              <Camera className="h-8 w-8 text-white" />
            </button>
          </>
        ) : (
          <button
            onClick={() => openImagePicker((url) => updateMember(index, 'image', url))}
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
          onChange={(v) => updateMember(index, 'name', v)}
          tag="h3"
          className="font-noto text-base font-bold text-navy"
          placeholder="שם"
        />
        <EditableText
          value={member.role}
          onChange={(v) => updateMember(index, 'role', v)}
          tag="p"
          className="mt-1 text-xs tracking-wide text-navy/50"
          placeholder="תפקיד"
        />
      </div>
    </div>
  );
}

function CompactCard({
  member,
  index,
  updateMember,
  openImagePicker,
}: {
  member: Member;
  index: number;
  updateMember: (i: number, f: keyof Member, v: string) => void;
  openImagePicker: (cb: (url: string) => void) => void;
}) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:shadow-lg">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100">
        {member.image ? (
          <>
            <img
              src={member.image}
              alt={member.name}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => openImagePicker((url) => updateMember(index, 'image', url))}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100 cursor-pointer"
              data-no-select
            >
              <Camera className="h-5 w-5 text-white" />
            </button>
          </>
        ) : (
          <button
            onClick={() => openImagePicker((url) => updateMember(index, 'image', url))}
            className="flex h-full w-full items-center justify-center rounded-full text-sm font-bold text-white cursor-pointer"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
            data-no-select
          >
            {getInitials(member.name)}
          </button>
        )}
      </div>
      <EditableText
        value={member.name}
        onChange={(v) => updateMember(index, 'name', v)}
        tag="h3"
        className="mt-3 font-noto text-sm font-bold text-navy"
        placeholder="שם"
      />
      <EditableText
        value={member.role}
        onChange={(v) => updateMember(index, 'role', v)}
        tag="p"
        className="mt-0.5 text-xs tracking-wide text-navy/50"
        placeholder="תפקיד"
      />
    </div>
  );
}

export default function EditableTeamGridBlock({ data, onChange }: Props) {
  const { openImagePicker } = useEditor();
  const members = (data.members as Member[]) ?? [];
  const variant = (data.variant as string) || 'grid';

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
    <section className="px-6 py-20 bg-slate-50">
      {variant === 'compact' ? (
        <div className="mx-auto grid max-w-5xl gap-5 grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <CompactCard
              key={i}
              member={member}
              index={i}
              updateMember={updateMember}
              openImagePicker={openImagePicker}
            />
          ))}
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, i) => (
            <GridCard
              key={i}
              member={member}
              index={i}
              updateMember={updateMember}
              openImagePicker={openImagePicker}
            />
          ))}
        </div>
      )}
    </section>
  );
}
