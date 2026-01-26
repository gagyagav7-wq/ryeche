const BASE_URL = "https://api.sansekai.my.id/api/flickreels";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json"
};

// --- FUNGSI PENERJEMAH (UPDATED) ---
// Sekarang bisa baca 'description' dan 'chapterCount' dari JSON baru lu
const normalizeData = (item: any) => {
  return {
    id: item.playlet_id || item.id,
    title: item.title,
    cover_url: item.cover || item.cover_square,
    // Tambah item.description biar sinopsis muncul
    synopsis: item.introduce || item.description || item.desc || "No synopsis.",
    // Tambah item.chapterCount biar total episode bener
    total_ep: item.upload_num || item.chapterCount || 0
  };
};

// Helper Fetcher
async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: HEADERS,
      next: { revalidate: 0 } 
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Fetch Error: ${endpoint}`, error);
    return null;
  }
}

// 1. Get Latest
export async function getLatest() {
  const json = await fetchAPI("/latest");
  const items = json?.data?.list || json?.data || json?.result || json || [];
  if (Array.isArray(items)) return items.map(normalizeData);
  return [];
}

// 2. Get For You
export async function getForYou() {
  const json = await fetchAPI("/foryou");
  const items = json?.data?.list || json?.data || json?.result || json || [];
  if (Array.isArray(items)) return items.map(normalizeData);
  return [];
}

// 3. Get Hot Rank
export async function getHotRank() {
  const json = await fetchAPI("/hotrank");
  const categories = json?.data || json || [];
  if (Array.isArray(categories) && categories.length > 0) {
    const firstCategory = categories[0]; 
    if (firstCategory && Array.isArray(firstCategory.data)) {
      return firstCategory.data.map(normalizeData);
    }
  }
  return [];
}

// 4. Get Detail Drama (INI YANG DIPERBAIKI)
export async function getDramaDetail(id: string) {
  const json = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  
  let rawData = json?.data || json?.result || json;
  
  // FIX 1: Kalau datanya pake nama 'drama', kita pindahin ke 'info' biar UI gak bingung
  if (rawData.drama) {
    rawData.info = rawData.drama;
  }

  if (!rawData || !rawData.info) {
    throw new Error("Drama not found");
  }

  // Normalize Info
  rawData.info = normalizeData(rawData.info);

  // FIX 2: Mapping Episodes biar 'video_url' ketemu
  // JSON lu nyimpen video di dalam: episode.raw.videoUrl
  if (Array.isArray(rawData.episodes)) {
    rawData.episodes = rawData.episodes.map((ep: any) => ({
      id: ep.id,
      name: ep.name,
      // Kita ambil videoUrl dari dalem 'raw', terus taruh di luar biar Player baca
      video_url: ep.raw?.videoUrl || ep.videoUrl || ep.video_url || "", 
      ...ep
    }));
  }
  
  return rawData;
}

// 5. Search
export async function searchDrama(query: string) {
  if (!query) return [];
  const json = await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
  const items = json?.data || json?.result || json || [];
  if (Array.isArray(items)) return items.map(normalizeData);
  return [];
}

// 6. Video Type
export function getVideoType(url: string) {
  if (!url) return "hls"; // Default aman
  if (url.includes(".m3u8")) return "hls";
  if (url.includes(".mp4")) return "mp4";
  return "hls";
}
