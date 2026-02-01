// src/moviebox/lib/api.ts
import { prisma } from "@/lib/prisma";
import { MovieItem, FilterResponse, SearchParams, MoviesResponse } from "./types";

const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

function pickFirstGenre(genres: unknown): string {
  // Support: genres=Action, genres=["Action"], genres="Action"
  if (!genres) return "";
  if (Array.isArray(genres)) return String(genres[0] ?? "").trim();
  const s = String(genres).trim();
  // kalau kebawa "A,B,C" ambil pertama
  if (s.includes(",")) return s.split(",")[0].trim();
  return s;
}

// --- 1) GET FILTERS ---
export async function getFilters(): Promise<FilterResponse> {
  // Genre dari table movie_categories
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

  // Tahun dari title "(2024)"
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
    if (match?.[1]) yearSet.add(match[1]);
  }

  const years = Array.from(yearSet).sort().reverse().map((v) => ({ label: v, value: v }));

  return {
    genres: [{ label: "All Genres", value: "" }, ...realGenres],
    years: [{ label: "All Years", value: "" }, ...years],
    countries: [],
    types: [
      { label: "All Types", value: "" },
      { label: "Movies", value: "Movie" },
    ],
  };
}

// --- 2) GET MOVIES (server pagination) ---
export async function getMovies(params: SearchParams): Promise<MoviesResponse> {
  const q = (params.q ?? "").toString().trim();
  // ✅ ini kuncinya: pakai params.genres (sesuai type lu)
  const genre = pickFirstGenre((params as any).genres);
  const year = (params.year ?? "").toString().trim();

  const page = Math.max(1, Number((params as any).page ?? 1));
  const take = 36;
  const skip = (page - 1) * take;

  const AND: any[] = [];

  if (q) {
    AND.push({ title: { contains: q } });
  }

  if (year) {
    AND.push({ title: { contains: `(${year})` } });
  }

  // genre filter via movie_categories -> url IN [...]
  if (genre) {
    const connected = await prisma.movie_categories.findMany({
      where: { category: genre },
      select: { url: true },
    });
    const urls = connected.map((c) => c.url);

    if (urls.length === 0) {
      return { items: [], total: 0, hasMore: false };
    }

    AND.push({ url: { in: urls } });
  }

  const where = AND.length ? { AND } : {};

  // hitung total dulu (buat badge TITLES)
  const total = await prisma.movies.count({ where });

  // ambil items untuk page ini
  const dbData = await prisma.movies.findMany({
    where,
    take,
    skip,
    orderBy: { title: "asc" },
  });

  const items: MovieItem[] = dbData.map((item: any) => {
    const yearMatch = item.title?.match(/\((\d{4})\)/);
    const inferredYear = yearMatch?.[1] ?? "N/A";

    return {
      id: item.url,
      title: item.title || "No Title",
      poster: item.poster || FALLBACK_POSTER,
      year: inferredYear,
      type: "Movie",
      quality: "HD",
      rating: "N/A",
      // ✅ supaya NeoComponents ga error: selalu ada genres
      genres: genre ? [genre] : ["Movie"],
    };
  });

  const hasMore = skip + items.length < total;

  return { items, total, hasMore };
}
