import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Fail-fast logic: Langsung error kalau JWT_SECRET tidak ada
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret && process.env.NODE_ENV === 'production') {
  throw new Error("CRITICAL: JWT_SECRET environment variable is not set.");
}
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : new TextEncoder().encode("fallback_dev_secret");

export async function middleware(req: NextRequest) {
  // Double check saat runtime (opsional, tapi aman)
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    return new NextResponse("Server Misconfiguration: JWT_SECRET missing", { status: 500 });
  }

  const session = req.cookies.get('session')?.value;
  const path = req.nextUrl.pathname;

  // 1. Verifikasi Token
  let isAuthenticated = false;
  if (session) {
    try {
      await jwtVerify(session, SECRET_KEY!, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch (err) {
      // Token invalid/expired
    }
  }

  // 2. PROTECTED ROUTES
  const protectedPaths = ['/dashboard', '/dracin', '/downloader', '/tools'];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    
    // FIX UX: Ambil path + search params (query) biar user balik ke episode yg bener
    const fullPath = req.nextUrl.pathname + req.nextUrl.search;
    loginUrl.searchParams.set('callbackUrl', fullPath);
    
    return NextResponse.redirect(loginUrl);
  }

  // 3. AUTH ROUTES
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
