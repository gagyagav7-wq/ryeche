"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { movieApi, MovieItem } from "@/lib/api";

// --- REUSABLE UI COMPONENTS ---

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TabButton = ({ active, label, onClick, color }: { active: boolean; label: string; onClick: () => void; color: string }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-xs tracking-wide transition-all ${
      active ? `${color} shadow-[4px_4px_0px_#0F172A] -translate-y-[2px]` : "bg-white text-[#0F172A] hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

const MovieCard = ({ movie }: { movie: MovieItem }) => (
  <Link href={`/movie-hub/${movie.id}`} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_#0F172A] hover:-translate-y-[4px] hover:shadow-[10px_10px_0px_#0F172A] transition-all duration-300">
    <div className="aspect-[3/4] bg-[#E7E5D8] relative overflow-hidden border-b-[3px] border-[#0F172A]">
      <Image src={movie.poster} alt={movie.title} fill className="object-cover" unoptimized />
      <div className="absolute top-3 right-3 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-1 rounded-md text-[9px] font-black text-[#0F172A] shadow-sm">
        {movie.rating} ★
      </div>
      <div className="absolute top-3 left-3 bg-[#0F172A] text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-tighter">
        {movie.label}
      </div>
    </div>
    <div className="p-4">
      <span className="text-[8px] font-black uppercase bg-[#0F172A] text-white px-2 py-0.5 rounded-sm mb-2 inline-block">
        {movie.year}
      </span>
      <h3 className="font-black text-sm md:text-base leading-tight uppercase line-clamp-2 group-hover:text-[#FF9F1C] transition-colors">
        {movie.title}
      </h3>
    </div>
  </Link>
);

const SkeletonCard = () => (
  <div className="bg-white border-[3px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_#0F172A] animate-pulse">
    <div className="aspect-[3/4] bg-gray-200 border-b-[3px] border-[#0F172A]" />
    <div className="p-4 space-y-2">
      <div className="h-3 w-12 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function MovieHubPage() {
  const [items, setItems] = useState<MovieItem[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [activeGenre, setActiveGenre] = useState("SEMUA");
  const [tab, setTab] = useState("latest");
  const [q, setQ] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch Genres
  useEffect(() => {
    movieApi.getGenres().then(setGenres);
  }, []);

  // Fetch Titles Logic
  const fetchData = useCallback(async (searchQuery: string, genreId: string, activeTab: string) => {
    setLoading(true);
    const res = await movieApi.getTitles({ q: searchQuery, genre: genreId === "SEMUA" ? "" : genreId, tab: activeTab });
    setItems(res.items);
    setTotal(res.total);
    setLoading(false);
  }, []);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(q, activeGenre, tab);
    }, 300);
    return () => clearTimeout(timer);
  }, [q, activeGenre, tab, fetchData]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#FF9F1C] pb-24">
      
      {/* 1. TOPBAR STICKY */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/dashboard" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[3px_3px_0px_#0F172A]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase leading-none tracking-tight">
                BUTTER<span className="text-[#FF9F1C]">HUB</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="bg-[#0F172A] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">MOVIE HUB</span>
                <span className="text-[8px] font-bold text-[#0F172A] opacity-60 uppercase">BY DAWGHub</span>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0F172A]/40"><IconSearch /></div>
            <input
              type="text"
              placeholder="Cari judul film..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-[3px] border-[#0F172A] rounded-full font-bold text-sm focus:outline-none focus:border-[#FF9F1C] focus:shadow-[4px_4px_0px_#FF9F1C] transition-all"
            />
          </div>
        </div>
      </header>

      {/* 2. TABS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8 flex flex-wrap gap-3">
        <TabButton label="Latest Drop" active={tab === "latest"} onClick={() => setTab("latest")} color="bg-[#2EC4B6] text-white" />
        <TabButton label="Hot Ranking" active={tab === "hot"} onClick={() => setTab("hot")} color="bg-[#FF9F1C] text-white" />
        <TabButton label="For You" active={tab === "forYou"} onClick={() => setTab("forYou")} color="bg-[#FF99C8] text-[#0F172A]" />
      </section>

      {/* 3. GENRE CHIPS */}
      <section className="max-w-7xl mx-auto mt-6 relative group">
        <div className="flex items-center gap-3 overflow-x-auto px-4 md:px-8 pb-4 no-scrollbar scroll-smooth">
          <span className="text-[10px] font-black uppercase opacity-40 shrink-0">Genre:</span>
          <button
            onClick={() => setActiveGenre("SEMUA")}
            className={`shrink-0 px-4 py-1.5 rounded-lg border-[2px] border-[#0F172A] text-[10px] font-black uppercase transition-all ${
              activeGenre === "SEMUA" ? "bg-[#CBEF43] shadow-[3px_3px_0px_#0F172A] -translate-y-[1px]" : "bg-white opacity-60 hover:opacity-100"
            }`}
          >
            SEMUA
          </button>
          {genres.map((g: any) => (
            <button
              key={g.id || g.name}
              onClick={() => setActiveGenre(g.id || g.name)}
              className={`shrink-0 px-4 py-1.5 rounded-lg border-[2px] border-[#0F172A] text-[10px] font-black uppercase transition-all ${
                activeGenre === (g.id || g.name) ? "bg-[#CBEF43] shadow-[3px_3px_0px_#0F172A] -translate-y-[1px]" : "bg-white opacity-60 hover:opacity-100"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </section>

      {/* 4. SECTION HEADER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
        <div className="flex items-end gap-3 mb-6 border-b-[3px] border-[#0F172A] pb-4">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            {q ? `Searching: ${q}` : tab === "hot" ? "Trending Now 🔥" : "Fresh Drops 🕒"}
          </h2>
          <p className="text-xs font-bold opacity-50 mb-1 uppercase">{total} Titles</p>
        </div>

        {/* 5. GRID CONTENT */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {items.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border-[3px] border-[#0F172A] rounded-[20px] shadow-[8px_8px_0px_#FF99C8]">
            <p className="text-2xl font-black uppercase opacity-20">No titles found in this deck.</p>
          </div>
        )}
      </section>
    </main>
  );
}
