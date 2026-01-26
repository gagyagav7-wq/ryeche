const BASE_URL = "https://api.sansekai.my.id/api/flickreels";

// Headers biar dikira browser asli (Anti-Blokir Ringan)
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json"
};

// Helper Fetcher Generik (Versi Auto-Unwrap)
async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: HEADERS,
      next: { revalidate: 0 } // JANGAN CACHE DULU biar gampang debug
    });

    if (!res.ok) {
      console.error(`❌ API Error [${res.status}]: ${endpoint}`);
      return []; // Balikin array kosong kalau error HTTP
    }
    
    const json = await res.json();
    
    // --- LOGIC DETEKTIF DATA ---
    // 1. Kalau langsung Array, ambil.
    if (Array.isArray(json)) return json;
    
    // 2. Kalau dibungkus 'data', ambil isinya.
    if (json.data && Array.isArray(json.data)) return json.data;
    
    // 3. Kalau dibungkus 'result', ambil isinya.
    if (json.result && Array.isArray(json.result)) return json.result;

    // 4. Kalau dibungkus 'results', ambil isinya.
    if (json.results && Array.isArray(json.results)) return json.results;

    console.warn(`⚠️ Format Data Aneh di ${endpoint}:`, json);
    return []; // Nyerah, balikin kosong
    
  } catch (error) {
    console.error(`❌ Fetch Failed: ${endpoint}`, error);
    return [];
  }
}

// 1. Get Latest (Drama Baru)
export async function getLatest() {
  const data = await fetchAPI("/latest");
  // Pastikan yang dikembalikan Array, kalau null/error balikin []
  return Array.isArray(data) ? data : [];
}

// 2. Get For You (Rekomendasi)
export async function getForYou() {
  const data = await fetchAPI("/foryou");
  return Array.isArray(data) ? data : [];
}

// 3. Get Hot Rank (List Kategori Rank)
export async function getHotRank() {
  const data = await fetchAPI("/hotrank");
  return Array.isArray(data) ? data : [];
}

// 4. Get Detail Drama + Episodes
export async function getDramaDetail(id: string) {
  const data = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  
  // Validasi data minimal harus punya info & episodes
  if (!data || !data.info) {
    throw new Error("Drama not found");
  }
  return data;
}

// 5. Search Drama
export async function searchDrama(query: string) {
  if (!query) return [];
  const data = await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
  return Array.isArray(data) ? data : [];
}

// 6. Get Video Type Helper (Buat Player)
export function getVideoType(url: string) {
  if (url.includes(".m3u8")) return "hls";
  if (url.includes(".mp4")) return "mp4";
  return "hls"; // Default HLS
}
