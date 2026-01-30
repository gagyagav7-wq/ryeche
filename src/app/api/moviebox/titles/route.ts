import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  
  // Karena kolom genre/year gak ada di DB kamu, kita skip dulu filter itu biar gak error
  // const genre = searchParams.get("genre");

  try {
    const whereClause: any = {};

    // 1. Filter Search (Title)
    if (q) {
      whereClause.title = { 
        contains: q 
      };
    }

    // 2. QUERY DATABASE (Pake 'movies' pake 's')
    const dbData = await prisma.movies.findMany({
      where: whereClause,
      take: 50,
      // orderBy: { scraped_at: 'desc' }, // Bisa aktifin ini kalau mau urut yang baru di-scrape
    });

    // 3. Normalisasi Data (Mapping field DB lu ke Frontend)
    const results = dbData.map((item: any) => ({
      // DB Lu pake 'url' sebagai ID unik
      id: item.url, 
      
      title: item.title || "No Title",
      
      // DB Lu kolomnya 'poster', aman.
      poster: item.poster || "https://via.placeholder.com/300?text=No+Poster",
      
      // Karena DB gak ada tahun, kita coba ambil tahun dari teks Judul (misal "Film (2024)")
      year: item.title?.match(/\((\d{4})\)/)?.[1] || "N/A",
      
      // Default value karena gak ada di DB
      type: "movie",
      quality: "HD", 
      
      // DB Lu kolomnya 'synopsis', frontend butuh buat detail nanti
      overview: item.synopsis || "",
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Gagal ambil database" }, { status: 500 });
  }
}
