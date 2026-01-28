// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// --- 1. THE ULTIMATE EXTRACTOR ---
// Fungsi ini mendeteksi pola JSON dan mengambil array drama yang benar
const extractArray = (raw: any): any[] => {
  // Jika raw adalah ARRAY
  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    
    const firstItem = raw[0];

    // Pola A: Array Drama Langsung (Kasus /search)
    // Ciri: Item langsung punya 'playlet_id' atau 'id'
    if (firstItem && (firstItem.playlet_id || firstItem.id)) {
      return raw;
    }

    // Pola B: Array Kategori (Kasus /hotrank)
    // Ciri: Item punya properti 'data' yang berupa array
    // Struktur: [ { name: "Serial Hot", data: [...] }, ... ]
    if (firstItem && Array.isArray(firstItem.data)) {
      // Kita gabungin semua kategori jadi satu list panjang
      return raw.flatMap((category: any) => category.data || []);
    }

    // Pola C: Array Column (Kasus /latest)
    // Ciri: Item punya properti 'list' yang berupa array
    // Struktur: [ { list: [...] } ]
    if (firstItem && Array.isArray(firstItem.list)) {
      return firstItem.list;
    }

    return [];
  }

  // Jika raw adalah OBJECT
  if (raw && typeof raw === 'object') {
    // Pola D: Object List (Kasus /foryou)
    // Struktur: { list: [...] }
    if (Array.isArray(raw.list)) return raw.list;

    // Pola E: Generic Data wrapper
    if (Array.isArray(raw.data)) {
       // Cek recursive siapa tau di dalam data ada list/data lagi
       return extractArray(raw.data);
    }
  }

  return [];
};

// --- 2. NORMALISASI DATA (Mapping Field Aneh ke Standar UI) ---
const normalizeDrama = (d: any) => {
  // Filter item sampah/kosong
  if (!d || (!d.playlet_id && !d.id)) return null;

  // Mapping Cover (Prioritas: cover -> cover_url -> thumbnail)
  const rawCover = d.cover || d.cover_url || d.thumbnail || d.poster || "";
  
  // Proxy Logic (Opsional: Aktifkan jika gambar pecah/403)
  const useProxy = true; 
  const coverUrl = useProxy && rawCover && rawCover.startsWith("http")
    ? `/api/proxy?url=${encodeURIComponent(rawCover)}` 
    : rawCover;

  return {
    // ID: API kamu pakai 'playlet_id'
    id: String(d.playlet_id || d.id || d.drama_id || ""), 
    
    // Title
    title: d.title || d.name || "Untitled Drama",
    
    // Cover Image
    cover_url: coverUrl,
    
    // Total Episode: API kamu pakai 'upload_num'
    total_ep: d.upload_num || d.total_ep || d.episode_count || "?" 
  };
};

// --- 3. FETCH WRAPPER ---
async function fetchAPI(path: string) {
  const url = `${API_BASE_URL}${path}`;
  console.log(`[FETCH] Hit: ${url}`);

  try {
    const res = await fetch(url, {
      cache: "no-store", 
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    
    const json = await res.json();
    // Kembalikan json.data agar diekstrak helper, atau json utuh jika tidak ada data
    return json.data || json; 
  } catch (error: any) {
    console.error(`[FETCH FAIL] ${url}: ${error.message}`);
    return []; 
  }
}

// --- 4. EXPORTED FUNCTIONS ---

export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  if (!rawData) return null;

  // Normalisasi info drama
  const dramaInfo = rawData.drama || rawData; // Kadang dibungkus 'drama', kadang langsung

  const episodes = extractArray(rawData.episodes || [])
    .map((ep: any) => ({
      id: String(ep.id || ep.chapter_id || ep.playlet_id), // Sesuaikan ID episode
      name: ep.chapter_title || ep.title || ep.name || `Episode ${ep.chapter_num || 1}`,
      video_url: ep.videoUrl || ep.video_url || ep.url || "",
    }))
    .filter((ep) => ep.video_url); // Hapus episode tanpa link video

  return {
    info: {
      id: String(id),
      title: dramaInfo.title || "Unknown Title",
      synopsis: dramaInfo.introduce || dramaInfo.description || "No synopsis.",
      cover_url: dramaInfo.cover || dramaInfo.cover_url || ""
    },
    episodes: episodes,
  };
}

export async function searchDrama(query: string) {
  const raw = await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}

export async function getForYou() {
  const raw = await fetchAPI(`/foryou`); // Returns { list: [...] }
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}

export async function getHotRank() {
  const raw = await fetchAPI(`/hotrank`); // Returns [ {data: [...]}, {data: [...]} ]
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}

export async function getLatest() {
  const raw = await fetchAPI(`/latest`); // Returns [ {list: [...]} ]
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}
