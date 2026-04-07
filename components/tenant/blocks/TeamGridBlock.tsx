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

export default function TeamGridBlock({ data }: Props) {
  const members = (data.members as Member[]) ?? [];
  if (!members.length) return null;

  return (
    <section className="px-6 py-20 bg-nude/50">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member, i) => {
          const content = (
            <div
              className="group overflow-hidden border border-charcoal/5 bg-white transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden bg-charcoal/5">
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
                <h3 className="font-noto text-base font-bold text-charcoal">{member.name}</h3>
                {member.role && (
                  <p className="mt-1 text-xs tracking-wide text-charcoal/50">{member.role}</p>
                )}
              </div>
            </div>
          );

          if (member.link) {
            return (
              <a key={i} href={member.link} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            );
          }
          return <div key={i}>{content}</div>;
        })}
      </div>
    </section>
  );
}
