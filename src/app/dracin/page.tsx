"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
// --- NEW: Import Komponen Switcher ---
import ProviderSwitcher from "@/components/ProviderSwitcher";

// --- CONSTANTS & ICONS ---
const FALLBACK_IMG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTdFNUQ4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiMwRjE3MkEiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QlVUVEVSSEVCPC90ZXh0Pjwvc3ZnPg==";

const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconFire = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF9F1C]"><path d="M8.5,14.5c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4S8.5,16.7,8.5,14.5z M12.5,3c-3,2.5-5,6-5,9.5c0,3.6,2.2,6.5,5,7.5 c2.8-1,5-3.9,5-7.5C17.5,9,15.5,5.5,12.5,3z"/></svg>;
const IconStar = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF99C8]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M5 3l14 9-14 9V3z"/></svg>;
const IconLoading = () => <svg className="animate-spin h-8 w-8 text-[#0F172A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

interface Movie {
  id: string | number;
  title: string;
  cover: string;
  ep: string | number;
  tag: string;
  tags: string[]; 
}

export default function DracinPage() {
  const [activeTab, setActiveTab] = useState("LATEST"); 
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. DYNAMIC GENRES LOGIC (MODE A) ---
  const GENRES_DYNAMIC = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach((movie) => {
      movie.tags?.forEach((tag) => genreSet.add(tag));
    });
    return ["Semua", ...Array.from(genreSet).sort()];
  }, [movies]);

  const visibleMovies = useMemo(() => {
    if (selectedGenre === "Semua") return movies;
    return movies.filter((movie) => movie.tags?.includes(selectedGenre));
  }, [movies, selectedGenre]);

  // --- 2. FETCH LOGIC ---
  const fetchMovies = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    let url = "";

    const base = "https://api.sansekai.my.id/api/flickreels";

    if (query) {
      url = `${base}/search?query=${encodeURIComponent(query)}`;
    } else {
      switch (activeTab) {
        case "HOT": url = `${base}/hotrank`; break;
        case "FORYOU": url = `${base}/foryou`; break;
        case "LATEST": default: url = `${base}/latest`; break;
      }
    }

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      
      const json = await res.json();
      let rawData: any[] = [];

      if (query) {
        rawData = json.data || [];
      } else {
        if (activeTab === "HOT") rawData = json.data?.[0]?.data || [];
        else if (activeTab === "LATEST") rawData = json.data?.[0]?.list || [];
        else if (activeTab === "FORYOU") rawData = json.data?.list || [];
      }

      if (!Array.isArray(rawData)) throw new Error("Format data tidak sesuai");

      const normalized: Movie[] = rawData.map((item: any) => {
        const tags: string[] = 
          Array.isArray(item.playlet_tag_name) ? item.playlet_tag_name
          : Array.isArray(item.tag_name) ? item.tag_name
          : Array.isArray(item.tag_list) ? item.tag_list.map((t: any) => t?.tag_name).filter(Boolean)
          : Array.isArray(item.tag_list_with_id) ? item.tag_list_with_id.map((t: any) => t?.name).filter(Boolean)
          : [];

        return {
          id: item.playlet_id || item.id || item.book_id,
          title: item.title || "Tanpa Judul",
          cover: item.cover || "",
          ep: item.upload_num || item.episodes || "Ongoing",
          tag: tags[0] || "Drama",
          tags: tags,
        };
      }).filter(m => m.id);

      setMovies(normalized);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Fetch failure:", err);
        setError("Gagal memuat koleksi, Bre.");
        setMovies([]);
      }
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [activeTab, query]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchMovies(controller.signal);
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [fetchMovies]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#FF9F1C] pb-24">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* HEADER */}
      <header className="relative z-20 sticky top-0 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* 1. LOGO AREA */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Link href="/dashboard" className="w-12 h-12 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[3px_3px_0px_#0F172A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF9F1C]/50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black uppercase leading-none tracking-tight flex items-end gap-1">
                        BUTTER<span className="text-[#FF9F1C]">HUB</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#0F172A] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">DRACIN</span>
                        <span className="w-[2px] h-3 bg-[#0F172A]/20"></span>
                        <span className="text-[9px] font-bold text-[#0F172A] opacity-60 uppercase tracking-widest leading-none">by FlickReels</span>
                    </div>
                </div>
            </div>

            {/* 2. SERVER SWITCHER (NEW) */}
            <div className="flex justify-center w-full md:w-auto">
              {/* Komponen ini menangani margin sendiri (mb-6) yang akan memberi jarak sedikit ke Search Bar di mobile */}
              <ProviderSwitcher />
            </div>

            {/* 3. SEARCH BAR */}
            <div className="relative w-full md:w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0F172A]/40">
                    <IconSearch />
                </div>
                <input 
                    type="text" 
                    placeholder="Cari judul drama..." 
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedGenre("Semua"); }}
                    className="w-full pl-12 pr-4 py-3 bg-white border-[3px] border-[#0F172A] rounded-full font-bold text-sm focus:outline-none focus:border-[#FF9F1C] focus:shadow-[4px_4px_0px_#FF9F1C] transition-all placeholder:text-gray-300"
                />
            </div>
        </div>
      </header>

      {/* MAIN TABS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-4" role="tablist">
        <div className="flex flex-wrap gap-3">
            {[
                { id: "LATEST", label: "Latest Drop", icon: <IconClock />, color: "bg-[#2EC4B6] text-white" },
                { id: "HOT", label: "Hot Ranking", icon: <IconFire />, color: "bg-[#FF9F1C] text-white" },
                { id: "FORYOU", label: "For You", icon: <IconStar />, color: "bg-[#FF99C8] text-[#0F172A]" },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id && !query}
                    onClick={() => { setActiveTab(tab.id); setQuery(""); setSelectedGenre("Semua"); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-xs tracking-wide transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2EC4B6] ${
                        activeTab === tab.id && !query
                        ? `${tab.color} shadow-[4px_4px_0px_#0F172A] -translate-y-[2px]` 
                        : "bg-white text-[#0F172A] hover:bg-gray-50"
                    }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
      </section>

      {/* DYNAMIC GENRE BAR (MODE A) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar" role="tablist" aria-label="Genre Selection">
            <span className="text-[10px] font-black uppercase opacity-40 shrink-0">Genre:</span>
            {GENRES_DYNAMIC.map((genre) => (
                <button
                    key={genre}
                    role="tab"
                    aria-selected={selectedGenre === genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`shrink-0 px-4 py-1.5 rounded-lg border-[2px] border-[#0F172A] text-[10px] font-black uppercase transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#CBEF43] ${
                        selectedGenre === genre 
                        ? "bg-[#CBEF43] shadow-[3px_3px_0px_#0F172A] -translate-y-[1px]" 
                        : "bg-white opacity-60 hover:opacity-100"
                    }`}
                >
                    {genre}
                </button>
            ))}
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end gap-3 mb-6 border-b-[3px] border-[#0F172A] pb-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {selectedGenre !== "Semua" ? `Genre: ${selectedGenre}` : query ? `Search: "${query}"` : activeTab === 'HOT' ? "Trending Now 🔥" : activeTab === 'FORYOU' ? "Curated Picks ✨" : "Fresh Drops 🕒"}
            </h2>
            <p className="text-xs font-bold opacity-50 mb-1 uppercase tracking-widest">
                {loading ? "FETCHING..." : `${visibleMovies.length} TITLES`}
            </p>
        </div>

        {error ? (
          <div className="bg-red-100 border-[3px] border-red-500 p-8 text-center rounded-xl shadow-[6px_6px_0px_#EF4444]">
             <p className="font-black uppercase text-red-600">{error}</p>
          </div>
        ) : loading ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-50">
              <IconLoading />
              <p className="mt-4 font-black uppercase text-[10px] tracking-[0.4em]">Synchronizing Archives...</p>
           </div>
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {visibleMovies.map((movie) => (
                <div key={movie.id} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_#0F172A] hover:-translate-y-[4px] hover:shadow-[10px_10px_0px_#FF9F1C] transition-all duration-300">
                    <div className="aspect-[3/4] bg-[#E7E5D8] relative overflow-hidden border-b-[3px] border-[#0F172A]">
                        <Image 
                            src={movie.cover || FALLBACK_IMG}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <Link 
                                href={`/dracin/${movie.id}`} 
                                prefetch={false}
                                className="w-full py-3 bg-[#FF9F1C] border-[2px] border-[#0F172A] rounded-lg font-black uppercase text-white text-[10px] shadow-[3px_3px_0px_#0F172A] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white text-center"
                            >
                                <IconPlay /> Watch Now
                            </Link>
                        </div>
                        <div className="absolute top-3 right-3 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-1 rounded-md text-[9px] font-black text-[#0F172A] shadow-sm">
                            {movie.ep} EP
                        </div>
                    </div>
                    <div className="p-4 bg-white">
                        <span className="text-[8px] font-black uppercase bg-[#0F172A] text-white px-2 py-0.5 rounded-sm mb-2 inline-block tracking-tighter">
                            {movie.tag}
                        </span>
                        <h3 className="font-black text-sm md:text-base leading-tight uppercase line-clamp-2 group-hover:text-[#FF9F1C] transition-colors tracking-tight">
                            {movie.title}
                        </h3>
                    </div>
                </div>
            ))}
           </div>
        )}

        {!loading && !error && visibleMovies.length === 0 && (
            <div className="mt-10 bg-white border-[3px] border-[#0F172A] rounded-[20px] p-12 shadow-[10px_10px_0px_#FF99C8] text-center max-w-lg mx-auto">
                <div className="text-4xl mb-4">🏝️</div>
                <h3 className="text-2xl font-black uppercase mb-2">The beach is empty</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                    Genre "{selectedGenre}" gak nemu di list ini, Bre.
                </p>
            </div>
        )}
      </section>
    </main>
  );
}
