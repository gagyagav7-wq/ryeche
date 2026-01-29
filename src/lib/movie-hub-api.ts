// src/lib/movie-hub-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://remote-concentration-streaming-models.trycloudflare.com"; 

/**
 * HELPER: Redirect Proxy Gambar Internal
 * Mengarahkan gambar dari zeldvorik.ru langsung ke /api/proxy lu sendiri.
 */
const fixThumbnail = (rawUrl: string): string => {
  if (!rawUrl) return "";
  
  if (rawUrl.includes("zeldvorik.ru")) {
    try {
      const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
      const filePath = urlParams.get('url');
      const originalImageUrl = `https://rebahin21.art/wp-content/uploads/${filePath}`;
      return `/api/proxy?url=${encodeURIComponent(originalImageUrl)}`;
    } catch {
      return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
    }
  }
  return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
};

export const movieHubApi = {
  // 1. Ambil List (home, trending, movies, series)
  async getHome(action: string = 'home', page: number = 1) {
    const res = await fetch(`${API_BASE}/api.php?action=${action}&page=${page}`, { 
      next: { revalidate: 3600 } 
    });
    const json = await res.json();
    
    if (json.data && Array.isArray(json.data)) {
      json.data = json.data.map((m: any) => ({
        ...m,
        thumbnail: fixThumbnail(m.thumbnail)
      }));
    }
    return json;
  },

  // 2. Detail Film
  async getDetail(slug: string) {
    const res = await fetch(`${API_BASE}/api.php?action=detail&slug=${slug}`, { 
      next: { revalidate: 3600 } 
    });
    const json = await res.json();
    
    if (json.data) {
      json.data.thumbnail = fixThumbnail(json.data.thumbnail);
    }
    return json;
  },

  // 3. Fitur Search
  async search(q: string) {
    const res = await fetch(`${API_BASE}/api.php?action=search&q=${encodeURIComponent(q)}`, { 
      cache: 'no-store' 
    });
    const json = await res.json();
    
    if (json.data && Array.isArray(json.data)) {
      json.data = json.data.map((m: any) => ({
        ...m,
        thumbnail: fixThumbnail(m.thumbnail)
      }));
    }
    return json;
  },

  // 4. Ambil Data Player (INI YANG HILANG TADI)
  async getPlay(slug: string, ep: number = 1) {
    const res = await fetch(`${API_BASE}/api.php?action=play&slug=${slug}&ep=${ep}`, { 
      cache: 'no-store' 
    });
    return res.json();
  }
};
