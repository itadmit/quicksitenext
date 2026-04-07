import { NextRequest, NextResponse } from 'next/server';

const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN ?? 'localhost:3000';

function getPlatformBase(): string {
  return PLATFORM_DOMAIN.replace(/:\d+$/, '');
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? 'localhost:3000';
  const h = host.replace(/:\d+$/, '');
  const pd = getPlatformBase();
  const { pathname } = request.nextUrl;

  const isPlatform =
    h === pd || h === `app.${pd}` || h === 'localhost' || h === '127.0.0.1';

  if (isPlatform) {
    const headers = new Headers(request.headers);
    headers.set('x-tenant-mode', 'platform');
    return NextResponse.next({ request: { headers } });
  }

  let slug: string | null = null;
  if (h.endsWith(`.${pd}`)) {
    const sub = h.slice(0, -(pd.length + 1));
    if (sub && sub !== 'app' && sub !== 'www') slug = sub;
  }

  const headers = new Headers(request.headers);
  headers.set('x-tenant-mode', 'tenant');
  headers.set('x-tenant-host', h);
  if (slug) headers.set('x-tenant-slug', slug);

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/site${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|admin).*)'],
};
