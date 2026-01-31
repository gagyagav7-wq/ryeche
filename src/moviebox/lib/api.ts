import { prisma } from "@/lib/prisma";
import { MovieItem, FilterResponse, SearchParams, MoviesResponse } from "./types";

const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// helper parse angka dari query
function toInt(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// --- 1) GET FILTERS ---
export async function getFilters(): Promise<FilterResponse> {
  // A) genres
  let realGenres: { label: string; value: string }[] = [];
  try {
    const categoriesRaw = await prisma.movie_categories.findMany({
      select: { category: true },
      distinct: ["category"],
    });

    realGenres = categoriesRaw
      .map((c) => c.category)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((cat) => ({ label: cat, value: cat }));
  } catch (e) {
    console.error("Gagal ambil kategori:", e);
  }

  // B) years (ambil dari title "(2024)")
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 2000,
    orderBy: { title: "desc" },
  });

  const yearSet = new Set<string>();
  const regexYear = /\((\d{4})\)/;

  for (const m of moviesRaw) {
    if (!m.title) continue;
    const match = m.title.match(regexYear);
    if (match) yearSet.add(match[1]);
  }

  const years = Array.from(yearSet).sort().reverse().map((v) => ({ label: v, value: v }));

  return {
    genres: [{ label: "All Genres", value: "" }, ...realGenres],
    years: [{ label: "All Years", value: "" }, ...years],
    countries: [{ label: "All Countries", value: "" }], // placeholder (DB lu belum ada)
    types: [
      { label: "All Types", value: "" },
      { label: "Movies", value: "Movie" },
    ],
  };
}

// --- 2) GET MOVIES (PAGINATED) ---
export async function getMovies(params: SearchParams): Promise<MoviesResponse> {
  const q = (params.q ?? "").toString().trim();
  const genre = (params.genre ?? "").toString().trim();
  const year = (params.year ?? "").toString().trim();

  // pagination
  const page = Math.max(1, toInt(params.page, 1));
  const limit = Math.min(60, Math.max(6, toInt(params.limit, 36)));
  const skip = (page - 1) * limit;

  const AND: any[] = [];

  // 1) search
  if (q) {
    AND.push({
      title: { contains: q },
    });
  }

  // 2) year from title
  if (year) {
    AND.push({
      title: { contains: `(${year})` },
    });
  }

  // 3) genre via movie_categories table
  if (genre) {
    const connected = await prisma.movie_categories.findMany({
      where: { category: genre },
      select: { url: true },
    });

    const validUrls = connected.map((c) => c.url);
    if (validUrls.length === 0) {
      return { items: [], total: 0, page, limit, hasMore: false };
    }
    AND.push({ url: { in: validUrls } });
  }

  const whereClause = AND.length > 0 ? { AND } : {};

  // total count (buat badge + hasMore)
  const total = await prisma.movies.count({ where: whereClause });

  // data page ini
  const dbData = await prisma.movies.findMany({
    where: whereClause,
    take: limit,
    skip,
    orderBy: { scraped_at: "desc" }, // lebih masuk akal untuk "Fresh Drops"
  });

  const items: MovieItem[] = dbData.map((item: any) => {
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
      genres: genre ? [genre] : ["Movie"],
    };
  });

  const hasMore = skip + items.length < total;

  return { items, total, page, limit, hasMore };
}
