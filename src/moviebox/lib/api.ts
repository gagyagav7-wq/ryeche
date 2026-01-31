// FIX: Import prisma dari singleton biar koneksi gak bocor
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { MovieItem, FilterResponse, SearchParams } from "./types";

const FALLBACK_POSTER = "https://via.placeholder.com/300x450?text=NO+IMG";

// --- helpers ---
function inferYear(title?: string | null) {
  const m = title?.match(/\((\d{4})\)/);
  return m?.[1] ?? "N/A";
}

function clampInt(v: any, def: number, min: number, max: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

/**
 * NOTE:
 * getMovies() sekarang return PAGED RESPONSE:
 * { items, total, page, limit, hasMore }
 * jadi page.tsx lu harus pakai movies.items & movies.total
 */
export type MoviesResponse = {
  items: MovieItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

// --- 1. GET DYNAMIC FILTERS ---
export async function getFilters(): Promise<FilterResponse> {
  // A. Ambil Genre
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

  // B. Ambil Tahun (DB lu total 1660, jadi ambil aja banyak sekalian biar akurat)
  const moviesRaw = await prisma.movies.findMany({
    select: { title: true },
    take: 5000,
    orderBy: { scraped_at: "desc" }, // lebih masuk akal daripada title desc
  });

  const yearSet = new Set<string>();
  const regexYear = /\((\d{4})\)/;

  for (const m of moviesRaw) {
    const t = m.title || "";
    const match = t.match(regexYear);
    if (match) yearSet.add(match[1]);
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

// --- 2. GET MOVIES (PAGINATION + TOTAL + JOIN GENRE) ---
export async function getMovies(params: SearchParams): Promise<MoviesResponse> {
  const q = (params.q || "").trim();
  const genre = (params.genre || "").trim();
  const year = (params.year || "").trim();

  // pagination
  const page = clampInt((params as any).page, 1, 1, 99999);
  const limit = clampInt((params as any).limit, 36, 6, 60); // default 36, max 60
  const offset = (page - 1) * limit;

  // bikin WHERE clause aman (pakai SQL fragment)
  // pakai COALESCE biar kolom nullable tetap bisa di-like
  const whereParts: Prisma.Sql[] = [];

  if (q) {
    whereParts.push(Prisma.sql`COALESCE(m.title,'') LIKE ${"%" + q + "%"}`);
  }

  if (year) {
    // cari pattern "(2024)" di title
    whereParts.push(Prisma.sql`COALESCE(m.title,'') LIKE ${"%(" + year + ")%"}`);
  }

  // kalau mau cuma status OK, hidupin ini:
  // whereParts.push(Prisma.sql`COALESCE(m.status,'') = 'OK'`);

  const whereSql =
    whereParts.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(whereParts, Prisma.sql` AND `)}`
      : Prisma.empty;

  // CASE A: ada genre => JOIN movie_categories
  if (genre) {
    const whereWithGenre = whereParts.length
      ? Prisma.sql`WHERE mc.category = ${genre} AND ${Prisma.join(whereParts, Prisma.sql` AND `)}`
      : Prisma.sql`WHERE mc.category = ${genre}`;

    // total (distinct url)
    const totalRows = await prisma.$queryRaw<{ n: bigint }[]>`
      SELECT COUNT(DISTINCT m.url) as n
      FROM movies m
      JOIN movie_categories mc ON mc.url = m.url
      ${whereWithGenre}
    `;
    const total = Number(totalRows?.[0]?.n ?? 0);

    // items
    const rows = await prisma.$queryRaw<
      {
        url: string;
        title: string | null;
        poster: string | null;
        synopsis: string | null;
        iframe_link: string | null;
        scraped_at: number | null;
        status: string | null;
      }[]
    >`
      SELECT m.url, m.title, m.poster, m.synopsis, m.iframe_link, m.scraped_at, m.status
      FROM movies m
      JOIN movie_categories mc ON mc.url = m.url
      ${whereWithGenre}
      ORDER BY COALESCE(m.scraped_at, 0) DESC, COALESCE(m.title,'') ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const items: MovieItem[] = rows.map((item) => ({
      id: item.url,
      title: item.title || "No Title",
      poster: item.poster || FALLBACK_POSTER,
      year: inferYear(item.title),
      type: "Movie",
      quality: "HD",
      rating: "N/A",
      genres: [genre],
    }));

    return {
      items,
      total,
      page,
      limit,
      hasMore: offset + items.length < total,
    };
  }

  // CASE B: tanpa genre => query langsung movies
  const totalRows = await prisma.$queryRaw<{ n: bigint }[]>`
    SELECT COUNT(*) as n
    FROM movies m
    ${whereSql}
  `;
  const total = Number(totalRows?.[0]?.n ?? 0);

  const rows = await prisma.$queryRaw<
    {
      url: string;
      title: string | null;
      poster: string | null;
      synopsis: string | null;
      iframe_link: string | null;
      scraped_at: number | null;
      status: string | null;
    }[]
  >`
    SELECT m.url, m.title, m.poster, m.synopsis, m.iframe_link, m.scraped_at, m.status
    FROM movies m
    ${whereSql}
    ORDER BY COALESCE(m.scraped_at, 0) DESC, COALESCE(m.title,'') ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const items: MovieItem[] = rows.map((item) => ({
    id: item.url,
    title: item.title || "No Title",
    poster: item.poster || FALLBACK_POSTER,
    year: inferYear(item.title),
    type: "Movie",
    quality: "HD",
    rating: "N/A",
    genres: ["Movie"],
  }));

  return {
    items,
    total,
    page,
    limit,
    hasMore: offset + items.length < total,
  };
}
