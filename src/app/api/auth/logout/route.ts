import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Hapus cookie dengan menimpa nilai kosong & expired date masa lalu
  // Wajib set path: '/' agar kena di semua route
  response.cookies.set('session', '', { 
    path: '/', 
    expires: new Date(0),
    httpOnly: true 
  });
  
  return response;
}
