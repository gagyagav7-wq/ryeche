// FIX: Import prisma dari singleton biar koneksi gak bocor
import { prisma } from "@/lib/prisma"; 
import { MovieItem, FilterResponse, SearchParams } from "./types";

const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// --- 1. GET DYNAMIC FILTERS ---
export async function getFilters(): Promise<FilterResponse> {
  // A. Ambil Genre (Optimized: Sort di JS)
  let realGenres: { label: string; value: string }[] = [];
  try {
    const categoriesRaw = await prisma.movie_categories.findMany({
      select: { category: true },
      distinct: ['category'], 
    });
    
    // Sort manual di JS lebih aman daripada distinct + orderBy di beberapa DB
    realGenres = categoriesRaw
      .map(c => c.category)
      .sort((a, b) => a.localeCompare(b))
      .map(cat => ({ label: cat, value: cat }));

  } catch (e) {
    console.error("Gagal ambil kategori:", e);
  }

  // B. Ambil Tahun (Naikin limit sampling jadi 2000 biar lebih akurat)
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 2000, 
    orderBy: { title: 'desc' } // Biar yg keambil judul-judul baru dulu
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

// --- 2. GET MOVIES (FIXED LOGIC) ---
export async function getMovies(params: SearchParams): Promise<MovieItem[]> {
  const { q, genre, year } = params;

  // FIX: Gunakan array AND supaya filter TIDAK saling menimpa
  const AND: any[] = [];

  // 1. FILTER SEARCH
  if (q) {
    AND.push({ 
      title: { contains: q } // Tambah mode: 'insensitive' kalau DB support
    });
  }

  // 2. FILTER TAHUN
  if (year) {
    AND.push({ 
      title: { contains: `(${year})` } 
    });
  }

  // 3. FILTER GENRE
  if (genre) {
    const connectedMovies = await prisma.movie_categories.findMany({
      where: { category: genre },
      select: { url: true }
    });
    
    const validUrls = connectedMovies.map(c => c.url);
    
    if (validUrls.length > 0) {
      AND.push({ url: { in: validUrls } });
    } else {
      // Kalau genre dipilih tapi gak ada filmnya, return kosong langsung (hemat resource)
      return [];
    }
  }

  // Gabungkan semua kondisi
  const whereClause = AND.length > 0 ? { AND } : {};

  // Fetch Data
  const dbData = await prisma.movies.findMany({
    where: whereClause,
    take: 36,
    orderBy: { title: 'asc' }, // Default sort biar stabil
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
      // Set default genre sesuai filter biar UX nyambung
      genres: genre ? [genre] : ["Movie"], 
    };
  });
}
