// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// 1. Helper: Gali array drama dari struktur JSON yang aneh-aneh
const extractArray = (raw: any): any[] => {
  // KASUS 1: Raw adalah Array langsung
  if (Array.isArray(raw)) {
    // Cek kasus /latest: [ { title: "Baru", list: [...] } ]
    if (raw.length > 0 && raw[0] && Array.isArray(raw[0].list)) {
      return raw[0].list;
    }
    return raw;
  }

  // KASUS 2: Raw adalah Object
  if (!raw || typeof raw !== 'object') return [];

  // Cek kasus /foryou: { list: [...] }
  if (Array.isArray(raw.list)) return raw.list;
  
  // Cek kasus umum: { items: [...] }
  if (Array.isArray(raw.items)) return raw.items;

  // Cek kasus nested data: { data: [...] } atau { data: { list: [...] } }
  if (raw.data) {
     if (Array.isArray(raw.data)) {
        // Ulangi logika cek array column (Recursive lite)
        if (raw.data.length > 0 && raw.data[0] && Array.isArray(raw.data[0].list)) {
            return raw.data[0].list;
        }
        return raw.data;
     }
     // data: { list: [] } <-- INI YANG /foryou PAKE!
     if (Array.isArray(raw.data.list)) return raw.data.list;
  }

  return [];
};

// 2. Helper: Normalisasi Item (Mapping field API ke UI ButterHub)
const normalizeDrama = (d: any) => {
  // Kalau item kosong/iklan, skip aja (return null nanti difilter)
  if (!d || (!d.playlet_id && !d.id && !d.title)) return null;

  // Mapping field API Flickreels
  const rawCover = d.cover || d.cover_url || d.thumbnail || d.poster || "";
  
  // Proxy image hotlink (Set true jika gambar pecah)
  const useProxy = true; 
  const coverUrl = useProxy && rawCover && rawCover.startsWith("http")
    ? `/api/proxy?url=${encodeURIComponent(rawCover)}` 
    : rawCover;

  return {
    id: String(d.playlet_id || d.id || d.drama_id || ""), 
    title: d.title || d.name || "Untitled Drama",
    cover_url: coverUrl,
    total_ep: d.upload_num || d.total_ep || d.episode_count || "?" 
  };
};

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
    // PENTING: Kembalikan json.data jika ada, kalau tidak json utuh.
    // Helper extractArray akan handle sisanya.
    return json.data || json; 
  } catch (error: any) {
    console.error(`[FETCH FAIL] ${url}: ${error.message}`);
    return []; 
  }
}

// --- EXPORTED FUNCTIONS ---

export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  if (!rawData) return null;

  const episodes = extractArray(rawData.episodes)
    .map((ep: any) => ({
      id: String(ep.id || ep.episode_id),
      name: ep.title || ep.name || `Episode ${ep.id}`,
      video_url: ep.video_url || ep.videoUrl || "",
    }))
    .filter(Boolean); // Hapus yang null

  return {
    info: {
      id: String(id),
      title: rawData.title || rawData.info?.title || "Unknown Title",
      synopsis: rawData.synopsis || rawData.info?.synopsis || rawData.raw?.introduce || "",
      cover_url: rawData.thumbnail || rawData.info?.cover || rawData.cover || ""
    },
    episodes: episodes,
  };
}

export async function searchDrama(query: string) {
  const raw = await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}

export async function getForYou() {
  const raw = await fetchAPI(`/foryou`);
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}

export async function getHotRank() {
  const raw = await fetchAPI(`/hotrank`);
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}

export async function getLatest() {
  const raw = await fetchAPI(`/latest`);
  return extractArray(raw).map(normalizeDrama).filter(Boolean);
}
