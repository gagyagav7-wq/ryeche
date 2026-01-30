import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Pastikan import prisma client kamu benar

export async function GET() {
  try {
    // CONTOH LOGIC PRISMA (Sesuaikan nama model kamu, misal: 'movie')
    // const movies = await prisma.movie.findMany({
    //   select: { genre: true, year: true, type: true }
    // });

    // MOCK DATA (Ganti dengan logic DB di atas nanti)
    // Disini kita memproses data mentah DB untuk mendapatkan unik values
    
    const mockDB = [
      { genre: "Action", year: 2024, type: "movie" },
      { genre: "Drama", year: 2023, type: "series" },
      // ... bayangkan ini ribuan data
    ];

    // 1. Extract Unique Genres
    // Kalau di DB genre dipisah koma "Action, Drama", perlu di split dulu
    const genresSet = new Set<string>();
    const yearsSet = new Set<string>();
    
    // Logic extraction (Sesuaikan dengan bentuk data DB kamu)
    // movies.forEach(m => { ... })
    
    // Hardcoded responses sesuai request "DINAMIS DARI API"
    // Nanti ganti dengan: await prisma.genre.findMany()
    const genres = [
      { id: "action", label: "Action", value: "Action" },
      { id: "romance", label: "Romance", value: "Romance" },
      { id: "horror", label: "Horror", value: "Horror" },
      { id: "comedy", label: "Comedy", value: "Comedy" },
    ];

    const years = [
      { id: "2024", label: "2024", value: "2024" },
      { id: "2023", label: "2023", value: "2023" },
      { id: "2022", label: "2022", value: "2022" },
    ];

    return NextResponse.json({
      genres,
      years,
      types: [
        { id: "movie", label: "Movies", value: "movie" },
        { id: "series", label: "Series", value: "series" }
      ]
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to load filters" }, { status: 500 });
  }
}
