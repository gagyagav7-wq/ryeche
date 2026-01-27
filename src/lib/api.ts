// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sansekai.bospedia.com/api";

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

export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detail?id=${id}`);
  
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
  return await fetchAPI(`/search?q=${encodeURIComponent(query)}`);
}

export async function getForYou() {
  return await fetchAPI(`/foryou`);
}

export async function getHotRank() {
  return await fetchAPI(`/hotrank`);
}

// FIX: Nama disamakan jadi getLatest supaya build lolos
export async function getLatest() {
  return await fetchAPI(`/latest`);
}
