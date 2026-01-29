// src/lib/movie-hub-api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api-scraper-anda.com"; 

export const movieApi = {
  // Ambil data Home (Trending & Latest)
  async getHome() {
    const res = await fetch(`${API_BASE}/api/rebahin/home`, { next: { revalidate: 3600 } });
    return res.json();
  },
  
  // Ambil list film saja
  async getMovies(page: number = 1) {
    const endpoint = page > 1 ? `/api/rebahin/movie/page/${page}` : `/api/rebahin/movie`;
    const res = await fetch(`${API_BASE}${endpoint}`, { next: { revalidate: 3600 } });
    return res.json();
  },

  // Detail Film
  async getDetail(slug: string) {
    const res = await fetch(`${API_BASE}/api/rebahin/detail/${slug}`, { next: { revalidate: 3600 } });
    return res.json();
  },

  // Streaming Links & Servers
  async getPlay(slug: string, ep: number = 1) {
    const res = await fetch(`${API_BASE}/api/rebahin/play/${slug}?ep=${ep}`, { cache: 'no-store' });
    return res.json();
  }
};
