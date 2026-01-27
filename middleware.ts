import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Pastikan JWT_SECRET ada. Kalau tidak, aplikasi akan error (fail-fast)
// Ini lebih aman daripada pakai fallback string yang tidak aman.
const SECRET_KEY = process.env.JWT_SECRET 
  ? new TextEncoder().encode(process.env.JWT_SECRET) 
  : null;

export async function middleware(req: NextRequest) {
  // Fail-safe jika env belum diset di production
  if (!SECRET_KEY) {
    console.error("CRITICAL: JWT_SECRET is not defined in environment variables.");
    return NextResponse.redirect(new URL('/login', req.url)); // Atau page error khusus
  }

  const session = req.cookies.get('session')?.value;
  const path = req.nextUrl.pathname;

  // 1. Verifikasi Token (Strict Algorithm)
  let isAuthenticated = false;
  if (session) {
    try {
      await jwtVerify(session, SECRET_KEY, { algorithms: ['HS256'] });
      isAuthenticated = true;
    } catch (err) {
      // Token invalid/expired
    }
  }

  // 2. PROTECTED ROUTES (Dashboard & Apps)
  const protectedPaths = ['/dashboard', '/dracin', '/downloader', '/tools'];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    // Simpan url tujuan biar UX-nya enak (Redirect back)
    loginUrl.searchParams.set('callbackUrl', path); 
    return NextResponse.redirect(loginUrl);
  }

  // 3. AUTH ROUTES (Login/Register)
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.some((p) => path.startsWith(p));

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Config: Exclude semua file statis biar middleware ringan
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
