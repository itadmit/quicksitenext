'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendTeamInviteEmail } from '@/lib/email';

export type TeamActionState = { error?: string; success?: boolean } | undefined;

export async function inviteMemberAction(prev: TeamActionState, fd: FormData): Promise<TeamActionState> {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const email = (fd.get('email') as string)?.trim();
  const role = (fd.get('role') as string) || 'editor';

  if (!email) return { error: 'אימייל נדרש' };

  const target = await prisma.user.findUnique({ where: { email } });
  if (!target) return { error: 'משתמש לא נמצא. יש להירשם תחילה.' };

  const existing = await prisma.tenantMember.findUnique({ where: { tenantId_userId: { tenantId, userId: target.id } } });
  if (existing) return { error: 'המשתמש כבר חבר בצוות' };

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { name: true } });

  await prisma.tenantMember.create({ data: { tenantId, userId: target.id, role } });

  sendTeamInviteEmail(target.email, user.name, tenant?.name || '', role).catch(console.error);

  revalidatePath('/dashboard/team');
  return { success: true };
}

export async function updateRoleAction(memberId: string, role: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const member = await prisma.tenantMember.findFirst({ where: { id: memberId, tenantId } });
  if (!member) return;
  await prisma.tenantMember.update({ where: { id: memberId }, data: { role } });
  revalidatePath('/dashboard/team');
}

export async function removeMemberAction(memberId: string) {
  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const member = await prisma.tenantMember.findFirst({ where: { id: memberId, tenantId } });
  if (!member || member.userId === user.id) return;
  await prisma.tenantMember.delete({ where: { id: memberId } });
  revalidatePath('/dashboard/team');
}
