import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Block } from '@/lib/block-registry';
import BlockEditor from '@/components/dashboard/BlockEditor';

export const metadata = { title: 'עריכת עמוד | דשבורד' };

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tenantId = user.memberships[0]?.tenantId;
  if (!tenantId) redirect('/register');

  const page = await prisma.page.findFirst({
    where: { id, tenantId },
  });
  if (!page) notFound();

  let blocks: Block[] = [];
  try {
    blocks = JSON.parse(page.blocks);
  } catch {
    blocks = [];
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard/pages"
          className="flex items-center justify-center w-8 h-8 border border-charcoal/20 hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-charcoal/60">arrow_forward</span>
        </Link>
        <div>
          <h1 className="font-noto text-2xl font-black text-charcoal">{page.title}</h1>
          <p className="text-xs text-charcoal/50 font-mono">/{page.slug}</p>
        </div>
        <span
          className={`mr-auto inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
            page.status === 'published'
              ? 'bg-green-50 text-green-700'
              : 'bg-charcoal/5 text-charcoal/50'
          }`}
        >
          {page.status === 'published' ? 'פורסם' : 'טיוטה'}
        </span>
      </div>

      <BlockEditor
        pageId={page.id}
        initialBlocks={blocks}
        pageMeta={{
          title: page.title,
          slug: page.slug,
          status: page.status,
          seoTitle: page.seoTitle ?? '',
          seoDescription: page.seoDescription ?? '',
        }}
      />
    </div>
  );
}
