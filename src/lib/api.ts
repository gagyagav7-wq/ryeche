const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// --- HELPERS ---
const extractArray = (raw: any): any[] => {
  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    const first = raw[0];
    // Pola Hotrank (Nested Data)
    if (first && Array.isArray(first.data)) return raw.flatMap((c: any) => c.data || []);
    // Pola Latest (List wrapper)
    if (first && Array.isArray(first.list)) return first.list;
    return raw;
  }
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.list)) return raw.list;
    if (Array.isArray(raw.data)) return extractArray(raw.data);
  }
  return [];
};

const normalizeDrama = (d: any) => {
  if (!d || (!d.playlet_id && !d.id)) return null;
  
  // Prioritas ID: playlet_id (API Asli) > id
  const id = String(d.playlet_id || d.id || "");
  const cover = d.cover || d.cover_url || d.thumbnail || "";
  
  return {
    id,
    title: d.title || "Untitled",
    cover_url: cover,
    total_ep: d.upload_num || d.total_ep || "?"
  };
};

async function fetchAPI(path: string) {
  const url = `${API_BASE_URL}${path}`;
  console.log(`[FETCH] ${url}`);

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache 1 Jam (Anti-429)
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const json = await res.json();
    return json.data || json;
  } catch (error: any) {
    console.error(`[FETCH ERROR] ${url}`, error.message);
    return null;
  }
}

// --- EXPORTED FUNCTIONS ---

export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  
  // Debugging Server Side (Cek logs terminal VPS)
  if (rawData) {
    console.log(`[DEBUG API] Drama ID: ${id}`);
    const firstEp = rawData.episodes?.[0];
    if (firstEp) {
      console.log(`[DEBUG API] Sample Episode Keys:`, Object.keys(firstEp));
      if (firstEp.raw) console.log(`[DEBUG API] 'raw' Keys:`, Object.keys(firstEp.raw));
    }
  }

  if (!rawData) return null;

  const dramaInfo = rawData.drama || rawData;
  const rawEpisodes = extractArray(rawData.episodes || []);

  const episodes = rawEpisodes.map((ep: any) => {
    // LOGIC PENCARIAN VIDEO (Robust)
    // Cek di dalam 'raw', lalu cek di level root
    const videoUrl = 
      ep.raw?.videoUrl || 
      ep.raw?.video_url || 
      ep.videoUrl || 
      ep.video_url || 
      ep.url || 
      "";

    return {
      id: String(ep.id || ep.chapter_id || ep.playlet_id),
      name: ep.chapter_title || ep.title || ep.name || `Episode ${ep.chapter_num || "?"}`,
      video_url: videoUrl,
      hasVideo: !!videoUrl // Flag buat UI tau ada video atau nggak
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
