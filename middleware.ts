import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Ganti dengan JWT_SECRET kamu
const SECRET_KEY = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const path = req.nextUrl.pathname;

  // 1. Cek Validitas Token (Opsional tapi Recommended)
  let isAuthenticated = false;
  if (session && SECRET_KEY) {
    try {
      await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch (err) {
      // Token invalid/expired
    }
  } else if (session) {
    // Kalau tidak pakai verify (cuma cek cookie ada/nggak), anggap true sementara
    isAuthenticated = true;
  }

  // 2. ROOT GATE (Logic "/" )
  // Ini yang memperbaiki bug kamu.
  if (path === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      // User belum login -> Arahkan ke Landing Public (Listing Drama)
      return NextResponse.redirect(new URL('/dracin/latest', req.url));
    }
  }

  // 3. PROTEKSI DASHBOARD
  if (path.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      // Lempar ke login, bawa callbackUrl biar user experience bagus
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. AUTH PAGE GUARD (Login/Register)
  if ((path === '/login' || path === '/register') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher: Apply ke semua route KECUALI api, static files, favicon, dll
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
