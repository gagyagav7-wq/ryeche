// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// 1. Helper: Gali array drama dari struktur JSON yang aneh-aneh
const extractArray = (raw: any): any[] => {
  if (Array.isArray(raw)) {
    // KASUS /latest: [ { list: [...] } ]
    if (raw.length > 0 && raw[0] && Array.isArray(raw[0].list)) {
      return raw[0].list;
    }
    // KASUS /hotrank: [ { name: "Serial Hot", data: [...] }, ... ]
    // Kita ambil SEMUA data dari semua kategori dan gabungin jadi satu list panjang
    if (raw.length > 0 && raw[0] && Array.isArray(raw[0].data)) {
        return raw.flatMap((category: any) => category.data || []);
    }
    return raw;
  }

  if (!raw || typeof raw !== 'object') return [];

  // KASUS /foryou: { list: [...] }
  if (Array.isArray(raw.list)) return raw.list;
  
  // KASUS UMUM: { items: [...] }
  if (Array.isArray(raw.items)) return raw.items;

  // KASUS NESTED: { data: [...] }
  if (raw.data) {
     if (Array.isArray(raw.data)) {
        // Recursive check untuk data di dalam data
        if (raw.data.length > 0 && raw.data[0] && Array.isArray(raw.data[0].list)) {
            return raw.data[0].list;
        }
        // Handle Hotrank (data -> data -> data)
        if (raw.data.length > 0 && raw.data[0] && Array.isArray(raw.data[0].data)) {
            return raw.data.flatMap((cat: any) => cat.data || []);
        }
        return raw.data;
     }
     // data: { list: [] }
     if (Array.isArray(raw.data.list)) return raw.data.list;
  }

  return [];
};

// 2. Helper: Normalisasi Item (Mapping field API ke UI ButterHub)
const normalizeDrama = (d: any) => {
  if (!d || (!d.playlet_id && !d.id && !d.title)) return null;

  const rawCover = d.cover || d.cover_url || d.thumbnail || d.poster || "";
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
    .filter(Boolean);

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
