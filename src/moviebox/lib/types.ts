// src/moviebox/lib/types.ts

export type SearchParams = {
  q?: string;
  genre?: string;      // ✅ single genre (query param)
  year?: string;
  country?: string;
  type?: string;

  // ✅ pagination (dari URL biasanya string)
  page?: string | number;
  limit?: string | number;

  // optional: mode tab kalau lu mau (latest/hot/for-you)
  tab?: string;
};

export type MovieItem = {
  id: string;
  title: string;
  poster: string;
  year: string;
  type: string;
  quality: string;
  rating?: string;
  genres: string[]; // ✅ wajib array biar NeoComponents gak error
};

export type FilterOption = { label: string; value: string };

export type FilterResponse = {
  genres: FilterOption[];
  years: FilterOption[];
  countries: FilterOption[];
  types: FilterOption[];
};

export type MoviesResponse = {
  items: MovieItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};
