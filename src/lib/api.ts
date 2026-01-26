const BASE_URL = process.env.API_BASE_URL;

// ... (Interface Tipe Data sama kayak sebelumnya) ...

export interface DramaItem {
  id: string | number;
  title: string;
  cover_url?: string;
  category?: string;
}

export interface Episode {
  id: string | number;
  name: string;
  video_url: string;
}

export interface DramaDetail {
  info: DramaItem & { synopsis?: string; tags?: string[] };
  episodes: Episode[];
}

// --- HELPER FETCH (Safe JSON Parsing) ---
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!BASE_URL) throw new Error("API_BASE_URL belum diset");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const headers = new Headers(options.headers);
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    if (!res.ok) {
      throw new Error(`API Error ${res.status} di ${endpoint}: ${res.statusText}`);
    }
    
    // FIX: Baca text dulu biar gak crash kalau bukan JSON
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      // Kalau gagal parse (misal dapet HTML error page), tampilin dikit isinya
      throw new Error(`Invalid JSON di ${endpoint}: ${text.slice(0, 50)}...`);
    }

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request Timeout di: ${endpoint}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ... (Helper Utility & Endpoints sama kayak sebelumnya) ...
export function getVideoType(url: string): 'hls' | 'mp4' {
  return /\.m3u8(\?|$)/i.test(url) ? 'hls' : 'mp4';
}

export const getLatest = () => fetchAPI<DramaItem[]>('/latest', { next: { revalidate: 300 } });
export const getForYou = () => fetchAPI<DramaItem[]>('/foryou', { next: { revalidate: 3600 } });
export const getHotRank = () => fetchAPI<DramaItem[]>('/hotrank', { next: { revalidate: 900 } });
export const searchDrama = (query: string) => fetchAPI<DramaItem[]>(`/search?query=${encodeURIComponent(query)}`, { cache: 'no-store' });
export const getDramaDetail = (id: string) => fetchAPI<DramaDetail>(`/detailAndAllEpisode?id=${id}`, { next: { revalidate: 3600 } });
