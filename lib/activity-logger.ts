import { prisma } from './prisma';

type LogParams = {
  tenantId: string;
  userId?: string;
  action: 'created' | 'updated' | 'deleted' | 'published' | 'duplicated' | 'exported';
  entity: 'page' | 'post' | 'lead' | 'popup' | 'domain' | 'menu' | 'media' | 'cpt' | 'cpt_entry' | 'settings' | 'team';
  entityId?: string;
  details?: Record<string, unknown>;
};

export async function logActivity({ tenantId, userId, action, entity, entityId, details }: LogParams) {
  try {
    await prisma.activityLog.create({
      data: {
        tenantId,
        userId: userId ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        details: details ? JSON.stringify(details) : '{}',
      },
    });
  } catch {
    // non-blocking
  }
}
