import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

export async function middleware(req: NextRequest) {
  // DEBUGGING: Cek terminal VPS lu buat liat nama cookie yang sebenernya
  // console.log("COOKIES:", req.cookies.getAll()); 

  // CARI AMAN: Cek 'session' ATAU 'token' (salah satu pasti bener)
  const cookieVal = req.cookies.get('session')?.value || req.cookies.get('token')?.value;
  const path = req.nextUrl.pathname;

  let isAuthenticated = false;

  // Cek token valid gak (kalau ada secret)
  if (cookieVal && SECRET_KEY) {
    try {
      await jwtVerify(cookieVal, SECRET_KEY, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch (err) {
      console.log("Token Invalid/Expired");
    }
  } else if (cookieVal) {
    // Fallback kalau gak ada secret key di env, asal ada cookie dianggap login
    isAuthenticated = true;
  }

  // --- LOGIC PINTU GERBANG (ROOT) ---
  if (path === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/dracin', req.url));
    }
  }

  // Proteksi Dashboard
  if (path.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Proteksi Halaman Login (Kalau udah login, tendang ke dashboard)
  if ((path === '/login' || path === '/register') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
