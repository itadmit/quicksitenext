import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PostForm from './PostForm';

export default async function NewPostPage() {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const categories = await prisma.category.findMany({ where: { tenantId }, orderBy: { name: 'asc' } });

  return (
    <div>
      <h1 className="font-noto text-3xl font-black text-charcoal mb-8">פוסט חדש</h1>
      <PostForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
