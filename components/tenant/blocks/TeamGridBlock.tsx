type Member = { name: string; role: string; image: string; link: string };

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          >
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <div className="p-5 text-center">
        <h3 className="font-noto text-base font-bold text-navy">{member.name}</h3>
        {member.role && (
          <p className="mt-1 text-xs tracking-wide text-navy/50">{member.role}</p>
        )}
      </div>
    </div>
  );
}

function CompactCard({ member }: { member: Member }) {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:shadow-lg">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: 'var(--tenant-primary)' }}
          >
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <h3 className="mt-3 font-noto text-sm font-bold text-navy">{member.name}</h3>
      {member.role && (
        <p className="mt-0.5 text-xs tracking-wide text-navy/50">{member.role}</p>
      )}
    </div>
  );
}

function MemberWrapper({ member, children }: { member: Member; children: React.ReactNode }) {
  if (member.link) {
    return (
      <a href={member.link} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <>{children}</>;
}

function GridVariant({ members }: { members: Member[] }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member, i) => (
        <MemberWrapper key={i} member={member}>
          <MemberCard member={member} />
        </MemberWrapper>
      ))}
    </div>
  );
}

function CompactVariant({ members }: { members: Member[] }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 grid-cols-2 lg:grid-cols-4">
      {members.map((member, i) => (
        <MemberWrapper key={i} member={member}>
          <CompactCard member={member} />
        </MemberWrapper>
      ))}
    </div>
  );
}

export default function TeamGridBlock({ data }: Props) {
  const members = (data.members as Member[]) ?? [];
  const variant = (data.variant as string) || 'grid';
  if (!members.length) return null;

  return (
    <section className="px-6 py-20 bg-slate-50">
      {variant === 'compact' ? (
        <CompactVariant members={members} />
      ) : (
        <GridVariant members={members} />
      )}
    </section>
  );
}
