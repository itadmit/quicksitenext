import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Block } from '@/lib/block-registry';
import VisualEditor from '@/components/visual-editor/VisualEditor';

export const metadata = { title: 'עורך ויזואלי | דשבורד' };

type Props = { params: Promise<{ id: string }> };

export default async function VisualEditorPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();
  const tenantId = user.memberships[0].tenantId;

  const page = await prisma.page.findFirst({
    where: { id, tenantId },
  });
  if (!page) notFound();

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { siteSettings: true },
  });

  let blocks: Block[] = [];
  try {
    blocks = JSON.parse(page.blocks);
  } catch {
    blocks = [];
  }

  const siteSettings = tenant?.siteSettings;

  return (
    <VisualEditor
      pageId={page.id}
      initialBlocks={blocks}
      pageMeta={{
        title: page.title,
        slug: page.slug,
        status: page.status,
        seoTitle: page.seoTitle ?? '',
        seoDescription: page.seoDescription ?? '',
      }}
      tenantSettings={{
        siteName: siteSettings?.siteName || tenant?.name || '',
        primaryColor: siteSettings?.primaryColor || '#a28b5d',
        logoUrl: siteSettings?.logoUrl || null,
      }}
    />
  );
}
