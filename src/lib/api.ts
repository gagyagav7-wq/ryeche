const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// --- 1. THE ULTIMATE EXTRACTOR ---
const extractArray = (raw: any): any[] => {
  if (Array.isArray(raw)) {
    if (raw.length === 0) return [];
    const firstItem = raw[0];

    // Pola A: Array Drama Langsung (Search)
    if (firstItem && (firstItem.playlet_id || firstItem.id)) return raw;

    // Pola B: Array Kategori (Hotrank) -> Flatten
    if (firstItem && Array.isArray(firstItem.data)) {
      return raw.flatMap((category: any) => category.data || []);
    }

    // Pola C: Array Column (Latest)
    if (firstItem && Array.isArray(firstItem.list)) return firstItem.list;

    return raw;
  }

  if (raw && typeof raw === 'object') {
    // Pola D: Object List (Foryou)
    if (Array.isArray(raw.list)) return raw.list;
    // Pola E: Generic Data wrapper
    if (Array.isArray(raw.data)) return extractArray(raw.data);
  }

  return [];
};

// --- 2. NORMALISASI DATA ---
const normalizeDrama = (d: any) => {
  if (!d || (!d.playlet_id && !d.id)) return null;

  const rawCover = d.cover || d.cover_url || d.thumbnail || d.poster || "";
  // Gunakan URL langsung dulu. Jika nanti gambar broken (403), baru aktifkan proxy.
  const coverUrl = rawCover; 

  return {
    id: String(d.playlet_id || d.id || d.drama_id || ""), 
    title: d.title || d.name || "Untitled Drama",
    cover_url: coverUrl,
    total_ep: d.upload_num || d.total_ep || d.episode_count || "?" 
  };
};

// --- 3. FETCH WRAPPER (DENGAN CACHE) ---
async function fetchAPI(path: string) {
  const url = `${API_BASE_URL}${path}`;
  console.log(`[FETCH] Hit: ${url}`);

  try {
    const res = await fetch(url, {
      // PENTING: Cache 1 jam (3600 detik) biar gak kena Rate Limit (Error 429)
      next: { revalidate: 3600 }, 
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!res.ok) {
      if (res.status === 429) {
        console.error("RATE LIMIT HIT! Tunggu sebentar...");
      }
      throw new Error(`API Error: ${res.status}`);
    }
    
    const json = await res.json();
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

  const dramaInfo = rawData.drama || rawData; 

  const episodes = extractArray(rawData.episodes || [])
    .map((ep: any) => ({
      id: String(ep.id || ep.chapter_id || ep.playlet_id),
      name: ep.chapter_title || ep.title || ep.name || `Episode ${ep.chapter_num || 1}`,
      video_url: ep.videoUrl || ep.video_url || ep.url || "",
    }))
    .filter((ep) => ep.video_url);

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
