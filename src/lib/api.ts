const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// --- TIPE DATA (Sesuaikan dengan respons asli JSON lu nanti) ---
export interface DramaItem {
  id: string | number;
  title: string;
  cover_url?: string; // Sesuaikan: mungkin 'poster', 'thumb', 'image'
  category?: string;
}

export interface Episode {
  id: string | number;
  name: string;      // misal: "Episode 1"
  video_url: string; // Link video (m3u8/mp4)
}

export interface DramaDetail {
  info: DramaItem & { synopsis?: string; tags?: string[] };
  episodes: Episode[];
}

// --- HELPER FETCH ---
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Accept": "*/*" },
    next: { revalidate: 3600 } // Cache 1 jam biar cepet
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// --- ENDPOINTS ---

// 1. Latest Drama
export const getLatest = () => fetchAPI<DramaItem[]>('/latest');

// 2. For You (Rekomendasi)
export const getForYou = () => fetchAPI<DramaItem[]>('/foryou');

// 3. Hot Rank
export const getHotRank = () => fetchAPI<DramaItem[]>('/hotrank');

// 4. Search
export const searchDrama = (query: string) => fetchAPI<DramaItem[]>(`/search?query=${query}`);

// 5. Detail & Episodes (PENTING)
// Karena endpoint lu pake query param ?id=4885
export const getDramaDetail = (id: string) => fetchAPI<DramaDetail>(`/detailAndAllEpisode?id=${id}`);
