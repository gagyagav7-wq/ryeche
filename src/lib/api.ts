// src/lib/api.ts

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not set (server env).");
}

type FetchOpts = {
  revalidate?: number;   // for ISR
  noStore?: boolean;     // for truly dynamic
};

async function fetchAPI(path: string, opts: FetchOpts = {}) {
  const url = `${API_BASE_URL}${path}`;

  const fetchInit: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json",
    },
  };

  if (opts.noStore) {
    fetchInit.cache = "no-store";
  } else if (typeof opts.revalidate === "number") {
    fetchInit.next = { revalidate: opts.revalidate };
  }

  const res = await fetch(url, fetchInit);

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`API Error ${res.status}: ${errorBody.slice(0, 200)}`);
  }

  const json = await res.json();
  return json?.data ?? json;
}

// Detail
export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${encodeURIComponent(id)}`, { revalidate: 60 });

  const infoSrc = rawData?.drama ?? rawData?.info ?? rawData;

  if (!infoSrc) throw new Error("Invalid detail response: missing info.");

  const episodesRaw = rawData?.episodes;
  const episodes = Array.isArray(episodesRaw)
    ? episodesRaw.map((ep: any, idx: number) => ({
        id: String(ep?.id ?? idx),
        name: String(ep?.title ?? ep?.name ?? `Episode ${idx + 1}`),
        video_url: String(ep?.video_url ?? ep?.videoUrl ?? ep?.raw?.videoUrl ?? ""),
      }))
    : [];

  return {
    info: {
      id: String(infoSrc?.id ?? infoSrc?.playlet_id ?? id),
      title: String(infoSrc?.title ?? "Unknown Title"),
      synopsis: String(infoSrc?.synopsis ?? infoSrc?.introduce ?? infoSrc?.description ?? ""),
      cover_url: String(
        infoSrc?.cover_url ??
        infoSrc?.cover ??
        infoSrc?.cover_vertical ??
        infoSrc?.cover_square ??
        infoSrc?.thumbnail ??
        ""
      ),
    },
    episodes,
  };
}

// Search (sementara keep query=, tapi lu harus verify)
export async function searchDrama(query: string) {
  return await fetchAPI(`/search?query=${encodeURIComponent(query)}`, { revalidate: 60 });
}

export async function getForYou() {
  return await fetchAPI(`/foryou`, { revalidate: 60 });
}

export async function getHotRank() {
  return await fetchAPI(`/hotrank`, { revalidate: 60 });
}

export async function getLatest() {
  return await fetchAPI(`/latest`, { revalidate: 60 });
}
