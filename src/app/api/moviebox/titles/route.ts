import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Ambil params dari URL
  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const type = searchParams.get("type");
  const sort = searchParams.get("sort") || "latest"; 

  try {
    // --- [NANTI] UNCOMMENT INI KALAU UDAH PAKE DATABASE ---
    /*
    const whereClause: any = {};
    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { overview: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (genre) whereClause.genre = { contains: genre };
    if (year) whereClause.year = year;
    if (type) whereClause.type = type;

    const movies = await prisma.movie.findMany({
      where: whereClause,
      take: 20,
    });
    return NextResponse.json({ results: movies });
    */

    // --- [SEKARANG] MOCK DATA DENGAN GAMBAR HIDUP ---
    let mockMovies = [
      { 
        id: "100-yards", 
        title: "100 Yards", 
        year: "2024", 
        type: "movie", 
        // Gambar Avengers buat tes doang (karena link TMDB lu mati)
        poster: "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg", 
        genre: "Action", 
        quality: "HD" 
      },
      { 
        id: "12th-fail", 
        title: "12th Fail", 
        year: "2023", 
        type: "movie", 
        poster: "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg", 
        genre: "Drama", 
        quality: "HD" 
      },
      { 
        id: "fallout", 
        title: "Fallout", 
        year: "2024", 
        type: "series", 
        poster: "https://upload.wikimedia.org/wikipedia/en/a/ae/Fallout_%282024_TV_series%29_poster.jpg", 
        genre: "Sci-Fi", 
        quality: "WEB" 
      },
      { 
        id: "shogun", 
        title: "Shogun", 
        year: "2024", 
        type: "series", 
        poster: "https://upload.wikimedia.org/wikipedia/en/6/62/Sh%C5%8Dgun_TV_miniseries_poster.jpg", 
        genre: "History", 
        quality: "4K" 
      },
    ];

    // --- LOGIC FILTER MANUAL (Biar Search Jalan di Mock Data) ---
    
    // 1. Filter Search (Case Insensitive)
    if (q) {
      const lowerQ = q.toLowerCase();
      mockMovies = mockMovies.filter(m => 
        m.title.toLowerCase().includes(lowerQ)
      );
    }

    // 2. Filter Genre (Case Insensitive)
    if (genre) {
      mockMovies = mockMovies.filter(m => 
        m.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    // 3. Filter Year
    if (year) {
      mockMovies = mockMovies.filter(m => m.year === year);
    }

    // 4. Filter Type
    if (type) {
      mockMovies = mockMovies.filter(m => m.type === type);
    }

    // 5. Sorting Sederhana
    if (sort === 'latest') {
      // Mock sort (balik urutan array aja buat demo)
      mockMovies.reverse();
    }

    return NextResponse.json({ results: mockMovies });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
