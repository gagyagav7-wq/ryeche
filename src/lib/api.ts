// Ambil env server-side
const BASE_URL = process.env.API_BASE_URL;

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

// --- HELPER FETCH ---
// Kita tambah parameter revalidateTime biar fleksibel
async function fetchAPI<T>(endpoint: string, revalidateTime = 3600): Promise<T> {
  // Guard: Cek ENV
  if (!BASE_URL) throw new Error("API_BASE_URL belum diset di .env.local");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Accept": "*/*",
      "User-Agent": "Mozilla/5.0 (Next.js App; Linux; EduProject)"
    },
    next: { revalidate: revalidateTime }
  });

  if (!res.ok) {
    // Bisa lempar error spesifik biar ditangkep error.tsx
    throw new Error(`API Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// --- HELPER UTILITY ---
export function getVideoType(url: string): 'hls' | 'mp4' {
  return url.includes('.m3u8') ? 'hls' : 'mp4';
}

// --- ENDPOINTS ---
// Latest: Update tiap 5 menit (300 detik)
export const getLatest = () => fetchAPI<DramaItem[]>('/latest', 300);

// For You: Update tiap 1 jam
export const getForYou = () => fetchAPI<DramaItem[]>('/foryou', 3600);

// Hot Rank: Update tiap 15 menit (900 detik)
export const getHotRank = () => fetchAPI<DramaItem[]>('/hotrank', 900);

// Search: NO CACHE (revalidate 0) + Encode URI Component
export const searchDrama = (query: string) => 
  fetchAPI<DramaItem[]>(`/search?query=${encodeURIComponent(query)}`, 0);

export const getDramaDetail = (id: string) => 
  fetchAPI<DramaDetail>(`/detailAndAllEpisode?id=${id}`, 3600);
