import { PrismaClient } from "@prisma/client-movie";
import { MovieItem, FilterResponse, SearchParams } from "./types";

const prisma = new PrismaClient();

// CONFIG: Fallback Poster
const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// --- 1. GET DYNAMIC FILTERS ---
// Ambil Genre dari tabel 'movie_categories' & Tahun dari Regex Judul
export async function getFilters(): Promise<FilterResponse> {
  // A. Ambil Genre Unik dari tabel kategori
  // Pastikan model 'movie_categories' ada di schema.prisma lu!
  const categoriesRaw = await prisma.movie_categories.findMany({
    select: { category: true },
    distinct: ['category'], // Fitur prisma buat ambil yg unik aja
    orderBy: { category: 'asc' }
  });

  // B. Ambil Tahun dari Judul Film (Sampling 500 film aja biar cepet)
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 500, 
    orderBy: { title: 'desc' } // Asumsi judul baru ada tahun baru
  });

  const yearSet = new Set<string>();
  const regexYear = /\((\d{4})\)/; // Cari pola "(2024)"

  moviesRaw.forEach(m => {
    if (m.title) {
      const match = m.title.match(regexYear);
      if (match) yearSet.add(match[1]);
    }
  });

  const toOption = (arr: string[]) => arr.map(v => ({ label: v, value: v }));
  
  return {
    genres: [{ label: "All Genres", value: "" }, ...toOption(categoriesRaw.map(c => c.category))],
    years: [{ label: "All Years", value: "" }, ...toOption(Array.from(yearSet).sort().reverse())],
    countries: [], // Skip dulu karena gak ada data negara di DB lu
    types: [
        { label: "All Types", value: "" },
        { label: "Movies", value: "Movie" }, // Default anggap semua movie
    ],
  };
}

// --- 2. GET TITLES WITH FILTER ---
export async function getMovies(params: SearchParams): Promise<MovieItem[]> {
  const { q, genre, year, sort } = params;

  let where: any = {};

  // A. Filter Search Judul
  if (q) {
    where.title = { contains: q };
  }

  // B. Filter Genre (Agak tricky karena beda tabel)
  // Kita cari dulu URL film yg punya genre tersebut
  if (genre) {
    const movieUrlsWithGenre = await prisma.movie_categories.findMany({
      where: { category: genre },
      select: { url: true }
    });
    const urls = movieUrlsWithGenre.map(item => item.url);
    
    // Tambahkan kondisi: URL film harus ada di daftar URL genre tsb
    where.url = { in: urls }; 
  }

  // C. Filter Tahun (Pake contains di judul karena gak ada kolom tahun)
  if (year) {
    // Cari judul yg mengandung "(2024)"
    where.title = { contains: `(${year})` };
  }

  // Sorting Logic
  // Karena gak ada 'created_at', kita pake sort title default
  let orderBy: any = { title: 'asc' }; 
  // if (sort === 'latest') ... (skip karena gak ada kolom tanggal)

  const rawData = await prisma.movies.findMany({
    where,
    take: 36,
    orderBy,
  });

  // NORMALISASI OUTPUT
  return rawData.map((m) => {
    // Ekstrak tahun dari judul
    const yearMatch = m.title?.match(/\((\d{4})\)/);
    const inferredYear = yearMatch ? yearMatch[1] : "N/A";

    return {
      id: m.url, 
      title: m.title || "Untitled",
      poster: m.poster || FALLBACK_POSTER,
      year: inferredYear,
      type: "Movie", // Default
      quality: "HD", // Default
      rating: "N/A",
      genres: ["Movie"], // Kita hardcode dulu biar loading cepet (gak perlu fetch kategori per item)
    };
  });
}
