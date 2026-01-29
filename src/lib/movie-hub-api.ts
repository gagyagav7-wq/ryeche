// src/lib/movie-hub-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://remote-concentration-streaming-models.trycloudflare.com"; 

/**
 * HELPER: Redirect Proxy Gambar
 * Mengubah: https://zeldvorik.ru/rebahin21/proxy.php?url=ABC
 * Menjadi: https://domain-lu.com/api/rebahin/proxy?url=ABC
 */
const fixThumbnail = (rawUrl: string): string => {
  if (!rawUrl) return "";
  // Jika URL mengandung proxy Rusia, kita ganti ke proxy VPS lu
  if (rawUrl.includes("zeldvorik.ru")) {
    const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
    const filePath = urlParams.get('url');
    // Asumsi scraper v2.0 lu punya endpoint proxy di /api/rebahin/proxy
    return filePath ? `${API_BASE}/api/rebahin/proxy?url=${encodeURIComponent(filePath)}` : rawUrl;
  }
  return rawUrl;
};

export const movieHubApi = {
  async getHome(action: string = 'home', page: number = 1) {
    try {
      const res = await fetch(`${API_BASE}/api/rebahin/${action}?page=${page}`, { 
        next: { revalidate: 3600 } 
      });
      const json = await res.json();
      
      if (json.data && Array.isArray(json.data)) {
        json.data = json.data.map((m: any) => ({
          ...m,
          thumbnail: fixThumbnail(m.thumbnail) // Bersihkan proxy Rusia
        }));
      }
      return json;
    } catch (err) {
      console.error("API Error:", err);
      return { success: false, data: [] };
    }
  },

  async getDetail(slug: string) {
    try {
      const res = await fetch(`${API_BASE}/api/rebahin/detail/${slug}`, { 
        next: { revalidate: 3600 } 
      });
      const json = await res.json();
      
      if (json.data) {
        json.data.thumbnail = fixThumbnail(json.data.thumbnail);
      }
      return json;
    } catch (err) {
      return { success: false, data: null };
    }
  },

  async search(q: string) {
    const res = await fetch(`${API_BASE}/api/rebahin/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.data) {
      json.data = json.data.map((m: any) => ({ ...m, thumbnail: fixThumbnail(m.thumbnail) }));
    }
    return json;
  }
};
