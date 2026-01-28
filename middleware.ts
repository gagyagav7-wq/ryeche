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

  // 1. ROOT GATE (PINTU UTAMA)
  // Logic: Kalau Member -> Lempar ke Dashboard. 
  //        Kalau Guest  -> Lempar ke Landing Page Publik (bisa /dracin/latest atau tetap di /)
  if (path === '/') {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    // CATATAN PENTING: 
    // Kalau lu mau Guest ngeliat Landing Page Tropical yang udah kita buat di src/app/page.tsx,
    // biarkan 'NextResponse.next()'.
    // Tapi kalau lu mau Guest dipaksa masuk ke '/dracin/latest', ganti jadi redirect.
    
    return NextResponse.next(); 
    // ^ Ganti baris ini dengan redirect('/dracin/latest', req.url) kalau mau skip landing page tropical.
  }

  // 2. PROTEKSI AREA VIP (Dashboard & Downloader)
  // Hapus '/dracin' dari sini biar jadi Public Area
  const protectedPrefixes = ['/dashboard', '/downloader'];
  const isProtected = protectedPrefixes.some(p => path.startsWith(p));

  if (isProtected && !isAuthed) {
    const loginUrl = new URL('/login', req.url);
    // Simpan Full Path + Query Params (biar gak ilang data pas redirect)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 3. CEGAH MEMBER MASUK HALAMAN LOGIN/REGISTER
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher untuk skip file statis & API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'],
};
