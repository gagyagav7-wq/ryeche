import { PrismaClient } from "@prisma/client-movie";
import { MovieItem, FilterResponse, SearchParams } from "./types";

const prisma = new PrismaClient();
const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// --- 1. GET DYNAMIC FILTERS (REAL DB) ---
export async function getFilters(): Promise<FilterResponse> {
  // A. Ambil Genre ASLI dari tabel movie_categories
  // Kalau tabel ini kosong, tombol genre bakal ilang (kecuali 'All Genres')
  let realGenres: { label: string; value: string }[] = [];
  
  try {
    const categoriesRaw = await prisma.movie_categories.findMany({
      select: { category: true },
      distinct: ['category'], // Ambil nama kategori unik aja
      orderBy: { category: 'asc' }
    });
    
    realGenres = categoriesRaw.map(c => ({ label: c.category, value: c.category }));
  } catch (e) {
    console.error("Gagal ambil kategori, pastikan tabel 'movie_categories' ada.");
  }

  // B. Ambil Tahun dari Judul (Sampling 500 film)
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 500,
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
    genres: [{ label: "All Genres", value: "" }, ...realGenres],
    years: [{ label: "All Years", value: "" }, ...toOption(Array.from(yearSet).sort().reverse())],
    countries: [],
    types: [
        { label: "All Types", value: "" },
        { label: "Movies", value: "Movie" },
    ],
  };
}

// --- 2. GET MOVIES (FILTER AKTIF) ---
export async function getMovies(params: SearchParams): Promise<MovieItem[]> {
  const { q, genre, year } = params;

  const whereClause: any = {};

  // 1. FILTER SEARCH
  if (q) {
    whereClause.title = { contains: q };
  }

  // 2. FILTER GENRE (NEW! 🔥)
  if (genre) {
    // Cari URL film yang punya kategori ini
    const connectedMovies = await prisma.movie_categories.findMany({
      where: { category: genre },
      select: { url: true }
    });
    
    const validUrls = connectedMovies.map(c => c.url);
    
    // Syarat: URL film harus ada di daftar validUrls
    if (validUrls.length > 0) {
      whereClause.url = { in: validUrls };
    } else {
      // Kalau genre dipilih tapi gak ada filmnya, paksa return kosong
      // (url must be impossible value)
      whereClause.url = "NO_MATCH"; 
    }
  }

  // 3. FILTER TAHUN
  if (year) {
    whereClause.title = { contains: `(${year})` };
  }

  // Fetch Data
  const dbData = await prisma.movies.findMany({
    where: whereClause,
    take: 36,
  });

  // Normalisasi Data
  return dbData.map((item: any) => {
    const yearMatch = item.title?.match(/\((\d{4})\)/);
    const inferredYear = yearMatch ? yearMatch[1] : "N/A";

    return {
      id: item.url,
      title: item.title || "No Title",
      poster: item.poster || FALLBACK_POSTER,
      year: inferredYear,
      type: "Movie",
      quality: "HD",
      rating: "N/A",
      // Kita set default aja biar loading cepet
      genres: genre ? [genre] : ["Movie"], 
    };
  });
}
