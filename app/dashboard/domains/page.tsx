import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import DomainsClient from './DomainsClient';

export default async function DomainsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const tenantId = user.memberships[0].tenantId;
  const domains = await prisma.domain.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });

  return <DomainsClient domains={JSON.parse(JSON.stringify(domains))} />;
}
