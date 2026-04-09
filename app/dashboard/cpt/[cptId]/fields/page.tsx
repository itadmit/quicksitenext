import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/dashboard/PageHeader';
import FieldsEditor from './FieldsEditor';

export default async function CptFieldsPage({ params }: { params: Promise<{ cptId: string }> }) {
  const user = await getCurrentUser();
  const tenantId = user!.memberships[0].tenantId;
  const { cptId } = await params;

  const cpt = await prisma.customPostType.findFirst({ where: { id: cptId, tenantId } });
  if (!cpt) notFound();

  return (
    <div className="max-w-4xl space-y-5">
      <PageHeader title={`שדות: ${cpt.name}`} subtitle="הגדרת סכמת שדות מותאמים" backHref={`/dashboard/cpt/${cptId}`} />
      <FieldsEditor cptId={cptId} initialFields={cpt.fields} />
    </div>
  );
}
