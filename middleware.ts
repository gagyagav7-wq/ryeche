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

  // 1. ROOT GATE (Landing Page Bebas Akses)
  if (path === '/') {
    return NextResponse.next();
  }

  // 2. PROTEKSI AREA TERLARANG (VIP ONLY)
  // --- PASTIKAN '/downloader' ADA DI SINI ---
  const protectedPaths = ['/dashboard', '/dracin', '/downloader'];
  
  const isProtected = protectedPaths.some(p => path.startsWith(p));

  // LOGIC: Kalau mau masuk VIP tapi GAK PUNYA TIKET (isAuthed = false)
  if (isProtected && !isAuthed) {
    const loginUrl = new URL('/login', req.url);
    // Simpan alamat tujuan biar nanti dibalikin lagi ke sana
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // 3. PROTEKSI HALAMAN LOGIN 
  // Kalau udah login, gak boleh masuk halaman login lagi (langsung ke dashboard)
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'],
};
