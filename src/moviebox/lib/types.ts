export type SearchParams = {
  q?: string;
  genres: string[];
  year?: string;
  country?: string;
  type?: string;

  // ✅ pagination params (dari URL biasanya string)
  page?: string | number;
  limit?: string | number;
};

export type MovieItem = {
  id: string;
  title: string;
  poster: string;
  year: string;
  type: string;
  quality: string;
  rating?: string;
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
