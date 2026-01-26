// Ambil URL langsung dari Env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE; 

// --- TIPE DATA ---
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

// --- HELPER FETCH (DIRECT MODE) ---
async function fetchAPI<T>(endpoint: string): Promise<T> {
  // Langsung tembak ke Sansekai
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 
      "Accept": "*/*",
      // User Agent pura-pura jadi browser biar gak diblok
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" 
    },
    next: { revalidate: 3600 } // Cache 1 jam
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  return res.json();
}

// --- ENDPOINTS ---
export const getLatest = () => fetchAPI<DramaItem[]>('/latest');
export const getForYou = () => fetchAPI<DramaItem[]>('/foryou');
export const getHotRank = () => fetchAPI<DramaItem[]>('/hotrank');
export const searchDrama = (query: string) => fetchAPI<DramaItem[]>(`/search?query=${query}`);
export const getDramaDetail = (id: string) => fetchAPI<DramaDetail>(`/detailAndAllEpisode?id=${id}`);
