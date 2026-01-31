import { PrismaClient } from "@prisma/client-movie";
import { MovieItem, FilterResponse, SearchParams } from "./types";

const prisma = new PrismaClient();

// 1. GET DYNAMIC FILTERS (Mining dari kolom 'tags' di DB)
export async function getFilters(): Promise<FilterResponse> {
  const allMovies = await prisma.movies.findMany({
    select: { tags: true },
  });

  const genreSet = new Set<string>();
  const yearSet = new Set<string>();
  const countrySet = new Set<string>();

  allMovies.forEach((m) => {
    if (m.tags) {
      m.tags.split(",").forEach((t) => {
        const tag = t.trim();
        if (tag.startsWith("Country-")) {
          countrySet.add(tag.replace("Country-", ""));
        } else if (!isNaN(Number(tag)) && tag.length === 4) {
          yearSet.add(tag);
        } else if (tag !== "Movie" && tag !== "Series" && tag !== "") {
          genreSet.add(tag);
        }
      });
    }
  });

  const toOption = (set: Set<string>) => 
    Array.from(set).sort().map(v => ({ label: v, value: v }));

  return {
    genres: [{ label: "All Genres", value: "" }, ...toOption(genreSet)],
    years: [{ label: "All Years", value: "" }, ...toOption(yearSet).reverse()],
    countries: [{ label: "All Countries", value: "" }, ...toOption(countrySet)],
    types: [
        { label: "All Types", value: "" },
        { label: "Movies", value: "Movie" },
        { label: "Series", value: "Series" }
    ],
  };
}

// 2. GET TITLES WITH FILTER
export async function getMovies(params: SearchParams): Promise<MovieItem[]> {
  const { q, genre, year, type, country, sort } = params;

  // Build Query Dinamis
  const where: any = {};
  const andConditions = [];

  if (q) where.title = { contains: q };
  if (genre) andConditions.push({ tags: { contains: genre } });
  if (year) andConditions.push({ tags: { contains: year } });
  if (country) andConditions.push({ tags: { contains: `Country-${country}` } });
  if (type) andConditions.push({ tags: { contains: type } }); // Asumsi ada tag 'Movie'/'Series'

  if (andConditions.length > 0) where.AND = andConditions;

  // Sorting
  let orderBy: any = { title: 'asc' }; // Default fallback
  // if (sort === 'latest') orderBy = { scraped_at: 'desc' }; // Aktifkan jika kolom scraped_at ada

  const rawData = await prisma.movies.findMany({
    where,
    take: 36, // Load agak banyak biar grid padat
    orderBy,
  });

  // NORMALISASI DATA (Mapping ke UI)
  return rawData.map((m) => {
    const tagList = m.tags ? m.tags.split(",").map(t => t.trim()) : [];
    
    // Logic tebak tahun (dari tag atau regex judul)
    const yearMatch = m.title?.match(/\((\d{4})\)/);
    const inferredYear = yearMatch ? yearMatch[1] : tagList.find(t => !isNaN(Number(t)) && t.length === 4);

    return {
      id: m.url, // ID Paling aman adalah URL aslinya
      title: m.title || "Untitled",
      poster: m.poster || "",
      year: inferredYear || "N/A",
      type: tagList.includes("Series") ? "Series" : "Movie",
      quality: tagList.includes("CAM") ? "CAM" : "HD", // Default HD
      genres: tagList.filter(t => !t.startsWith("Country-") && isNaN(Number(t))),
    };
  });
}
