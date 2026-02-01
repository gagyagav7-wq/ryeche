// src/moviebox/lib/types.ts

// Next.js searchParams bisa jadi string, string[], atau undefined
export type QueryValue = string | string[] | undefined;

export type SearchParams = {
  q?: QueryValue;

  // ✅ penting: dari URL bisa "Action" / ["Action","Comedy"] / "Action,Comedy" / undefined
  // jadi jangan dipaksa string[] di type
  genres?: QueryValue;

  year?: QueryValue;
  country?: QueryValue;
  type?: QueryValue;

  // ✅ pagination dari URL biasanya string, tapi kadang lu set number di code
  page?: QueryValue | number;
  limit?: QueryValue | number;
};

export type MovieItem = {
  id: string;
  title: string;
  poster: string;
  year: string;
  type: string;
  quality: string;
  rating?: string;

  // ✅ UI aman: selalu array
  genres: string[];
};

export type FilterOption = { label: string; value: string };

export type FilterResponse = {
  genres: FilterOption[];
  years: FilterOption[];
  countries: FilterOption[];
  types: FilterOption[];
};

// ✅ response pagination untuk MovieHub
export type MoviesResponse = {
  items: MovieItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};
