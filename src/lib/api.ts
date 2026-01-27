// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sansekai.bospedia.com/api";

export async function getDramaDetail(id: string) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined in environment variables");
  }

  const endpoint = `${API_BASE_URL}/detail?id=${id}`;
  console.log(`[SERVER FETCH] Hit: ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      cache: "no-store", // Selalu fresh data
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    console.log(`[SERVER FETCH] Status: ${res.status}`);

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API Error ${res.status}: ${errorBody.slice(0, 100)}...`);
    }

    const json = await res.json();
    
    // Validasi struktur dasar
    if (!json || (!json.data && !json.status)) {
       throw new Error("Invalid API Response Structure");
    }

    // Normalisasi Data (PENTING: Buang field 'raw' biar ringan)
    // Asumsi response bisa { status: true, data: { ... } } atau langsung { ... }
    const rawData = json.data || json; 

    // Mapping episodes biar kecil payload-nya
    const episodes = Array.isArray(rawData.episodes) 
      ? rawData.episodes.map((ep: any) => ({
          id: String(ep.id),
          name: ep.title || ep.name || `Episode ${ep.id}`,
          video_url: ep.video_url || ep.videoUrl || "",
          // Kita buang 'raw', 'is_lock', dll.
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

  } catch (error: any) {
    console.error(`[SERVER FETCH FAIL] ${error.message}`);
    throw error; // Lempar lagi biar ditangkap page.tsx
  }
}
