// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

// --- HELPERS NORMALISASI ---

const asArray = (x: any) => {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.items)) return x.items;
  if (x && Array.isArray(x.data)) return x.data;
  return [];
};

const normalizeCard = (d: any) => ({
  id: String(d.id || d.drama_id || ""),
  title: d.title || d.name || "Untitled",
  cover_url: d.cover_url || d.cover || d.thumbnail || d.cover_square || d.cover_vertical || "",
  total_ep: d.total_ep || d.episode_count || "?"
});

async function fetchAPI(path: string) {
  const url = `${API_BASE_URL}${path}`;
  console.log(`[SERVER FETCH] Hit: ${url}`);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API Error ${res.status}: ${errorBody.slice(0, 100)}`);
    }

    const json = await res.json();
    return json.data || json; 
  } catch (error: any) {
    console.error(`[FETCH ERROR] ${url}: ${error.message}`);
    throw error;
  }
}

// --- EXPORTED FUNCTIONS ---

export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${id}`);
  
  const episodes = Array.isArray(rawData.episodes) 
    ? rawData.episodes.map((ep: any) => ({
        id: String(ep.id),
        name: ep.title || ep.name || `Episode ${ep.id}`,
        video_url: ep.video_url || ep.videoUrl || "",
      }))
    : [];

  return {
    info: {
      id: String(id),
      title: rawData.title || rawData.info?.title || "Unknown Title",
      synopsis: rawData.synopsis || rawData.info?.synopsis || "",
      cover_url: rawData.thumbnail || rawData.info?.cover || "",
    },
    episodes: episodes,
  };
}

export async function searchDrama(query: string) {
  const raw = await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
  return asArray(raw).map(normalizeCard);
}

export async function getForYou() {
  const raw = await fetchAPI(`/foryou`);
  return asArray(raw).map(normalizeCard);
}

export async function getHotRank() {
  const raw = await fetchAPI(`/hotrank`);
  return asArray(raw).map(normalizeCard);
}

export async function getLatest() {
  const raw = await fetchAPI(`/latest`);
  return asArray(raw).map(normalizeCard);
}
