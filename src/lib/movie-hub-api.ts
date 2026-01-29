// src/lib/movie-hub-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://remote-concentration-streaming-models.trycloudflare.com"; 

/**
 * HELPER: Bersihkan URL Rusia dan lewatkan ke Proxy Internal Next.js Lu
 * Mengarahkan gambar dari zeldvorik.ru langsung ke /api/proxy lu sendiri.
 */
const fixThumbnail = (rawUrl: string): string => {
  if (!rawUrl) return "";
  
  // Jika URL berasal dari proxy Rusia (zeldvorik.ru)
  if (rawUrl.includes("zeldvorik.ru")) {
    try {
      const urlParams = new URLSearchParams(rawUrl.split('?')[1]);
      const filePath = urlParams.get('url');
      
      // Kita susun URL asli Rebahin (Tanpa lewat server Rusia)
      const originalImageUrl = `https://rebahin21.art/wp-content/uploads/${filePath}`;
      
      // Bungkus dengan Proxy Internal lu (/api/proxy)
      return `/api/proxy?url=${encodeURIComponent(originalImageUrl)}`;
    } catch (e) {
      return rawUrl;
    }
  }
  
  // Jika URL lain, tetep lewatkan ke proxy agar aman dari blokir CORS
  return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
};

export const movieHubApi = {
  // Ambil Data Home (Latest)
  async getHome(action: string = 'home', page: number = 1) {
    const res = await fetch(`${API_BASE}/api/rebahin/${action}?page=${page}`, { 
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

  // Ambil Detail Film (Lengkap dengan Cast & Synopsis)
  async getDetail(slug: string) {
    const res = await fetch(`${API_BASE}/api/rebahin/detail/${slug}`, { 
      next: { revalidate: 3600 } 
    });
    const json = await res.json();
    
    if (json.data) {
      json.data.thumbnail = fixThumbnail(json.data.thumbnail);
    }
    return json;
  },

  // Fitur Pencarian Movie Hub
  async search(q: string) {
    const res = await fetch(`${API_BASE}/api/rebahin/search?q=${encodeURIComponent(q)}`, { 
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

  // Ambil Data Streaming (Server & Episode)
  async getPlay(slug: string, ep: number = 1) {
    const res = await fetch(`${API_BASE}/api/rebahin/play/${slug}?ep=${ep}`, { 
      cache: 'no-store' 
    });
    return res.json();
  }
};
