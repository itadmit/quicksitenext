import Link from 'next/link';
import { prisma } from '@/lib/prisma';

type Props = {
  data: Record<string, unknown>;
  tenantId: string;
};

export default async function PostsGridBlock({ data, tenantId }: Props) {
  const count = typeof data.count === 'number' ? data.count : 6;
  const columns = typeof data.columns === 'number' ? data.columns : 3;

  const posts = await prisma.post.findMany({
    where: { tenantId, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: count,
    include: { category: true },
  });

  if (!posts.length) {
    return (
      <section className="py-12 text-center text-charcoal/50">
        <p>אין פוסטים להצגה.</p>
      </section>
    );
  }

  const gridClass =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className={`grid gap-8 ${gridClass}`}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-lg border border-charcoal/10 bg-white transition hover:shadow-lg"
          >
            {post.coverImage && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-5">
              {post.category && (
                <span
                  className="mb-2 inline-block text-xs font-bold uppercase tracking-wider"
                  style={{ color: 'var(--tenant-primary)' }}
                >
                  {post.category.name}
                </span>
              )}
              <h3 className="font-noto text-lg font-bold leading-snug">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">{post.excerpt}</p>
              )}
              {post.publishedAt && (
                <time className="mt-3 block text-xs text-charcoal/50">
                  {new Date(post.publishedAt).toLocaleDateString('he-IL')}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
