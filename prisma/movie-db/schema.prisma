import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Karena lu pake custom output di schema, pastikan import ini bener.
// Kalau error, coba: import { PrismaClient } from "@prisma/client-movie";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  
  // SEMENTARA KITA DISABLE FILTER INI KARENA KOLOMNYA GAK ADA DI DB LU
  // const genre = searchParams.get("genre");
  // const year = searchParams.get("year");
  // const type = searchParams.get("type");

  try {
    const whereClause: any = {};

    // 1. Filter Search (Title)
    if (q) {
      whereClause.title = { 
        contains: q 
        // Note: SQLite kadang gak support mode: 'insensitive' secara default
        // Kalau error, hapus baris mode: 'insensitive'
      };
    }

    // ⚠️ KITA PAKE 'prisma.movies' (SESUAI SCHEMA LU)
    const dbData = await prisma.movies.findMany({
      where: whereClause,
      take: 50,
      // orderBy: { scraped_at: 'desc' }, // Kalau mau urut berdasarkan scrape terbaru
    });

    // 2. Normalisasi Data (Mapping field DB lu ke Frontend)
    const results = dbData.map((item: any) => ({
      // DB Lu pake 'url' sebagai ID unik
      id: item.url, 
      
      title: item.title || "No Title",
      
      // DB Lu kolomnya 'poster', aman.
      poster: item.poster || "https://via.placeholder.com/300?text=No+Poster",
      
      // Karena DB gak ada tahun, kita ambil dari Judul kalau bisa, atau default
      // Contoh: "Batman (2022)" -> Ambil 2022
      year: item.title?.match(/\((\d{4})\)/)?.[1] || "N/A",
      
      // DB gak ada type, kita anggap semua movie dulu
      type: "movie",
      
      quality: "HD", // Hardcode dulu
      
      // DB Lu kolomnya 'synopsis', frontend butuh buat detail nanti
      overview: item.synopsis || "",
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Gagal ambil database" }, { status: 500 });
  }
}
