"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// --- ICONS ---
const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconFire = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF9F1C]"><path d="M8.5,14.5c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4S8.5,16.7,8.5,14.5z M12.5,3c-3,2.5-5,6-5,9.5c0,3.6,2.2,6.5,5,7.5 c2.8-1,5-3.9,5-7.5C17.5,9,15.5,5.5,12.5,3z"/></svg>;
const IconStar = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF99C8]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M5 3l14 9-14 9V3z"/></svg>;
const IconLoading = () => <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

interface Movie {
  id: string | number;
  title: string;
  cover: string;
  ep: string | number;
  tag: string;
}

export default function DracinPage() {
  const [activeTab, setActiveTab] = useState("LATEST"); 
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- STATE PAGINATION ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // --- FUNGSI FETCH API ---
  const fetchMovies = useCallback(async (pageNum: number, isNewTab: boolean = false) => {
    if (loading) return;
    setLoading(true);

    let url = "";
    const base = "https://api.sansekai.my.id/api/flickreels";
    
    if (query) {
      url = `${base}/search?query=${query}&page=${pageNum}`;
    } else {
      switch (activeTab) {
        case "HOT": url = `${base}/hotrank?page=${pageNum}`; break;
        case "FORYOU": url = `${base}/foryou?page=${pageNum}`; break;
        case "LATEST": 
        default: url = `${base}/latest?page=${pageNum}`; break;
      }
    }

    try {
      const res = await fetch(url);
      const json = await res.json();
      
      let rawData: any[] = [];
      if (query) rawData = json.data || [];
      else if (activeTab === "HOT") rawData = json.data?.[0]?.data || [];
      else if (activeTab === "LATEST") rawData = json.data?.[0]?.list || [];
      else if (activeTab === "FORYOU") rawData = json.data?.list || [];

      const normalized: Movie[] = rawData.map((item: any) => ({
        id: item.playlet_id || item.id || item.book_id,
        title: item.title || "Untitled",
        cover: item.cover,
        ep: item.upload_num || item.episodes || "On Going",
        tag: item.playlet_tag_name?.[0] || item.tag_list?.[0]?.tag_name || item.tag_name?.[0] || "Drama"
      })).filter(m => m.id);

      if (normalized.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => {
          if (isNewTab) return normalized;
          // Filter Duplikat ID biar gak ada film sama yang nongol dua kali
          const existingIds = new Set(prev.map(m => String(m.id)));
          const uniqueNew = normalized.filter(m => !existingIds.has(String(m.id)));
          
          if (uniqueNew.length === 0) {
            setHasMore(false);
            return prev;
          }
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [activeTab, query, loading]);

  // RESET SAAT GANTI TAB / SEARCH
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1, true);
  }, [activeTab, query]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#FF9F1C] pb-24">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* HEADER */}
      <header className="relative z-30 sticky top-0 bg-[#FFFDF7]/90 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Link href="/dashboard" className="w-12 h-12 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[3px_3px_0px_#0F172A] shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black uppercase leading-none tracking-tight flex items-end gap-1">
                        BUTTER<span className="text-[#FF9F1C]">HUB</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#0F172A] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">DRACIN</span>
                        <span className="w-[2px] h-3 bg-[#0F172A]/20"></span>
                        <span className="text-[9px] font-bold text-[#0F172A] opacity-60 uppercase tracking-widest">by FlickReels</span>
                    </div>
                </div>
            </div>

            <div className="relative w-full md:w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0F172A]/40">
                    <IconSearch />
                </div>
                <input 
                    type="text" 
                    placeholder="Cari judul drama..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-[3px] border-[#0F172A] rounded-full font-bold text-sm focus:outline-none focus:border-[#FF9F1C] focus:shadow-[4px_4px_0px_#FF9F1C] focus:-translate-y-[2px] transition-all placeholder:text-gray-300"
                />
            </div>
        </div>
      </header>

      {/* TABS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-8">
        <div className="flex flex-wrap gap-3">
            {[
                { id: "LATEST", label: "Latest Drop", icon: <IconClock />, color: "bg-[#2EC4B6] text-white" },
                { id: "HOT", label: "Hot Ranking", icon: <IconFire />, color: "bg-[#FF9F1C] text-white" },
                { id: "FORYOU", label: "For You", icon: <IconStar />, color: "bg-[#FF99C8] text-[#0F172A]" },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-xs tracking-wide transition-all ${
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

      {/* CONTENT GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="flex items-end gap-3 mb-6 border-b-[3px] border-[#0F172A] pb-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {query ? `Search: "${query}"` : activeTab === 'HOT' ? "Trending Now 🔥" : activeTab === 'FORYOU' ? "Curated Picks ✨" : "Fresh Drops 🕒"}
            </h2>
            <p className="text-xs font-bold opacity-50 mb-1 uppercase">
                Showing {movies.length} TITLES
            </p>
        </div>

        {/* LOADING AWAL */}
        {loading && page === 1 ? (
           <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <IconLoading />
              <p className="mt-4 font-black uppercase text-xs tracking-widest">Waking up the projectionist...</p>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                  <div key={`${movie.id}-${index}`} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[16px] overflow-hidden shadow-[4px_4px_0px_#0F172A] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300">
                      <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden border-b-[3px] border-[#0F172A]">
                          <Image 
                              src={movie.cover}
                              alt={movie.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                              unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <Link href={`/dracin/${movie.id}`} className="w-full">
                                  <button className="w-full py-3 bg-[#FF9F1C] border-[2px] border-[#0F172A] rounded-lg font-black uppercase text-white text-xs shadow-[2px_2px_0px_#0F172A] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                                      <IconPlay /> Watch Now
                                  </button>
                              </Link>
                          </div>
                          <div className="absolute top-3 right-3 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-1 rounded-md text-[10px] font-black text-[#0F172A] shadow-sm">
                              {movie.ep} EP
                          </div>
                      </div>
                      <div className="p-4 bg-white">
                          <div className="flex items-center gap-2 mb-2">
                                <span className="text-[8px] font-bold uppercase bg-[#E7E5D8] px-1.5 py-0.5 rounded text-[#0F172A] border border-[#0F172A]/20 line-clamp-1">
                                  {movie.tag}
                                </span>
                          </div>
                          <h3 className="font-black text-sm md:text-base leading-tight uppercase line-clamp-2 group-hover:text-[#FF9F1C] transition-colors">
                              {movie.title}
                          </h3>
                      </div>
                  </div>
              ))}
            </div>

            {/* --- LOAD MORE BUTTON AREA --- */}
            <div className="mt-16 flex flex-col items-center gap-6">
                {hasMore ? (
                    <button 
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="group relative flex items-center gap-3 px-10 py-4 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-xl font-black uppercase text-sm shadow-[6px_6px_0px_#0F172A] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#0F172A] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <IconLoading /> : "See More Dramas"}
                        {!loading && <span className="group-hover:translate-x-1 transition-transform">🌴</span>}
                    </button>
                ) : (
                    <div className="bg-white border-[3px] border-[#0F172A] px-8 py-4 shadow-[4px_4px_0px_#0F172A]">
                        <p className="text-xs font-black uppercase tracking-widest italic">You've reached the end of the collection 🏝️</p>
                    </div>
                )}
            </div>
          </>
        )}

        {/* EMPTY STATE */}
        {!loading && movies.length === 0 && (
            <div className="mt-10 bg-white border-[3px] border-[#0F172A] rounded-[16px] p-8 md:p-12 shadow-[6px_6px_0px_#0F172A] text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-[#E7E5D8] border-[3px] border-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤔</div>
                <h3 className="text-2xl font-black uppercase mb-2">No Titles Found</h3>
                <p className="text-sm font-bold opacity-60">Try adjusting your category or search term, Bre.</p>
            </div>
        )}

      </section>
    </main>
  );
}
