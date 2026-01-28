import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

// Helper buat cek token valid/enggak
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

  // 1. ROOT GATE (Landing Page)
  // Kalau buka root '/', biarin aja masuk (karena sekarang udah jadi landing page bagus)
  if (path === '/') {
    return NextResponse.next();
  }

  // 2. PROTEKSI AREA TERLARANG (VIP ONLY)
  // --- DAFTAR RUANGAN YANG WAJIB LOGIN ---
  const protectedPaths = ['/dashboard', '/dracin', '/downloader']; 
  // ^^^ Pastikan '/downloader' ada di sini!
  
  const isProtected = protectedPaths.some(p => path.startsWith(p));

  if (isProtected && !isAuthed) {
    // Kalau mau masuk area VIP tapi gak punya tiket (token) -> LEMPAR KE LOGIN
    const loginUrl = new URL('/login', req.url);
    // Kita kasih 'callbackUrl' biar abis login otomatis balik ke halaman yang dituju
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // 3. PROTEKSI HALAMAN LOGIN 
  // Kalau udah login tapi mau buka /login lagi -> Lempar ke Dashboard
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher biar middleware jalan di semua halaman kecuali file statis/api
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'],
};
