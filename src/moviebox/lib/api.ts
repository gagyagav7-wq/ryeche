// src/moviebox/lib/api.ts

// --- CONFIGURATION ---
const CONFIG = {
  // Gunakan Localhost saat dev, atau Environment Variable saat deploy
  // PENTING: Untuk Server Component (Detail Page), harus Absolute URL (http://...)
  API_BASE: process.env.NEXT_PUBLIC_SITE_URL || "Https://remote-concentration-streaming-models.trycloudflare.com", 
  
  ENDPOINTS: {
    TITLES: "/api/moviebox/titles",   // Mengarah ke file route.ts yang kita buat
    FILTERS: "/api/moviebox/filters", // Mengarah ke file route.ts yang kita buat
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
  category?: string; // movie | series
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
  // Optional extra fields for detail
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

// --- NORMALIZERS (Fallbacks) ---

const normalizeTitle = (item: any): MovieTitle => {
  if (!item) return {} as MovieTitle; // Safety check
  
  return {
    id: item.id || item._id || item.slug || Math.random().toString(),
    title: item.title || item.name || "Untitled",
    poster: item.poster || item.thumbnail || item.cover || item.image || "/placeholder.jpg",
    year: String(item.year || item.releaseYear || item.date || "N/A"),
    type: (item.type?.toLowerCase() === "series" || item.isSeries) ? "series" : "movie",
    quality: item.quality || "HD",
    rating: item.rating ? String(item.rating) : undefined,
    overview: item.overview || item.description || "No description available.",
    backdrop: item.backdrop || item.poster || "/placeholder-wide.jpg",
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
  // 1. Fetch Filters (Genre, Year, Type)
  getFilters: async (): Promise<FilterData> => {
    try {
      // Fetch ke internal API /api/moviebox/filters
      const res = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.FILTERS}`, {
        next: { revalidate: 3600 } // Cache 1 jam kalau di server
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

  // 2. Fetch List Titles (Search + Filter)
  getTitles: async (params: FilterPayload, signal?: AbortSignal): Promise<MovieTitle[]> => {
    const queryString = buildQuery({ ...CONFIG.DEFAULT_PARAMS, ...params });
    const url = `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.TITLES}?${queryString}`;

    try {
      const res = await fetch(url, { signal, cache: 'no-store' }); // No store agar search selalu fresh
      if (!res.ok) throw new Error("Failed to fetch titles");
      
      const rawData = await res.json();
      
      // Normalisasi response shape
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

  // 3. Fetch Single Detail (Untuk Halaman [slug])
  getDetail: async (slug: string): Promise<MovieTitle | null> => {
    // Kita reuse endpoint TITLES dengan search query atau logic khusus
    // Idealnya backend punya endpoint /api/moviebox/titles/[slug], tapi kita akali pakai query
    // Atau kalau backend support: `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.TITLES}/${slug}`
    
    // Skenario: Fetch spesifik ID/Slug
    const url = `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.TITLES}?id=${slug}`; 
    // ^ Pastikan backend route.ts kamu handle query "?id=..." atau buat route dynamic baru.
    
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      
      const data = await res.json();
      // Asumsi backend balikin array results, ambil yg pertama
      const item = Array.isArray(data.results) ? data.results[0] : data;
      
      if (!item) return null;
      return normalizeTitle(item);
    } catch (error) {
      console.error("Detail Fetch Error:", error);
      return null;
    }
  }
};
