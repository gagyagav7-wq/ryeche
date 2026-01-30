import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Pastikan punya ini

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const type = searchParams.get("type");

  try {
    const whereClause: any = {};

    // 1. Filter Search
    if (q) whereClause.title = { contains: q, mode: 'insensitive' };
    
    // 2. Filter Tahun (Pastikan nama kolom di DB lu 'year' atau 'releaseYear')
    if (year) whereClause.year = year; // atau whereClause.releaseYear = year;

    // 3. Filter Genre
    if (genre) whereClause.genre = { contains: genre, mode: 'insensitive' };

    // 4. Ambil Data dari Tabel 'movie' (Sesuaikan nama tabel lu!)
    // Kalau error, cek schema.prisma lu, nama tabelnya 'movie', 'film', atau 'posts'?
    const movies = await prisma.movie.findMany({
      where: whereClause,
      take: 50, // Ambil 50 film biar rame
      orderBy: { id: 'desc' }, // Yang baru di atas
    });

    // 5. Normalisasi Data biar Frontend gak bingung
    const results = movies.map((item: any) => ({
      id: item.id || item.slug,
      title: item.title,
      poster: item.poster || item.image || "https://via.placeholder.com/300?text=No+Poster",
      year: String(item.year || "N/A"),
      type: item.type || "movie",
      quality: item.quality || "HD",
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: "Gagal ambil database" }, { status: 500 });
  }
}
