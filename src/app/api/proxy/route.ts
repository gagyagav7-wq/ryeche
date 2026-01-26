import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Ambil path yang mau ditembak (contoh: /detailAndAllEpisode?id=4885)
  const path = searchParams.get('path');
  const query = searchParams.get('query'); // Buat search

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  // Base URL Sansekai
  const BASE_URL = 'https://api.sansekai.my.id/api/flickreels';
  
  // Rakit URL target
  // Kalau ada query search, tempel juga
  const targetUrl = query 
    ? `${BASE_URL}${path}?query=${query}`
    : `${BASE_URL}${path}`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        // PENTING: Kita "bohong" dikit, pura-pura request dari browser biasa
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        // Kadang API ngecek Referer, kosongin atau samain kalau perlu
        'Referer': 'https://api.sansekai.my.id/' 
      },
      next: { revalidate: 3600 } // Cache 1 jam biar gak nyepam server dia
    });

    if (!res.ok) throw new Error('API Error');

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Gagal fetch ke Sansekai' }, { status: 500 });
  }
}
