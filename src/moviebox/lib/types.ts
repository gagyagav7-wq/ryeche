export interface MovieItem {
  id: string; // URL asli atau ID unik
  title: string;
  poster: string;
  year?: string;
  type: "Movie" | "Series";
  quality: "HD" | "CAM" | "RAW";
  rating?: string;
  genres: string[];
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterResponse {
  genres: FilterOption[];
  years: FilterOption[];
  types: FilterOption[];
  countries: FilterOption[];
}

export interface SearchParams {
  q?: string;
  genre?: string;
  year?: string;
  type?: string;
  country?: string;
  sort?: "latest" | "hot" | "foryou";
}

export type SearchParams = {
  q?: string;
  genre?: string;
  year?: string;
  country?: string;
  type?: string;

  // ✅ pagination
  page?: string | number;
  limit?: string | number;
};
