import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // FIX: Hapus cookie agresif (Expires masa lalu + MaxAge 0)
  response.cookies.set('session', '', { 
    path: '/', 
    expires: new Date(0),
    maxAge: 0, // Double kill buat browser modern
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  
  return response;
}
