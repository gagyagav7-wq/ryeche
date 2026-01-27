import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // FIX: Hapus cookie dengan atribut yang sama persis saat dibuat
  response.cookies.set('session', '', { 
    path: '/', 
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' // Wajib https di production
  });
  
  return response;
}
