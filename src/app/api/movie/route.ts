// src/app/api/movie/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "home";
  const slug = searchParams.get("slug") || "";
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  // URL Scraper asli di VPS lu (Misal scraper lu jalan di port 5000)
  // Ganti localhost:5000 jadi IP_VPS:PORT_SCRAPER lu
  const SCRAPER_URL = "http://localhost:5000"; 

  try {
    let targetUrl = `${SCRAPER_URL}/api/rebahin/${action}?page=${page}`;
    if (action === 'detail') targetUrl = `${SCRAPER_URL}/api/rebahin/detail/${slug}`;
    if (action === 'search') targetUrl = `${SCRAPER_URL}/api/rebahin/search?q=${q}`;
    if (action === 'play') targetUrl = `${SCRAPER_URL}/api/rebahin/play/${slug}?ep=${page}`;

    const res = await fetch(targetUrl);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
