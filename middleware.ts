import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

async function checkAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;
  if (!SECRET_KEY) return false;

  try {
    await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] });
    return true; 
  } catch (err) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthed = await checkAuth(req);

  // 1. ROOT GATE (PINTU GERBANG)
  if (path === '/') {
    if (isAuthed) {
      // Kalau Member -> Langsung masuk Dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } 
    // Kalau Guest -> Biarin di sini (Nanti kita kasih tampilan Gerbang doang di page.tsx)
    return NextResponse.next();
  }

  // 2. PROTEKSI AREA TERLARANG (Dracin & Dashboard)
  // Tamu gak boleh ngintip /dracin atau /dashboard
  if ((path.startsWith('/dashboard') || path.startsWith('/dracin')) && !isAuthed) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 3. PROTEKSI HALAMAN LOGIN (Member gak perlu login lagi)
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'],
};
