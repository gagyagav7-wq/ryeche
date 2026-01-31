// src/moviebox/lib/api.ts

// --- CONFIGURATION ---
const CONFIG = {
  // PENTING: Kosongkan ("") biar otomatis ngikut domain browser (Cloudflare/Localhost)
  API_BASE: "", 
  
  ENDPOINTS: {
    TITLES: "/api/moviebox/titles",
    FILTERS: "/api/moviebox/filters",
  },
  DEFAULT_PARAMS: {
    limit: 20,
    page: 1,
  },
};

// ... (sisanya ke bawah biarin aja)

// --- TYPES ---

export interface MovieItem {
  id: string; // URL asli atau ID unik
  title: string;
  poster: string;
  year?: string;
  type: "Movie" | "Series";
  quality: "HD" | "CAM" | "RAW";
  rating?: string;
  genres: string[];
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterResponse {
  genres: FilterOption[];
  years: FilterOption[];
  types: FilterOption[];
  countries: FilterOption[];
}

export interface SearchParams {
  q?: string;
  genre?: string;
  year?: string;
  type?: string;
  country?: string;
  sort?: "latest" | "hot" | "foryou";
}

// --- NORMALIZERS (Fallbacks) ---

const normalizeTitle = (item: any): MovieTitle => {
  return {
    id: item.id || item._id || item.slug || Math.random(),
    title: item.title || item.name || "Untitled",
    poster: item.poster || item.thumbnail || item.cover || item.image || "/placeholder.jpg",
    year: item.year || item.releaseYear || item.date || "N/A",
    type: item.type?.toLowerCase() === "series" || item.isSeries ? "series" : "movie",
    quality: item.quality || "HD",
    rating: item.rating || undefined,
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
  // Fetch semua opsi filter (Genre, Year, dll)
  getFilters: async (): Promise<FilterData> => {
    try {
      // CONTOH: Fetch parallel jika endpoint terpisah
      // const [genresRes, yearsRes] = await Promise.all([
      //   fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.GENRES}`),
      //   fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.YEARS}`)
      // ]);
      
      // SEMENTARA: Menggunakan mock logic agar bisa jalan tanpa API real dulu
      // Ganti logic di dalam try block ini dengan fetch asli kamu
      
      const res = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.FILTERS}`);
      if (!res.ok) throw new Error("Failed to fetch filters");
      const data = await res.json();

      // Normalisasi output filter
      return {
        genres: data.genres?.map((g: any) => ({
          id: g.id || g.slug,
          label: g.name || g.title || g.label,
          value: g.slug || g.id,
        })) || [],
        // Di dalam MovieAPI.getFilters...
        years: data.years?.map((y: any) => ({
          id: y.id || y.value || String(y),
          label: y.label || String(y), // ✅ Pastikan ambil property .label
          value: y.value || String(y),
        })) || [],
        types: [
            { id: 'movie', label: 'Movies', value: 'movie' },
            { id: 'series', label: 'Series', value: 'series' }
        ]
      };
    } catch (error) {
      console.error("Filter Fetch Error:", error);
      // Fallback empty state
      return { genres: [], years: [], types: [] };
    }
  },

  // Fetch Titles dengan AbortController
  getTitles: async (params: FilterPayload, signal?: AbortSignal): Promise<MovieTitle[]> => {
    const queryString = buildQuery({ ...CONFIG.DEFAULT_PARAMS, ...params });
    const url = `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.TITLES}?${queryString}`;

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error("Failed to fetch titles");
      
      const rawData = await res.json();
      
      // Handle berbagai shape response: { results: [] } atau [] atau { data: [] }
      const list = Array.isArray(rawData) 
        ? rawData 
        : rawData.results || rawData.data || rawData.items || [];

      return list.map(normalizeTitle);
    } catch (error: any) {
      if (error.name === "AbortError") {
        // Request cancelled, ignore
        throw error;
      }
      console.error("Titles Fetch Error:", error);
      return [];
    }
  },
};
