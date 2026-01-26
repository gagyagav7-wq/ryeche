const BASE_URL = "https://api.sansekai.my.id/api/flickreels";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json"
};

// --- FUNGSI PENERJEMAH (PENTING!) ---
// Ini ngerubah data mentah dari API jadi format yang kita mau
const normalizeData = (item: any) => {
  return {
    id: item.playlet_id || item.id, // Ambil ID yang bener
    title: item.title,
    cover_url: item.cover || item.cover_square, // Translate 'cover' jadi 'cover_url'
    synopsis: item.introduce || item.desc || "No synopsis.",
    total_ep: item.upload_num || 0
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

// 1. Get Latest (Drama Baru)
export async function getLatest() {
  const json = await fetchAPI("/latest");
  // Cek kalau formatnya { data: [...] }
  const items = json?.data || json?.result || json || [];
  
  if (Array.isArray(items)) {
    return items.map(normalizeData);
  }
  return [];
}

// 2. Get For You (Rekomendasi)
export async function getForYou() {
  const json = await fetchAPI("/foryou");
  const items = json?.data || json?.result || json || [];
  
  if (Array.isArray(items)) {
    return items.map(normalizeData);
  }
  return [];
}

// 3. Get Hot Rank (INI YANG TADI RUSAK)
export async function getHotRank() {
  const json = await fetchAPI("/hotrank");
  // JSON Hotrank itu isinya Kategori dulu -> baru Data Drama
  // Struktur: [ { name: "Serial Hot", data: [...] }, { name: "Trending", data: [...] } ]
  
  const categories = json?.data || json || [];
  
  if (Array.isArray(categories) && categories.length > 0) {
    // Kita ambil kategori pertama (biasanya "Serial Hot") buat ditampilin di home
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
  
  // Detektif data detail
  let rawData = json?.data || json?.result || json;
  
  if (!rawData || !rawData.info) {
    throw new Error("Drama not found");
  }

  // Kita normalize juga info-nya biar gambarnya muncul
  rawData.info = normalizeData(rawData.info);
  
  return rawData;
}

// 5. Search
export async function searchDrama(query: string) {
  if (!query) return [];
  const json = await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
  
  const items = json?.data || json?.result || json || [];
  if (Array.isArray(items)) {
    return items.map(normalizeData);
  }
  return [];
}

// 6. Video Type
export function getVideoType(url: string) {
  if (!url) return "hls";
  if (url.includes(".m3u8")) return "hls";
  if (url.includes(".mp4")) return "mp4";
  return "hls";
}
