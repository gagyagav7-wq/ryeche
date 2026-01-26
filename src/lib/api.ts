const BASE_URL = "https://api.sansekai.my.id/api/flickreels";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json"
};

// --- FUNGSI PEMBERSIH DATA (FILTER) ---
const normalizeData = (item: any) => {
  // Cek minimal punya ID dan Title, kalau gak ada anggap sampah
  if (!item || (!item.playlet_id && !item.id)) return null;

  return {
    id: item.playlet_id || item.id,
    title: item.title || "No Title",
    // Kalau gak ada cover, pake placeholder bawaan
    cover_url: item.cover || item.cover_square || item.cover_vertical || "https://placehold.co/400x600/000000/FFF?text=No+Image", 
    synopsis: item.introduce || item.description || item.desc || "No synopsis available.",
    total_ep: item.upload_num || item.chapterCount || 0
  };
};

// --- FUNGSI PENCARI HARTA KARUN (RECURSIVE) ---
// Ini bakal nyari Array di dalem object JSON secara otomatis
function findList(data: any): any[] {
  if (!data) return [];
  
  // 1. Kalau langsung ketemu Array, balikin
  if (Array.isArray(data)) {
    // Tapi cek dulu, isinya drama atau kategori? 
    // Kalau isinya punya properti 'list', berarti ini Kategori! Gali lagi.
    if (data.length > 0 && data[0].list) {
      return findList(data[0].list);
    }
    return data;
  }

  // 2. Cek properti umum
  if (data.data) return findList(data.data);
  if (data.result) return findList(data.result);
  if (data.list) return findList(data.list);

  // 3. Nyerah
  return [];
}

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
  const rawList = findList(json);
  // Filter(Boolean) buat buang yang null (data ompong)
  return rawList.map(normalizeData).filter(Boolean);
}

// 2. Get For You
export async function getForYou() {
  const json = await fetchAPI("/foryou");
  const rawList = findList(json);
  return rawList.map(normalizeData).filter(Boolean);
}

// 3. Get Hot Rank
export async function getHotRank() {
  const json = await fetchAPI("/hotrank");
  // Hotrank biasanya array kategori, kita ambil list dari item pertama
  const rawData = json?.data || json || [];
  if (Array.isArray(rawData) && rawData.length > 0 && rawData[0].data) {
     return rawData[0].data.map(normalizeData).filter(Boolean);
  }
  return [];
}

// 4. Get Detail Drama
export async function getDramaDetail(id: string) {
  const json = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  
  let rawData = json?.data || json?.result || json;
  
  if (rawData.drama) {
    rawData.info = rawData.drama;
  }

  if (!rawData || !rawData.info) {
    throw new Error("Drama not found");
  }

  rawData.info = normalizeData(rawData.info);

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
  const rawList = findList(json);
  return rawList.map(normalizeData).filter(Boolean);
}

// 6. Video Type
export function getVideoType(url: string) {
  if (!url) return "hls";
  if (url.includes(".m3u8")) return "hls";
  if (url.includes(".mp4")) return "mp4";
  return "hls";
}
