// src/lib/movie-hub-api.ts
export interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: string;
  year: string;
  genre: string[];
}

const BASE_URL = process.env.NEXT_PUBLIC_MOVIE_API_BASE_URL || 'https://api-placeholder.com';

export const movieApi = {
  async getTrending(): Promise<Movie[]> {
    try {
      const res = await fetch(`${BASE_URL}/trending`, { next: { revalidate: 3600 } });
      const data = await res.json();
      // Normalisasi data agar sesuai interface kita
      return data.results.map((m: any) => ({
        id: m.id.toString(),
        title: m.title || m.name,
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '/placeholder.jpg',
        rating: m.vote_average?.toFixed(1) || '0.0',
        year: (m.release_date || m.first_air_date)?.split('-')[0] || 'N/A',
        genre: ['Movie'],
      }));
    } catch (err) {
      console.error("Movie API Error:", err);
      return [];
    }
  }
};
