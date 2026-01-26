import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const path = req.nextUrl.pathname;

  // 1. Verifikasi Token
  let isAuthenticated = false;
  if (session) {
    try {
      await jwtVerify(session, SECRET_KEY);
      isAuthenticated = true;
    } catch (err) {
      isAuthenticated = false;
    }
  }

  // 2. Logic Redirect
  // Kalau user sudah login tapi mau ke halaman auth/landing, lempar ke dashboard
  if (isAuthenticated && (path === '/login' || path === '/register' || path === '/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Kalau user BELUM login tapi mau ke halaman protected, lempar ke login
  const protectedRoutes = ['/dashboard', '/dracin', '/downloader'];
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));

  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
