// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // 1. Fetch ke sumber asli
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": new URL(url).origin, // Spoof Referer
        "Origin": new URL(url).origin,   // Spoof Origin
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status}` }, 
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("Content-Type") || "";

    // 2. Jika file playlist (m3u8), kita harus REWRITE isinya
    if (contentType.includes("mpegurl") || url.endsWith(".m3u8")) {
      const text = await upstream.text();
      const baseUrl = new URL(url);
      
      // Logic Rewrite: Cari baris yang bukan comment (#) dan wrap dengan proxy
      const newText = text
        .split("\n")
        .map((line) => {
          const l = line.trim();
          if (!l || l.startsWith("#")) return l; // Comment/Tag biarin aja

          // Resolusi URL relative ke absolute
          let absoluteUrl = l;
          if (!l.startsWith("http")) {
            absoluteUrl = new URL(l, baseUrl).toString();
          }

          // Wrap dengan Proxy kita sendiri
          // Ganti 'http://localhost:3000' dengan domain lu nanti secara otomatis via relative path
          return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
        })
        .join("\n");

      return new NextResponse(newText, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 3. Jika file segment (.ts) atau mp4, stream binary langsung (Pass-through)
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000", // Cache agresif buat segment
      },
    });

  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
