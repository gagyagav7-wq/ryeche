import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

async function checkAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token')?.value;

  // Kalau token gak ada, langsung return false
  if (!token) return false;

  // Fail-safe: Kalau secret hilang, anggap guest (Log warning di dev)
  if (!SECRET_KEY) {
    if (process.env.NODE_ENV !== 'production') {
       console.warn("[WARN] JWT_SECRET missing! Auth treated as Guest.");
    }
    return false;
  }

  try {
    await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] });
    return true; 
  } catch (err) {
    // Token ada tapi invalid/expired
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUTH FAIL] Token exists but verify failed');
    }
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // LOG DEBUG (Dev Only) - Cek cookie apa aja yang nyampe ke server
  if (process.env.NODE_ENV !== 'production' && path === '/') {
    console.log("------------------------------------------------");
    console.log("[MIDDLEWARE ROOT] Incoming Cookies:", req.cookies.getAll().map(c => c.name));
    console.log("------------------------------------------------");
  }

  const isAuthed = await checkAuth(req);

  // 1. ROOT GATE
  if (path === '/') {
    // Kalau authed ke dashboard, kalau guest ke landing latest
    return isAuthed 
      ? NextResponse.redirect(new URL('/dashboard', req.url))
      : NextResponse.redirect(new URL('/dracin/latest', req.url));
  }

  // 2. PROTEKSI DASHBOARD
  if (path.startsWith('/dashboard') && !isAuthed) {
    const loginUrl = new URL('/login', req.url);
    // Simpan full path + query buat callback
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 3. PROTEKSI LOGIN (Redirect balik kalau udah login)
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher standard & aman (tanpa regex file extension liar)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)'],
};
