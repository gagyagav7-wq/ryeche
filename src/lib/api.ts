const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// --- HELPER: PICK VIDEO URL (ROBUST) ---
const pickVideoUrl = (ep: any): string => {
  const candidates = [
    ep.videoUrl, 
    ep.video_url, 
    ep.url,
    ep.playUrl,
    ep.play_url,
    ep.link,
    // Cek nested raw
    ep.raw?.videoUrl,
    ep.raw?.video_url,
    ep.raw?.url,
    ep.raw?.playUrl,
    ep.raw?.file,
    ep.raw?.m3u8,
    ep.raw?.mp4
  ];

  // Cari yang string, ada isinya, dan diawali http
  const valid = candidates.find(c => typeof c === 'string' && c.length > 10 && c.startsWith('http'));
  return valid || "";
};

// --- HELPER: EXTRACT ARRAY ---
const extractArray = (raw: any): any[] => {
  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    const firstItem = raw[0];
    if (firstItem && Array.isArray(firstItem.data)) return raw.flatMap((c: any) => c.data || []);
    if (firstItem && Array.isArray(firstItem.list)) return firstItem.list;
    return raw;
  }
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.list)) return raw.list;
    if (Array.isArray(raw.data)) return extractArray(raw.data);
  }
  return [];
};

// --- HELPER: NORMALIZE CARD ---
const normalizeDrama = (d: any) => {
  if (!d || (!d.playlet_id && !d.id)) return null;
  const rawCover = d.cover || d.cover_url || d.thumbnail || d.poster || "";
  return {
    id: String(d.playlet_id || d.id || d.drama_id || ""), 
    title: d.title || d.name || "Untitled Drama",
    cover_url: rawCover,
    total_ep: d.upload_num || d.total_ep || d.episode_count || "?" 
  };
};

// --- FETCH WRAPPER (CACHE ENABLED) ---
async function fetchAPI(path: string) {
  const url = `${API_BASE_URL}${path}`;
  console.log(`[FETCH] ${url}`); // Minimal log

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // PENTING: Cache 1 jam anti-banned
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!res.ok) {
        if (res.status === 429) console.error("API RATE LIMIT HIT (429)!");
        throw new Error(`API Error: ${res.status}`);
    }
    const json = await res.json();
    return json.data || json; 
  } catch (error: any) {
    console.error(`[FETCH FAIL] ${url}: ${error.message}`);
    return null; 
  }
}

// --- EXPORTED FUNCTIONS ---

export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  if (!rawData) return null;

  const dramaInfo = rawData.drama || rawData;
  const rawEpisodes = extractArray(rawData.episodes || []);

  const episodes = rawEpisodes.map((ep: any, index: number) => {
    const videoUrl = pickVideoUrl(ep);
    
    return {
      id: String(ep.id || ep.chapter_id || ep.playlet_id || index),
      name: ep.chapter_title || ep.title || ep.name || `Episode ${ep.chapter_num || index + 1}`,
      video_url: videoUrl,
      hasVideo: !!videoUrl
    };
  });

  return {
    info: {
      id: String(id),
      title: dramaInfo.title || "Unknown Title",
      synopsis: dramaInfo.introduce || dramaInfo.description || "No synopsis available.",
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
