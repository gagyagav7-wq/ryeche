const BASE_URL = "https://api.sansekai.my.id/api/flickreels";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json"
};

// --- FUNGSI PENERJEMAH DATA ---
const normalizeData = (item: any) => {
  return {
    id: item.playlet_id || item.id,
    title: item.title,
    // Prioritas cover: cover -> cover_square -> cover_vertical
    cover_url: item.cover || item.cover_square || item.cover_vertical, 
    synopsis: item.introduce || item.description || item.desc || "No synopsis.",
    total_ep: item.upload_num || item.chapterCount || 0
  };
};

// Helper Fetcher
async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: HEADERS,
      next: { revalidate: 0 } // No cache biar data selalu fresh
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Fetch Error: ${endpoint}`, error);
    return null;
  }
}

// 1. Get Latest (INI YANG DIPERBAIKI SESUAI JSON LU)
export async function getLatest() {
  const json = await fetchAPI("/latest");
  
  // LOGIC BARU: Cek Data -> Ambil Item ke-0 -> Ambil 'list'
  if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
     const firstCategory = json.data[0]; // Ini object kategori "Baru"
     if (firstCategory.list && Array.isArray(firstCategory.list)) {
        return firstCategory.list.map(normalizeData);
     }
  }

  // Fallback (Jaga-jaga kalau struktur beda dikit)
  const items = json?.data?.list || json?.result || [];
  if (Array.isArray(items)) return items.map(normalizeData);
  
  return [];
}

// 2. Get For You (Kita samain logikanya biar aman)
export async function getForYou() {
  const json = await fetchAPI("/foryou");
  
  // Cek struktur bertingkat juga
  if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
     const firstCategory = json.data[0];
     // Kadang namanya 'list', kadang 'data'.
     const list = firstCategory.list || firstCategory.data;
     if (list && Array.isArray(list)) {
        return list.map(normalizeData);
     }
  }
  
  const items = json?.data?.list || json?.data || json?.result || [];
  if (Array.isArray(items)) return items.map(normalizeData);
  return [];
}

// 3. Get Hot Rank
export async function getHotRank() {
  const json = await fetchAPI("/hotrank");
  const categories = json?.data || json || [];
  
  // Hotrank biasanya array kategori, kita ambil kategori pertama
  if (Array.isArray(categories) && categories.length > 0) {
    const firstCategory = categories[0]; 
    if (firstCategory && Array.isArray(firstCategory.data)) {
      return firstCategory.data.map(normalizeData);
    }
  }
  return [];
}

// 4. Get Detail Drama
export async function getDramaDetail(id: string) {
  const json = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  
  let rawData = json?.data || json?.result || json;
  
  // Kalau datanya dibungkus 'drama', pindahin ke 'info'
  if (rawData.drama) {
    rawData.info = rawData.drama;
  }

  if (!rawData || !rawData.info) {
    throw new Error("Drama not found");
  }

  rawData.info = normalizeData(rawData.info);

  // Mapping Episodes (Video URL ngumpet di raw.videoUrl)
  if (Array.isArray(rawData.episodes)) {
    rawData.episodes = rawData.episodes.map((ep: any) => ({
      id: ep.id,
      name: ep.name,
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
  
  // Logic search biasanya langsung data list
  const items = json?.data || json?.result || [];
  if (Array.isArray(items)) return items.map(normalizeData);
  return [];
}

// 6. Video Type Helper
export function getVideoType(url: string) {
  if (!url) return "hls";
  if (url.includes(".m3u8")) return "hls";
  if (url.includes(".mp4")) return "mp4";
  return "hls";
}
