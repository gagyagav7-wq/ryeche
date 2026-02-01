// src/moviebox/lib/api.ts
import { prisma } from "@/lib/prisma";
import type { MovieItem, FilterResponse, MoviesResponse, SearchParams } from "./types";

const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// helper parse int aman
function toInt(v: any, def: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : def;
}

// --- 1) GET FILTERS ---
export async function getFilters(): Promise<FilterResponse> {
  // A) Genre dari movie_categories
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

  // B) Tahun dari title (sampling gede biar akurat)
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 3000,
  });

  const yearSet = new Set<string>();
  const regexYear = /\((\d{4})\)/;

  for (const m of moviesRaw) {
    const t = m.title ?? "";
    const match = t.match(regexYear);
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

// --- 2) GET MOVIES (PAGINATION FIX) ---
export async function getMovies(params: SearchParams): Promise<MoviesResponse> {
  const q = (params.q ?? "").toString().trim();
  const genre = (params.genre ?? "").toString().trim();
  const year = (params.year ?? "").toString().trim();

  const page = toInt(params.page, 1);
  const limit = Math.min(toInt(params.limit, 36), 60); // max 60 biar aman
  const skip = (page - 1) * limit;

  // AND clauses (biar gak saling timpa)
  const AND: any[] = [];

  if (q) {
    AND.push({
      title: { contains: q },
    });
  }

  if (year) {
    AND.push({
      title: { contains: `(${year})` },
    });
  }

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

  const whereClause = AND.length ? { AND } : {};

  // total count
  const total = await prisma.movies.count({ where: whereClause });

  // fetch paginated
  const dbData = await prisma.movies.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: { scraped_at: "desc" }, // latest beneran
    select: {
      url: true,
      title: true,
      poster: true,
      synopsis: true,
      iframe_link: true,
      scraped_at: true,
      status: true,
      stream_link: true,
    },
  });

  const items: MovieItem[] = dbData.map((item) => {
    const title = item.title ?? "No Title";
    const yearMatch = title.match(/\((\d{4})\)/);
    const inferredYear = yearMatch?.[1] ?? "N/A";

    return {
      id: item.url,
      title,
      poster: item.poster || FALLBACK_POSTER,
      year: inferredYear,
      type: "Movie",
      quality: "HD",
      rating: "N/A",
      genres: genre ? [genre] : [], // ✅ selalu array
    };
  });

  return {
    items,
    total,
    page,
    limit,
    hasMore: skip + items.length < total,
  };
}
