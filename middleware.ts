import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

// Helper: Cek status Auth
async function checkAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token')?.value;

  if (!token) return false;

  // Fail-safe: Kalau secret hilang
  if (!SECRET_KEY) {
    if (process.env.NODE_ENV !== 'production') {
       console.warn("[WARN] JWT_SECRET missing! Auth treated as Guest.");
    }
    return false;
  }

  try {
    await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] });
    return true; 
  } catch (err: any) {
    // KRITIK POIN 2 & 6: Log error detail (expired vs invalid signature)
    if (process.env.NODE_ENV !== 'production') {
      const code = err.code || err.name || 'Unknown Error';
      console.log(`[AUTH FAIL] Verify Failed. Reason: ${code}`);
    }
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthed = await checkAuth(req);

  // KRITIK POIN 1: Log status Auth yang jelas di Root
  if (process.env.NODE_ENV !== 'production' && path === '/') {
    const hasToken = !!req.cookies.get('token');
    console.log("------------------------------------------------");
    console.log("[MIDDLEWARE ROOT] Debug Report:");
    console.log(` - Incoming Cookies: [${req.cookies.getAll().map(c => c.name).join(', ')}]`);
    console.log(` - Has Token? ${hasToken}`);
    console.log(` - Is Authenticated? ${isAuthed} ${isAuthed ? '✅' : '❌'}`);
    console.log("------------------------------------------------");
  }

  // 1. ROOT GATE
  if (path === '/') {
    // KRITIK POIN 3: Redirect standar (307 Temporary) lebih aman buat auth
    return isAuthed 
      ? NextResponse.redirect(new URL('/dashboard', req.url))
      : NextResponse.redirect(new URL('/dracin/latest', req.url));
  }

  // 2. PROTEKSI DASHBOARD
  if (path.startsWith('/dashboard') && !isAuthed) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 3. PROTEKSI LOGIN
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // KRITIK POIN 4: Exclude standar, jangan regex extension liar
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'],
};
