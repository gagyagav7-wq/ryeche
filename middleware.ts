import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Pastikan env ini sama dengan di .env
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "rahasia_super_ganti_dengan_string_acak_panjang");

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const path = req.nextUrl.pathname;

  // 1. Verifikasi Token (Stateless Check)
  let isAuthenticated = false;
  if (session) {
    try {
      await jwtVerify(session, SECRET_KEY);
      isAuthenticated = true;
    } catch (err) {
      console.log("Token invalid/expired");
    }
  }

  // 2. PROTECTED ROUTES (Dashboard & Apps)
  // Kalau belum login tapi mau masuk sini -> Tendang ke Login
  const protectedPaths = ['/dashboard', '/dracin', '/downloader', '/tools'];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    // (Opsional) Simpan url tujuan biar nanti bisa redirect balik
    // loginUrl.searchParams.set('callbackUrl', path); 
    return NextResponse.redirect(loginUrl);
  }

  // 3. AUTH ROUTES (Login/Register)
  // Kalau sudah login tapi mau ke login lagi -> Lempar ke Dashboard
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.some((p) => path.startsWith(p));

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Config: Matcher biar middleware gak jalan di file statis/api internal next
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
