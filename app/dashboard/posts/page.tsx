import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PostsPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;

  const posts = await prisma.post.findMany({
    where: { tenantId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-noto text-3xl font-black text-charcoal">פוסטים</h1>
        <Link
          href="/dashboard/posts/new"
          className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90"
        >
          פוסט חדש
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-charcoal/10 bg-white p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-charcoal/20 mb-3 block">article</span>
          <p className="text-charcoal/50 text-sm">אין פוסטים עדיין</p>
        </div>
      ) : (
        <div className="border border-charcoal/10 bg-white overflow-hidden">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/[0.02]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">כותרת</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סלאג</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">סטטוס</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">תאריך פרסום</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal/60">קטגוריה</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-charcoal/5 hover:bg-charcoal/[0.01] transition-colors">
                  <td className="px-4 py-3 font-medium text-charcoal">{post.title}</td>
                  <td className="px-4 py-3 text-sm text-charcoal/60 font-mono">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-charcoal/10 text-charcoal/60'
                      }`}
                    >
                      {post.status === 'published' ? 'פורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal/60">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('he-IL')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal/60">
                    {post.category?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="text-primary text-xs font-bold hover:underline"
                    >
                      עריכה
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
