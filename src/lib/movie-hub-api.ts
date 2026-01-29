// src/lib/movie-hub-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api-scraper-anda.com"; 

// Helper: Bersihkan URL dari proxy zeldvorik.ru
const fixThumbnail = (rawUrl: string): string => {
  if (!rawUrl || !rawUrl.includes("zeldvorik.ru")) return rawUrl;
  try {
    const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
    const originalUrl = urlParams.get('url');
    return originalUrl ? `https://rebahin21.art/wp-content/uploads/${originalUrl}` : rawUrl;
  } catch {
    return rawUrl;
  }
};

export const movieHubApi = { // <--- Pastikan namanya 'movieHubApi'
  async getHome() {
    const res = await fetch(`${API_BASE}/api/rebahin/home`, { next: { revalidate: 3600 } });
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

  async searchMovies(q: string) {
    const res = await fetch(`${API_BASE}/api/rebahin/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.data) json.data = json.data.map((m: any) => ({ ...m, thumbnail: fixThumbnail(m.thumbnail) }));
    return json;
  },

  async getPlay(slug: string, ep: number = 1) {
    const res = await fetch(`${API_BASE}/api/rebahin/play/${slug}?ep=${ep}`, { cache: 'no-store' });
    return res.json();
  }
};
