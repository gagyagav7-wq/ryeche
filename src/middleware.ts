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
  
  // LOG KE TERMINAL (Biar lu tau satpamnya kerja)
  console.log(`[MIDDLEWARE] Cek akses ke: ${path}`);

  const isAuthed = await checkAuth(req);

  // 1. ROOT GATE (Landing Page Tropical Bebas Akses)
  if (path === '/') {
    if (isAuthed) return NextResponse.redirect(new URL('/dashboard', req.url));
    return NextResponse.next();
  }

  // 2. PROTEKSI AREA VIP (WAJIB LOGIN)
  // --- NAH, INI DIA DAFTARNYA ---
  // Kita tambah '/dracin' biar gak jebol lagi!
  const protectedPrefixes = ['/dashboard', '/downloader', '/dracin']; 
  
  const isProtected = protectedPrefixes.some(p => path.startsWith(p));

  if (isProtected) {
    if (!isAuthed) {
        console.log(`[BLOCK] Tamu mau masuk ${path} -> TENDANG KE LOGIN`);
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }
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
