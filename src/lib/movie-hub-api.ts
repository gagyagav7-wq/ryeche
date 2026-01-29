// src/lib/movie-hub-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://remote-concentration-streaming-models.trycloudflare.com"; 

const fixThumbnail = (rawUrl: string): string => {
  if (!rawUrl || !rawUrl.includes("zeldvorik.ru")) return rawUrl;
  try {
    const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
    const filePath = urlParams.get('url');
    return filePath ? `${API_BASE}/api/rebahin/proxy?url=${encodeURIComponent(filePath)}` : rawUrl;
  } catch {
    return rawUrl;
  }
};

export const movieHubApi = {
  async getHome(action: string = 'home', page: number = 1) {
    const res = await fetch(`${API_BASE}/api/rebahin/${action}?page=${page}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    if (json.data) json.data = json.data.map((m: any) => ({ ...m, thumbnail: fixThumbnail(m.thumbnail) }));
    return json;
  },

  async getDetail(slug: string) {
    const res = await fetch(`${API_BASE}/api/rebahin/detail/${slug}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    if (json.data) json.data.thumbnail = fixThumbnail(json.data.thumbnail);
    return json;
  },

  async search(q: string) {
    const res = await fetch(`${API_BASE}/api/rebahin/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.data) json.data = json.data.map((m: any) => ({ ...m, thumbnail: fixThumbnail(m.thumbnail) }));
    return json;
  },

  // --- INI YANG TADI KETINGGALAN, BRE! ---
  async getPlay(slug: string, ep: number = 1) {
    const res = await fetch(`${API_BASE}/api/rebahin/play/${slug}?ep=${ep}`, { cache: 'no-store' });
    return res.json();
  }
};
