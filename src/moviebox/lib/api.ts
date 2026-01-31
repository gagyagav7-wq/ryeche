import { PrismaClient } from "@prisma/client-movie"; // Sesuaikan jika import lu beda
import { MovieItem, FilterResponse, SearchParams } from "./types";

const prisma = new PrismaClient();

// CONFIG: Fallback
const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// --- 1. GET DYNAMIC FILTERS (Versi Safe Mode) ---
export async function getFilters(): Promise<FilterResponse> {
  // A. Ambil Tahun dari Judul (Sampling 500 judul terbaru)
  // Karena kolom 'year' gak ada, kita regex dari title
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 500,
    // orderBy: { scraped_at: 'desc' } // Aktifkan kalau kolom scraped_at ada
  });

  const yearSet = new Set<string>();
  const regexYear = /\((\d{4})\)/; 

  moviesRaw.forEach(m => {
    if (m.title) {
      const match = m.title.match(regexYear);
      if (match) yearSet.add(match[1]);
    }
  });

  const toOption = (arr: string[]) => arr.map(v => ({ label: v, value: v }));

  return {
    // Genre kita kosongin dulu atau kasih dummy biar UI gak rusak
    genres: [
      { label: "All Genres", value: "" },
      { label: "Action", value: "Action" }, // Dummy (Hardcode)
      { label: "Drama", value: "Drama" },   // Dummy (Hardcode)
    ],
    years: [{ label: "All Years", value: "" }, ...toOption(Array.from(yearSet).sort().reverse())],
    countries: [],
    types: [
        { label: "All Types", value: "" },
        { label: "Movies", value: "Movie" },
    ],
  };
}

// --- 2. GET MOVIES (Logic Sesuai Snippet Lu) ---
export async function getMovies(params: SearchParams): Promise<MovieItem[]> {
  const { q, year } = params; // Genre kita ignore dulu

  const whereClause: any = {};

  // 1. Filter Search (Title)
  if (q) {
    whereClause.title = { 
      contains: q 
    };
  }

  // 2. Filter Tahun (Regex logic di query, agak tricky di SQLite biasa, jadi kita filter di JS atau partial match)
  // Paling aman pake 'contains' string "(2024)"
  if (year) {
    whereClause.title = {
      contains: `(${year})`
    };
  }

  // ⚠️ Fetch Data Pake 'prisma.movies'
  const dbData = await prisma.movies.findMany({
    where: whereClause,
    take: 50,
    // orderBy: { title: 'asc' }, 
  });

  // 3. Normalisasi Data (Mapping field DB lu ke Frontend)
  return dbData.map((item: any) => {
    // Logic Extract Tahun dari Judul
    const yearMatch = item.title?.match(/\((\d{4})\)/);
    const inferredYear = yearMatch ? yearMatch[1] : "N/A";

    return {
      id: item.url, // ID Unik
      title: item.title || "No Title",
      poster: item.poster || FALLBACK_POSTER,
      year: inferredYear,
      type: "Movie", // Default
      quality: "HD", // Default
      rating: "N/A",
      genres: ["Movie"], // Default Tag
    };
  });
}
