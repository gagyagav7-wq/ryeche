// src/moviebox/lib/api.ts
import { prisma } from "@/lib/prisma";
import type { MovieItem, FilterResponse, SearchParams, MoviesResponse } from "./types";

const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// runtime guard: normalize genres param dari URL jadi array string
function normalizeGenres(input: any): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    // bisa ["Action", "Comedy"] atau ["Action,Comedy"]
    return input
      .flatMap((v) => String(v).split(","))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  // single value: "Action" atau "Action,Comedy"
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ambil genre utama (karena schema movie_categories = 1 url ↔ banyak category, tapi UI lu filter 1 aja)
function pickFirstGenre(genres: string[]): string {
  return (genres?.[0] ?? "").trim();
}

// parse number dari string|number, kasih default + clamp
function parseNum(v: any, def: number, min: number, max: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, n));
}

// --- 1) GET FILTERS ---
export async function getFilters(): Promise<FilterResponse> {
  // A) Genres
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

  // B) Years (extract dari title)
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 2500,
    orderBy: { title: "desc" },
  });

  const yearSet = new Set<string>();
  const regexYear = /\((\d{4})\)/;

  for (const m of moviesRaw) {
    if (!m.title) continue;
    const match = m.title.match(regexYear);
    if (match?.[1]) yearSet.add(match[1]);
  }

  const years = Array.from(yearSet)
    .sort()
    .reverse()
    .map((v) => ({ label: v, value: v }));

  return {
    genres: [{ label: "All Genres", value: "" }, ...realGenres],
    years: [{ label: "All Years", value: "" }, ...years],
    countries: [{ label: "All Countries", value: "" }], // placeholder
    types: [
      { label: "All Types", value: "" },
      { label: "Movies", value: "Movie" },
    ],
  };
}

// --- 2) GET MOVIES (pagination) ---
export async function getMovies(params: SearchParams): Promise<MoviesResponse> {
  // ✅ runtime: params dari Next bisa beda sama type, jadi kita normalize
  const q = (params?.q ?? "").toString().trim();

  // params.genres type lu wajib, tapi runtime bisa undefined.
  const genresArr = normalizeGenres((params as any)?.genres);
  const genre = pickFirstGenre(genresArr);

  const year = (params?.year ?? "").toString().trim();

  const page = parseNum((params as any)?.page, 1, 1, 9999);
  const limit = parseNum((params as any)?.limit, 36, 12, 96);
  const skip = (page - 1) * limit;

  const AND: any[] = [];

  // 1) search
  if (q) {
    AND.push({ title: { contains: q } });
  }

  // 2) year filter dari title "(2024)"
  if (year) {
    AND.push({ title: { contains: `(${year})` } });
  }

  // 3) genre filter via movie_categories
  if (genre) {
    const connected = await prisma.movie_categories.findMany({
      where: { category: genre },
      select: { url: true },
    });

    const urls = connected.map((c) => c.url);

    if (urls.length === 0) {
      return { items: [], total: 0, page, limit, hasMore: false };
    }

    AND.push({ url: { in: urls } });
  }

  const where = AND.length ? { AND } : {};

  // total count buat badge
  const total = await prisma.movies.count({ where });

  // ambil data page ini
  const dbData = await prisma.movies.findMany({
    where,
    take: limit,
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
      // ✅ wajib string[] sesuai type lu
      genres: genre ? [genre] : ["Movie"],
    };
  });

  const hasMore = skip + items.length < total;

  return { items, total, page, limit, hasMore };
}
