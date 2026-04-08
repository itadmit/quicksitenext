import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPostForm from './EditPostForm';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findFirst({ where: { id, tenantId } }),
    prisma.category.findMany({ where: { tenantId }, orderBy: { name: 'asc' } }),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-noto text-3xl font-black text-charcoal mb-8">עריכת פוסט</h1>
      <EditPostForm post={JSON.parse(JSON.stringify(post))} categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
