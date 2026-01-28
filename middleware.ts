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
    // Kalau Guest buka Home, biarkan dia lihat Landing Page (Tropical)
    // Kalau Admin buka Home, biarkan juga (karena Landing Page lu sekarang bagus)
    // Jadi Logic redirect ke dashboard kita HAPUS biar Landing Page selalu tampil.
    return NextResponse.next();
  }

  // 2. PROTEKSI AREA TERLARANG (VIP ONLY)
  // TAMBAHAN BARU: path.startsWith('/downloader')
  const protectedPaths = ['/dashboard', '/dracin', '/downloader'];
  
  // Cek apakah user mau masuk ke salah satu path terlarang
  const isProtected = protectedPaths.some(p => path.startsWith(p));

  if (isProtected && !isAuthed) {
    const loginUrl = new URL('/login', req.url);
    // Simpan url tujuan biar habis login bisa balik lagi ke situ
    loginUrl.searchParams.set('callbackUrl', path);
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
