'use server';

import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: string;
  icon: string;
};

export async function globalSearchAction(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const user = await requireUser();
  const tenantId = user.memberships[0].tenantId;
  const [pages, posts, leads] = await Promise.all([
    prisma.page.findMany({
      where: { tenantId, OR: [{ title: { contains: query, mode: 'insensitive' } }, { slug: { contains: query, mode: 'insensitive' } }] },
      take: 5,
      select: { id: true, title: true, slug: true, status: true },
    }),
    prisma.post.findMany({
      where: { tenantId, OR: [{ title: { contains: query, mode: 'insensitive' } }, { slug: { contains: query, mode: 'insensitive' } }] },
      take: 5,
      select: { id: true, title: true, slug: true, status: true },
    }),
    prisma.lead.findMany({
      where: { tenantId, OR: [{ name: { contains: query, mode: 'insensitive' } }, { email: { contains: query, mode: 'insensitive' } }, { company: { contains: query, mode: 'insensitive' } }] },
      take: 5,
      select: { id: true, name: true, email: true, status: true },
    }),
  ]);

  const results: SearchResult[] = [];

  pages.forEach(p => results.push({
    id: p.id, title: p.title, subtitle: `/${p.slug}`,
    href: `/dashboard/pages/${p.id}`, category: 'עמודים', icon: 'description',
  }));

  posts.forEach(p => results.push({
    id: p.id, title: p.title, subtitle: `/${p.slug}`,
    href: `/dashboard/posts/${p.id}`, category: 'פוסטים', icon: 'article',
  }));

  leads.forEach(l => results.push({
    id: l.id, title: l.name, subtitle: l.email,
    href: `/dashboard/leads`, category: 'לידים', icon: 'contact_mail',
  }));

  const navResults: SearchResult[] = [
    { id: 'nav-pages', title: 'עמודים', href: '/dashboard/pages', category: 'ניווט', icon: 'description' },
    { id: 'nav-posts', title: 'פוסטים', href: '/dashboard/posts', category: 'ניווט', icon: 'article' },
    { id: 'nav-leads', title: 'לידים', href: '/dashboard/leads', category: 'ניווט', icon: 'contact_mail' },
    { id: 'nav-media', title: 'מדיה', href: '/dashboard/media', category: 'ניווט', icon: 'image' },
    { id: 'nav-settings', title: 'הגדרות', href: '/dashboard/settings', category: 'ניווט', icon: 'settings' },
    { id: 'nav-domains', title: 'דומיינים', href: '/dashboard/domains', category: 'ניווט', icon: 'language' },
    { id: 'nav-popups', title: 'פופאפים', href: '/dashboard/popups', category: 'ניווט', icon: 'web_asset' },
    { id: 'nav-team', title: 'צוות', href: '/dashboard/team', category: 'ניווט', icon: 'group' },
    { id: 'nav-activity', title: 'לוג פעילות', href: '/dashboard/activity', category: 'ניווט', icon: 'history' },
  ].filter(n => n.title.includes(query));

  return [...results, ...navResults].slice(0, 15);
}
