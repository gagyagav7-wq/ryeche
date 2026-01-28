import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// AMAN: Jangan pernah pakai fallback string di production.
const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

export async function middleware(req: NextRequest) {
  // FAIL-FAST: Kalau secret gak ada, matikan akses biar gak ada false sense of security
  if (!SECRET_KEY) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse("Server Misconfiguration: JWT_SECRET missing", { status: 500 });
    }
  }

  const session = req.cookies.get('session')?.value;
  const path = req.nextUrl.pathname;

  // 1. Verifikasi Token
  let isAuthenticated = false;
  if (session && SECRET_KEY) {
    try {
      await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch (err) {
      // Token invalid/expired
    }
  }

  // --- TAMBAHAN BARU: ROOT ROUTE "/" HANDLING ---
  // Ini solusi biar pas buka "/" langsung dilempar sesuai status login
  if (path === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  // ---------------------------------------------

  // 3. PROTECTED ROUTES (Logic Lama Tetap Ada)
  const protectedPaths = ['/dashboard', '/dracin', '/downloader', '/tools'];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    
    // UX: Bawa query string biar balik ke episode yang bener
    const fullPath = req.nextUrl.pathname + req.nextUrl.search;
    loginUrl.searchParams.set('callbackUrl', fullPath);
    
    return NextResponse.redirect(loginUrl);
  }

  // 4. AUTH ROUTES (Logic Lama Tetap Ada)
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.some((p) => path.startsWith(p));

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
