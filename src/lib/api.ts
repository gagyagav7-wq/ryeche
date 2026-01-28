const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// --- HELPER: PICK VIDEO URL (ROBUST) ---
const pickVideoUrl = (ep: any): string => {
  // Daftar semua kemungkinan field (dari level atas sampai nested raw)
  const candidates = [
    ep.videoUrl, 
    ep.video_url, 
    ep.url,
    ep.playUrl,
    ep.play_url,
    ep.link,
    // Cek di dalam object raw (sering ngumpet disini)
    ep.raw?.videoUrl,
    ep.raw?.video_url,
    ep.raw?.url,
    ep.raw?.playUrl,
    ep.raw?.file,
    ep.raw?.m3u8,
    ep.raw?.mp4
  ];

  // Ambil string pertama yang valid (ada isinya & startsWith http)
  const valid = candidates.find(c => typeof c === 'string' && c.length > 10 && c.startsWith('http'));
  return valid || "";
};

// --- HELPER: EXTRACT ARRAY ---
const extractArray = (raw: any): any[] => {
  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    const firstItem = raw[0];
    // Hotrank flatten
    if (firstItem && Array.isArray(firstItem.data)) return raw.flatMap((c: any) => c.data || []);
    // Latest flatten
    if (firstItem && Array.isArray(firstItem.list)) return firstItem.list;
    return raw;
  }
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.list)) return raw.list;
    if (Array.isArray(raw.data)) return extractArray(raw.data); // Recursive check
  }
  return [];
};

// --- HELPER: NORMALIZE CARD (HOME/SEARCH) ---
const normalizeDrama = (d: any) => {
  if (!d || (!d.playlet_id && !d.id)) return null;
  const rawCover = d.cover || d.cover_url || d.thumbnail || d.poster || "";
  return {
    id: String(d.playlet_id || d.id || d.drama_id || ""), 
    title: d.title || d.name || "Untitled Drama",
    cover_url: rawCover, // Use raw cover for now
    total_ep: d.upload_num || d.total_ep || d.episode_count || "?" 
  };
};

// --- FETCH WRAPPER ---
async function fetchAPI(path: string) {
  const url = `${API_BASE_URL}${path}`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache 1 jam aman
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const json = await res.json();
    return json.data || json; 
  } catch (error: any) {
    console.error(`[FETCH FAIL] ${url}: ${error.message}`);
    return null; 
  }
}

// --- EXPORTED FUNCTIONS ---

export async function getDramaDetail(id: string) {
  console.log(`\n--- [DEBUG START] GET DETAIL ID: ${id} ---`);
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  
  if (!rawData) {
    console.log("[DBG] rawData is NULL/UNDEFINED");
    return null;
  }

  // 1. LOG RAW KEYS (Buat tau struktur root)
  console.log("[DBG] rawData Keys:", Object.keys(rawData));

  // 2. CARI EPISODES ARRAY
  let rawEpisodes: any[] = [];
  let sourcePath = "UNKNOWN";

  if (Array.isArray(rawData.episodes)) {
    rawEpisodes = rawData.episodes;
    sourcePath = "rawData.episodes";
  } else if (Array.isArray(rawData.data?.episodes)) {
    rawEpisodes = rawData.data.episodes;
    sourcePath = "rawData.data.episodes";
  } else if (Array.isArray(rawData.drama?.episodes)) {
    rawEpisodes = rawData.drama.episodes;
    sourcePath = "rawData.drama.episodes";
  } else {
    // Coba extract pake helper lama
    rawEpisodes = extractArray(rawData.episodes || []);
    sourcePath = "extractArray(rawData.episodes)";
  }

  console.log(`[DBG] Episodes Source: ${sourcePath} | Count: ${rawEpisodes.length}`);

  // 3. LOG SAMPLE EPISODE (Penting buat liat field video)
  if (rawEpisodes.length > 0) {
    const sample = rawEpisodes[0];
    console.log("[DBG] Sample Ep [0] Keys:", Object.keys(sample));
    if (sample.raw) {
      console.log("[DBG] Sample Ep [0] RAW Keys:", Object.keys(sample.raw));
      // Log candidate values (potong biar gak menuhin terminal)
      console.log("[DBG] Raw Video Candidates:", {
        videoUrl: sample.raw.videoUrl?.slice(0, 50),
        video_url: sample.raw.video_url?.slice(0, 50),
        url: sample.raw.url?.slice(0, 50),
        playUrl: sample.raw.playUrl?.slice(0, 50)
      });
    } else {
      console.log("[DBG] No 'raw' object in episode.");
    }
  }

  // 4. MAPPING DATA
  const dramaInfo = rawData.drama || rawData; 
  const episodes = rawEpisodes.map((ep: any, index: number) => {
    const videoUrl = pickVideoUrl(ep);
    
    return {
      id: String(ep.id || ep.chapter_id || ep.playlet_id || index),
      name: ep.chapter_title || ep.title || ep.name || `Episode ${ep.chapter_num || index + 1}`,
      video_url: videoUrl,
      hasVideo: !!videoUrl, // Flag penting buat UI
      raw_debug: process.env.NODE_ENV === 'development' ? ep : undefined // Simpan raw buat debug di client kalau perlu
    };
  });

  console.log(`[DBG] Final Episodes with Video: ${episodes.filter((e: any) => e.hasVideo).length}/${episodes.length}`);
  console.log("--- [DEBUG END] ---\n");

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
