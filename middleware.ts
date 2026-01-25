import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isDashboard = path.startsWith('/dashboard');
  const isAuthPage = path === '/';

  const cookie = req.cookies.get('session')?.value;
  const session = cookie ? await verifySession(cookie) : null;

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
