import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import BlockRenderer from '@/components/tenant/BlockRenderer';
import Link from 'next/link';

async function getTenantId(): Promise<string | null> {
  const h = await headers();
  const slug = h.get('x-tenant-slug');
  const host = h.get('x-tenant-host');

  if (slug) {
    const t = await prisma.tenant.findUnique({ where: { slug }, select: { id: true } });
    return t?.id ?? null;
  }
  if (host) {
    const d = await prisma.domain.findFirst({ where: { hostname: host, verified: true }, select: { tenantId: true } });
    return d?.tenantId ?? null;
  }
  return null;
}

async function renderPage(tenantId: string, pageSlug: string) {
  const page = await prisma.page.findUnique({
    where: { tenantId_slug: { tenantId, slug: pageSlug } },
  });
  if (!page || page.status !== 'published') return null;
  return <BlockRenderer blocks={page.blocks} tenantId={tenantId} />;
}

async function renderBlogList(tenantId: string) {
  const posts = await prisma.post.findMany({
    where: { tenantId, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-10 font-display text-4xl" style={{ color: 'var(--tenant-primary)' }}>
        בלוג
      </h1>
      {posts.length === 0 ? (
        <p className="text-charcoal/60">אין פוסטים להצגה.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                <h2 className="font-noto text-lg font-bold leading-snug">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-charcoal/70">{post.excerpt}</p>
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
      )}
    </section>
  );
}

async function renderBlogPost(tenantId: string, postSlug: string) {
  const post = await prisma.post.findUnique({
    where: { tenantId_slug: { tenantId, slug: postSlug } },
    include: { category: true, postTags: { include: { tag: true } } },
  });

  if (!post || post.status !== 'published') return null;

  let contentBlocks: Array<{ id: string; type: string; data: Record<string, unknown> }> = [];
  try {
    contentBlocks = JSON.parse(post.content);
  } catch {
    /* plain text fallback */
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header className="mb-10">
        {post.category && (
          <span
            className="mb-3 inline-block text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--tenant-primary)' }}
          >
            {post.category.name}
          </span>
        )}
        <h1 className="font-display text-4xl leading-tight md:text-5xl">{post.title}</h1>
        {post.publishedAt && (
          <time className="mt-3 block text-sm text-charcoal/50">
            {new Date(post.publishedAt).toLocaleDateString('he-IL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}
        {post.postTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.postTags.map(({ tag }) => (
              <span
                key={tag.id}
                className="rounded-full bg-charcoal/5 px-3 py-1 text-xs font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="mb-10 w-full rounded-lg object-cover"
        />
      )}

      {contentBlocks.length > 0 ? (
        <BlockRenderer blocks={JSON.stringify(contentBlocks)} tenantId={tenantId} />
      ) : (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <div className="mt-12 border-t border-charcoal/10 pt-6">
        <Link
          href="/blog"
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--tenant-primary)' }}
        >
          ← חזרה לבלוג
        </Link>
      </div>
    </article>
  );
}

async function renderCptEntry(tenantId: string, slugParts: string[]) {
  const cptSlug = slugParts[0];
  const entrySlug = slugParts[1];

  const cpt = await prisma.customPostType.findUnique({
    where: { tenantId_slug: { tenantId, slug: cptSlug } },
  });
  if (!cpt) return null;

  if (!entrySlug) {
    const entries = await prisma.customPostEntry.findMany({
      where: { cptId: cpt.id, status: 'published' },
      orderBy: { createdAt: 'desc' },
    });

    return (
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="mb-10 font-display text-4xl" style={{ color: 'var(--tenant-primary)' }}>
          {cpt.name}
        </h1>
        {entries.length === 0 ? (
          <p className="text-charcoal/60">אין תוכן להצגה.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/${cptSlug}/${entry.slug}`}
                className="rounded-lg border border-charcoal/10 bg-white p-6 transition hover:shadow-md"
              >
                <h2 className="font-noto text-lg font-bold">{entry.title}</h2>
              </Link>
            ))}
          </div>
        )}
      </section>
    );
  }

  const entry = await prisma.customPostEntry.findUnique({
    where: { cptId_slug: { cptId: cpt.id, slug: entrySlug } },
  });
  if (!entry || entry.status !== 'published') return null;

  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(entry.data);
  } catch {
    /* ignore */
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 font-display text-4xl">{entry.title}</h1>
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <dt className="text-xs font-bold uppercase tracking-wider text-charcoal/50">{key}</dt>
            <dd className="mt-1">{typeof value === 'string' ? value : JSON.stringify(value)}</dd>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link
          href={`/${cptSlug}`}
          className="text-sm font-medium hover:underline"
          style={{ color: 'var(--tenant-primary)' }}
        >
          ← חזרה ל{cpt.name}
        </Link>
      </div>
    </article>
  );
}

export default async function TenantDynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const tenantId = await getTenantId();
  if (!tenantId) notFound();

  // 1. Check for a CMS page matching the full slug
  const pageSlug = slug.join('/');
  const pageEl = await renderPage(tenantId, pageSlug);
  if (pageEl) return pageEl;

  // 2. Blog routes
  if (slug[0] === 'blog') {
    if (slug.length === 1) return renderBlogList(tenantId);
    if (slug.length === 2) {
      const postEl = await renderBlogPost(tenantId, slug[1]);
      if (postEl) return postEl;
    }
    notFound();
  }

  // 3. Custom Post Type entries
  if (slug.length <= 2) {
    const cptEl = await renderCptEntry(tenantId, slug);
    if (cptEl) return cptEl;
  }

  notFound();
}
