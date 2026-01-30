import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Ambil params dari URL
  const q = searchParams.get("q") || "";
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const type = searchParams.get("type");
  const sort = searchParams.get("sort") || "latest"; // latest | hot | forYou

  try {
    // --- BUILD PRISMA QUERY ---
    // const whereClause: any = {};
    
    // 1. Search
    // if (q) {
    //   whereClause.OR = [
    //     { title: { contains: q, mode: 'insensitive' } },
    //     { overview: { contains: q, mode: 'insensitive' } }
    //   ];
    // }

    // 2. Filters
    // if (genre) whereClause.genre = { contains: genre };
    // if (year) whereClause.year = year;
    // if (type) whereClause.type = type;

    // 3. Sorting
    // let orderBy = {};
    // if (sort === 'latest') orderBy = { createdAt: 'desc' };
    // if (sort === 'hot') orderBy = { views: 'desc' }; // Asumsi ada field views
    // if (sort === 'forYou') orderBy = { rating: 'desc' };

    // const movies = await prisma.movie.findMany({
    //   where: whereClause,
    //   orderBy: orderBy,
    //   take: 20, // Limit
    // });

    // --- MOCK RESPONSE (Supaya frontend kamu jalan dulu) ---
    // Hapus bagian ini kalau prisma sudah connect
    let mockMovies = [
      { id: 1, title: "100 Yards", year: "2024", type: "movie", poster: "https://image.tmdb.org/t/p/w500/m0gM9jE1JKCcqfvbuLXql8Wf1cv.jpg", genre: "Action", quality: "HD" },
      { id: 2, title: "12th Fail", year: "2023", type: "movie", poster: "https://image.tmdb.org/t/p/w500/m0gM9jE1JKCcqfvbuLXql8Wf1cv.jpg", genre: "Drama", quality: "HD" },
      { id: 3, title: "Fallout", year: "2024", type: "series", poster: "https://image.tmdb.org/t/p/w500/m0gM9jE1JKCcqfvbuLXql8Wf1cv.jpg", genre: "Action", quality: "WEB" },
      // ... tambah data dummy lain
    ];

    // Filter Logic Manual (Simulation)
    if (q) mockMovies = mockMovies.filter(m => m.title.toLowerCase().includes(q.toLowerCase()));
    if (genre) mockMovies = mockMovies.filter(m => m.genre.includes(genre));
    if (year) mockMovies = mockMovies.filter(m => m.year === year);
    if (type) mockMovies = mockMovies.filter(m => m.type === type);

    return NextResponse.json({ results: mockMovies });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
