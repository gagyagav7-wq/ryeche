// src/lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api/flickreels";

/**
 * Normalize agar hasil "list" selalu array.
 * Banyak API kadang balikin:
 * - []
 * - { data: [] }
 * - { list: [] }
 * - { items: [] }
 * - { data: { list: [] } }
 */
function asArray(input: any): any[] {
  if (Array.isArray(input)) return input;

  if (Array.isArray(input?.data)) return input.data;
  if (Array.isArray(input?.list)) return input.list;
  if (Array.isArray(input?.items)) return input.items;

  if (Array.isArray(input?.data?.list)) return input.data.list;
  if (Array.isArray(input?.data?.items)) return input.data.items;

  return [];
}

/**
 * Normalize payload response:
 * - kadang { data: ... }
 * - kadang { result: ... }
 * - kadang langsung object/array
 */
function unwrapResponse(json: any) {
  if (json == null) return null;
  if (json.data != null) return json.data;
  if (json.result != null) return json.result;
  return json;
}

async function fetchAPI(path: string) {
  const url = `${API_BASE_URL}${path}`;
  console.log(`[SERVER FETCH] ${url}`);

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`API Error ${res.status}: ${errorBody.slice(0, 120)}`);
  }

  const json = await res.json().catch(() => null);
  const unwrapped = unwrapResponse(json);
  return unwrapped;
}

// =======================
// DETAIL + EPISODES
// =======================
export async function getDramaDetail(id: string) {
  const rawData = await fetchAPI(`/detailAndAllEpisode?id=${encodeURIComponent(id)}`);

  // Ambil info dari beberapa kemungkinan struktur
  const infoSrc = rawData?.info || rawData?.drama || rawData || {};

  const info = {
    id: String(infoSrc?.id ?? infoSrc?.playlet_id ?? id),
    title: String(infoSrc?.title ?? rawData?.title ?? "Unknown Title"),
    synopsis: String(infoSrc?.synopsis ?? infoSrc?.introduce ?? rawData?.synopsis ?? ""),
    cover_url: String(
      infoSrc?.cover_url ??
        infoSrc?.cover ??
        infoSrc?.cover_square ??
        infoSrc?.cover_vertical ??
        rawData?.thumbnail ??
        rawData?.cover_url ??
        ""
    ),
  };

  const epsRaw = rawData?.episodes ?? rawData?.episode_list ?? rawData?.data?.episodes ?? [];
  const episodesArr = asArray(epsRaw);

  const episodes = episodesArr.map((ep: any, idx: number) => {
    const epId = String(ep?.id ?? ep?.episode_id ?? idx + 1);
    const name = String(ep?.name ?? ep?.title ?? `Episode ${idx + 1}`);
    const video_url = String(ep?.video_url ?? ep?.videoUrl ?? ep?.raw?.videoUrl ?? "");

    return { id: epId, name, video_url };
  });

  return { info, episodes };
}

// =======================
// SEARCH (LIST)
// =======================
export async function searchDrama(query: string) {
  const raw = await fetchAPI(`/search?query=${encodeURIComponent(query)}`);
  return asArray(raw);
}

// =======================
// HOME LISTS
// =======================
export async function getForYou() {
  const raw = await fetchAPI(`/foryou`);
  return asArray(raw);
}

export async function getHotRank() {
  const raw = await fetchAPI(`/hotrank`);
  return asArray(raw);
}

export async function getLatest() {
  const raw = await fetchAPI(`/latest`);
  return asArray(raw);
}
