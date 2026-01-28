import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

async function checkAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token')?.value;
  if (!token || !SECRET_KEY) return false;
  try {
    await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] });
    return true; 
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthed = await checkAuth(req);

  // 1. ROOT GATE
  if (path === '/') {
    // Member -> Dashboard
    if (isAuthed) return NextResponse.redirect(new URL('/dashboard', req.url));
    // Guest -> Landing Page (Tropical)
    return NextResponse.next();
  }

  // 2. PROTEKSI AREA VIP (CUMA DASHBOARD YANG DIKUNCI)
  // Downloader kita hapus dari sini biar jadi PUBLIC
  const protectedPrefixes = ['/dashboard']; 
  const isProtected = protectedPrefixes.some(p => path.startsWith(p));

  if (isProtected && !isAuthed) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 3. MEMBER GAK BOLEH KE HALAMAN LOGIN
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'],
};
