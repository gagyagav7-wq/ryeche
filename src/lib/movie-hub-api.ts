const BASE_URL = "https://zeldvorik.ru/rebahin21/api.php";

export const movieHubApi = {
  async getList(action: 'home' | 'trending' | 'movies' | 'series', page: number = 1) {
    const res = await fetch(`${BASE_URL}?action=${action}&page=${page}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async search(q: string, page: number = 1) {
    const res = await fetch(`${BASE_URL}?action=search&q=${encodeURIComponent(q)}&page=${page}`, { cache: 'no-store' });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async getDetail(slug: string) {
    const res = await fetch(`${BASE_URL}?action=detail&slug=${slug}`, { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.success ? json.data : null;
  }
};
