/**
 * MOVIE HUB API ADAPTER (REBAHIN ENGINE)
 * ISOLATED FROM DRACIN / SANSEKAI API
 */

const REBAHIN_BASE_URL = "https://zeldvorik.ru/rebahin21/api.php";

// --- TYPES ---

export interface RebahinMovie {
  id: string; // Map from slug
  title: string;
  poster: string; // Map from thumbnail
  rating: string;
  year: string;
  type: 'series' | 'movie';
  label: string; // Visual badge
}

export interface RebahinEpisode {
  episode: number;
  title: string;
  player_url: string;
}

export interface RebahinDetail extends RebahinMovie {
  genres: string[];
  cast: string[];
  synopsis: string;
  player_url: string;
  episodes: RebahinEpisode[];
}

// --- HELPERS ---

/**
 * Normalizer: Mengubah data mentah Rebahin ke format UI Movie Hub
 */
const normalizeRebahin = (item: any): RebahinMovie => {
  return {
    id: item.slug || "",
    title: item.title?.replace(/\(\d{4}\)/, '').trim() || "Untitled", // Bersihin year dari title
    poster: item.thumbnail || "",
    rating: item.rating || "0.0",
    year: item.year || "N/A",
    type: item.type || "movie",
    label: item.type === 'series' ? "SERIES" : "MOVIE"
  };
};

// --- FETCH WRAPPER ---

async function callRebahin(params: Record<string, string | number>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => query.append(key, String(val)));
  
  const url = `${REBAHIN_BASE_URL}?${query.toString()}`;
  console.log(`[MOVIE-HUB FETCH] ${url}`);

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache 1 jam agar performa kencang
      headers: { 
        "User-Agent": "DAWGHub-Control-Deck/2.0",
        "Accept": "application/json"
      },
    });

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    return json.success ? json : { success: false, data: [] };
  } catch (error) {
    console.error(`[MOVIE-HUB FAIL] ${url}:`, error);
    return { success: false, data: [] };
  }
}

// --- EXPORTED ACTIONS ---

/**
 * Ambil List Berdasarkan Kategori (home, trending, movies, series)
 */
export async function getMovieHubList(action: 'home' | 'trending' | 'movies' | 'series' = 'home', page: number = 1) {
  const res = await callRebahin({ action, page });
  const rawData = Array.isArray(res.data) ? res.data : [];
  return {
    items: rawData.map(normalizeRebahin),
    total: res.total || rawData.length
  };
}

/**
 * Fitur Search Movie Hub
 */
export async function searchMovieHub(q: string, page: number = 1) {
  const res = await callRebahin({ action: 'search', q, page });
  const rawData = Array.isArray(res.data) ? res.data : [];
  return {
    items: rawData.map(normalizeRebahin),
    total: res.total || rawData.length
  };
}

/**
 * Detail Movie & Player Data
 */
export async function getMovieHubDetail(slug: string): Promise<RebahinDetail | null> {
  const res = await callRebahin({ action: 'detail', slug });
  if (!res.success || !res.data) return null;

  const d = res.data;
  return {
    ...normalizeRebahin(d),
    genres: Array.isArray(d.genres) ? d.genres : [],
    cast: Array.isArray(d.cast) ? d.cast : [],
    synopsis: d.synopsis || "No synopsis available.",
    player_url: d.player_url || "",
    episodes: Array.isArray(d.episodes) ? d.episodes : []
  };
}
