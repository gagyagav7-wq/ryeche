// src/moviebox/lib/api.ts

// --- CONFIGURATION ---

// FUNGSI PINTAR: Deteksi otomatis environment
// 1. Client (Browser) -> Pakai Relative Path ("") agar otomatis ngikut domain Cloudflare
// 2. Server (Next.js) -> Pakai Localhost agar fetch internal ngebut
const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; 
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  return "http://localhost:3000"; 
};

const CONFIG = {
  API_BASE: getBaseUrl(),
  
  ENDPOINTS: {
    TITLES: "/api/moviebox/titles",
    FILTERS: "/api/moviebox/filters",
  },
  DEFAULT_PARAMS: {
    limit: 20,
    page: 1,
  },
};

// --- TYPES ---

export type FilterPayload = {
  q?: string;
  genre?: string;
  category?: string;
  year?: string;
  type?: string;
  sort?: "latest" | "hot" | "forYou";
  page?: number;
};

export interface MovieTitle {
  id: string | number;
  title: string;
  poster: string;
  year: string;
  type: "movie" | "series";
  quality: string;
  rating?: string;
  overview?: string;
  backdrop?: string;
}

export interface FilterOption {
  id: string | number;
  label: string;
  value: string;
}

export interface FilterData {
  genres: FilterOption[];
  years: FilterOption[];
  types: FilterOption[];
}

// --- HELPER: URL SLUG EXTRACTOR (PENTING BUAT DB KAMU) ---
// Mengubah "http://178.62.86.69/they-were-witches-2025/" menjadi "they-were-witches-2025"
const getSlugFromUrl = (url: string) => {
  if (!url) return Math.random().toString();
  // Buang trailing slash (garis miring di akhir) kalau ada
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  // Ambil bagian paling belakang setelah garis miring terakhir
  const parts = cleanUrl.split('/');
  return parts[parts.length - 1]; 
};

// --- NORMALIZERS (Fallbacks & Mapper) ---

const normalizeTitle = (item: any): MovieTitle => {
  if (!item) return {} as MovieTitle;
  
  // 1. AMBIL ID BERSIH
  // Prioritas: field "URL ID" (DB Kamu) -> field "id" -> field "slug"
  const rawId = item["URL ID"] || item.id || item.slug;
  const cleanId = getSlugFromUrl(String(rawId));

  return {
    id: cleanId, 
    
    // Mapper Field Database Kamu
    title: item["Judul"] || item.title || item.name || "Untitled",
    poster: item["Poster Link"] || item.poster || item.thumbnail || "/placeholder.jpg",
    
    // Logic Tahun: Ambil dari field "Judul" (misal "(2025)") kalau field year kosong
    year: String(item.year || item["Judul"]?.match(/\((\d{4})\)/)?.[1] || item.releaseYear || "2025"),
    
    type: (item.type?.toLowerCase() === "series" || item.isSeries) ? "series" : "movie",
    quality: item.quality || "HD",
    rating: item.rating ? String(item.rating) : undefined,
    
    // Detail tambahan
    overview: item["Sinopsis"] || item.overview || "No description available.",
    backdrop: item["Video Link"] || item.backdrop || item.poster,
  };
};

// --- FETCHERS ---

// Helper untuk build query string
const buildQuery = (params: FilterPayload) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

export const MovieAPI = {
  // 1. Fetch Filters
  getFilters: async (): Promise<FilterData> => {
    try {
      const res = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.FILTERS}`, {
        next: { revalidate: 3600 }
      });
      
      if (!res.ok) throw new Error("Failed to fetch filters");
      const data = await res.json();

      return {
        genres: data.genres?.map((g: any) => ({
          id: g.id || g.slug || g.value,
          label: g.label || g.name,
          value: g.value || g.slug || g.id,
        })) || [],
        years: data.years?.map((y: any) => ({
          id: y.id || y.value,
          label: String(y.label || y.value),
          value: String(y.value),
        })) || [],
        types: data.types || [
            { id: 'movie', label: 'Movies', value: 'movie' },
            { id: 'series', label: 'Series', value: 'series' }
        ]
      };
    } catch (error) {
      console.error("Filter Fetch Error:", error);
      return { genres: [], years: [], types: [] };
    }
  },

  // 2. Fetch Titles
  getTitles: async (params: FilterPayload, signal?: AbortSignal): Promise<MovieTitle[]> => {
    const queryString = buildQuery({ ...CONFIG.DEFAULT_PARAMS, ...params });
    const url = `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.TITLES}?${queryString}`;

    try {
      const res = await fetch(url, { signal, cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to fetch titles");
      
      const rawData = await res.json();
      
      const list = Array.isArray(rawData) 
        ? rawData 
        : rawData.results || rawData.data || rawData.items || [];

      return list.map(normalizeTitle);
    } catch (error: any) {
      if (error.name === "AbortError") throw error;
      console.error("Titles Fetch Error:", error);
      return [];
    }
  },

  // 3. Fetch Detail
  getDetail: async (slug: string): Promise<MovieTitle | null> => {
    // Kita request ke API Titles dengan parameter ID/Slug
    const url = `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.TITLES}?id=${slug}`; 
    
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      
      const data = await res.json();
      // Ambil item pertama dari hasil pencarian
      const item = Array.isArray(data.results) ? data.results[0] : data;
      
      if (!item) return null;
      return normalizeTitle(item);
    } catch (error) {
      console.error("Detail Fetch Error:", error);
      return null;
    }
  }
};
