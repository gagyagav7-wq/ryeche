// src/lib/movie-hub-api.ts

// PENTING: Ganti ke domain API Scraper v2.0 lu yang baru (misal: vps-lu.com atau localhost:port)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api-baru-lu.com"; 

/**
 * HELPER: Bersihin URL Thumbnail dari Proxy Rusia (zeldvorik.ru)
 * Kita ambil langsung URL aslinya biar gak lewat rute Rusia yang lag.
 */
const fixThumbnail = (rawUrl: string): string => {
  if (!rawUrl) return "";
  if (rawUrl.includes("zeldvorik.ru")) {
    const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
    const originalUrl = urlParams.get('url');
    // Rebahin biasanya nyimpen image di wp-content atau cdn tertentu
    return originalUrl ? `https://rebahin21.art/wp-content/uploads/${originalUrl}` : rawUrl;
  }
  return rawUrl;
};

export const movieApi = {
  async getHome() {
    const res = await fetch(`${API_BASE}/api/rebahin/home`, { next: { revalidate: 3600 } });
    const json = await res.json();
    // Normalisasi gambar pas narik data
    if (json.data) {
      json.data = json.data.map((m: any) => ({ ...m, thumbnail: fixThumbnail(m.thumbnail) }));
    }
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
    if (json.data) {
      json.data = json.data.map((m: any) => ({ ...m, thumbnail: fixThumbnail(m.thumbnail) }));
    }
    return json;
  },

  async getPlay(slug: string, ep: number = 1) {
    const res = await fetch(`${API_BASE}/api/rebahin/play/${slug}?ep=${ep}`, { cache: 'no-store' });
    return res.json();
  }
};
