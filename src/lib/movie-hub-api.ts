// src/lib/movie-hub-api.ts

// 1. Interface untuk List Film (Home/Trending/Search)
export interface Movie {
  slug: string;
  title: string;
  thumbnail: string;
  rating: string;
  year: string;
  type: 'series' | 'movie';
}

// 2. Interface untuk Detail Film
export interface MovieDetail extends Movie {
  genres: string[];
  synopsis: string;
  player_url: string;
  episodes?: {
    episode: number;
    player_url: string;
  }[];
}

const BASE_URL = "https://zeldvorik.ru/rebahin21/api.php";

export const movieApi = {
  // Ambil list film (home, trending, movies, series)
  async getHome(action: string = 'home', page: number = 1) {
    try {
      const res = await fetch(`${BASE_URL}?action=${action}&page=${page}`, { 
        cache: 'no-store' 
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return await res.json();
    } catch (err) {
      console.error("Movie API Error (getHome):", err);
      return { success: false, data: [] };
    }
  },

  // Ambil detail film berdasarkan slug
  async getDetail(slug: string) {
    try {
      const res = await fetch(`${BASE_URL}?action=detail&slug=${slug}`, { 
        cache: 'no-store' 
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return await res.json();
    } catch (err) {
      console.error("Movie API Error (getDetail):", err);
      return { success: false, data: null };
    }
  },

  // Fitur Pencarian
  async search(query: string, page: number = 1) {
    try {
      const res = await fetch(`${BASE_URL}?action=search&q=${encodeURIComponent(query)}&page=${page}`, { 
        cache: 'no-store' 
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return await res.json();
    } catch (err) {
      console.error("Movie API Error (search):", err);
      return { success: false, data: [] };
    }
  }
};
