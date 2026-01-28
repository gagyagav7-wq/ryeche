import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;
const SECRET_KEY = rawSecret ? new TextEncoder().encode(rawSecret) : null;

// Helper: Cek status Auth
async function checkAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('token')?.value;

  if (!token) return false;

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
    // LOG DEBUG (Dev Only) - Poin Kritik No. 6
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUTH FAIL] Token exists but verify failed (Expired/Invalid)');
    }
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthed = await checkAuth(req);

  // LOG DEBUGGER ROOT
  if (path === '/') {
    // Poin Kritik No. 5: Kita cek apakah cookie kebaca di Root
    const tokenCookie = req.cookies.get('token');
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MIDDLEWARE ROOT] Cookie 'token' found? ${!!tokenCookie}`);
      console.log(`[MIDDLEWARE ROOT] Is Authenticated? ${isAuthed}`);
    }
  }

  // 1. ROOT GATE
  if (path === '/') {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      // Poin Kritik No. 2: Redirect spesifik ke /dracin/latest
      return NextResponse.redirect(new URL('/dracin/latest', req.url));
    }
  }

  // 2. PROTEKSI DASHBOARD
  if (path.startsWith('/dashboard')) {
    if (!isAuthed) {
      const loginUrl = new URL('/login', req.url);
      // Poin Kritik No. 3: Simpan full path + query
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. PROTEKSI LOGIN
  if ((path === '/login' || path === '/register') && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Poin Kritik No. 4: Exclude manifest, opengraph, twitter-image, robots, sitemap
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.png|.*\\.jpg|.*\\.svg).*)'
  ],
};
