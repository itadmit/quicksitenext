import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Block } from '@/lib/block-registry';
import BlockEditor from '@/components/dashboard/BlockEditor';
import PageHeader from '@/components/dashboard/PageHeader';

export const metadata = { title: 'עריכת עמוד | דשבורד' };

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;

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
    <div>
      <PageHeader title={page.title} subtitle={`/${page.slug}`} backHref="/dashboard/pages">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            page.status === 'published'
              ? 'bg-green-50 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {page.status === 'published' ? 'פורסם' : 'טיוטה'}
        </span>
      </PageHeader>

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
