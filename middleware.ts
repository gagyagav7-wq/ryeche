import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value; // Deteksi session dari cookie 'session'
  const path = req.nextUrl.pathname;

  // 1. Verifikasi Token (Cek validitas JWT)
  let isAuthenticated = false;
  if (session && SECRET_KEY) {
    try {
      await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch (err) {
      // Token expired/invalid
    }
  }

  // --- LOGIC GATEKEEPER ROOT "/" (INI PATCH UTAMANYA) ---
  if (path === '/') {
    if (isAuthenticated) {
      // Punya sesi -> Masuk Dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      // Tidak punya sesi -> Masuk Public Listing (Dracin) atau Login
      return NextResponse.redirect(new URL('/dracin', req.url)); 
    }
  }

  // 2. PROTEKSI DASHBOARD (Biar gak bisa ditembak langsung)
  if (path.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. AUTH PAGES (Login/Register gak boleh diakses kalau sudah login)
  if ((path === '/login' || path === '/register') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
