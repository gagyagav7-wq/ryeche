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

// 1. Get Latest
export async function getLatest() {
  return await fetchAPI("/latest");
}

// 2. Get For You
export async function getForYou() {
  return await fetchAPI("/foryou");
}

// 3. Get Hot Rank
export async function getHotRank() {
  return await fetchAPI("/hotrank");
}

// 4. Get Detail (Ini beda karena return Object, bukan Array)
export async function getDramaDetail(id: string) {
  const res = await fetch(`${BASE_URL}/detailAndAllEpisode?id=${id}`, { headers: HEADERS });
  const json = await res.json();
  
  // Detektif juga buat detail
  const data = json.data || json.result || json;
  
  if (!data || !data.info) {
    throw new Error("Drama not found");
  }
  return data;
}

// 5. Search
export async function searchDrama(query: string) {
  if (!query) return [];
  return await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
}

// ... Sisanya sama (getVideoType dll)
export function getVideoType(url: string) {
  if (url.includes(".m3u8")) return "hls";
  if (url.includes(".mp4")) return "mp4";
  return "hls";
}
