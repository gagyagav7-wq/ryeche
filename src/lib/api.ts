const BASE_URL = process.env.API_BASE_URL;

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

// --- HELPER FETCH (Lebih Fleksibel) ---
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!BASE_URL) throw new Error("API_BASE_URL belum diset");

  // Setup Timeout 10 Detik biar gak nge-hang selamanya
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options, // Masukin opsi cache/next disini
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error: any) {
    if (error.name === 'AbortError') throw new Error("Request Timeout");
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- HELPER UTILITY (REGEX KUAT) ---
export function getVideoType(url: string): 'hls' | 'mp4' {
  // Regex: Cek .m3u8 walaupun ada query string (?token=...) atau huruf besar
  return /\.m3u8(\?|$)/i.test(url) ? 'hls' : 'mp4';
}

// --- ENDPOINTS ---
export const getLatest = () => fetchAPI<DramaItem[]>('/latest', { next: { revalidate: 300 } });
export const getForYou = () => fetchAPI<DramaItem[]>('/foryou', { next: { revalidate: 3600 } });
export const getHotRank = () => fetchAPI<DramaItem[]>('/hotrank', { next: { revalidate: 900 } });

// Search: WAJIB NO-STORE (Jangan di-cache sama sekali) + Encode
export const searchDrama = (query: string) => 
  fetchAPI<DramaItem[]>(`/search?query=${encodeURIComponent(query)}`, { cache: 'no-store' });

export const getDramaDetail = (id: string) => 
  fetchAPI<DramaDetail>(`/detailAndAllEpisode?id=${id}`, { next: { revalidate: 3600 } });
