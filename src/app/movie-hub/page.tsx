"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { movieHubApi } from "@/lib/movie-hub-api";

export default function MovieHubPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("trending"); // Default tab
  const [searchQuery, setSearchQuery] = useState("");

  // Fungsi Fetch Data (Mendukung list biasa & search)
  const fetchData = useCallback(async (query = "", activeTab = "trending") => {
    setLoading(true);
    try {
      const res = query 
        ? await movieHubApi.search(query) 
        : await movieHubApi.getHome(activeTab);
      
      setMovies(res.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect untuk Debounce Search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(searchQuery, tab);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, tab, fetchData]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] pb-24">
      
      {/* 1. STICKY TOPBAR DENGAN SEARCH */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/dashboard" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white shadow-[3px_3px_0px_#0F172A] hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic uppercase leading-none tracking-tighter">
              MOVIE <span className="text-[#FF708D]">HUB</span>
            </h1>
            <span className="text-[8px] font-black uppercase opacity-40 tracking-widest mt-1">v2.0 Scraper Active</span>
          </div>
        </div>

        {/* Search Bar Brutal */}
        <div className="relative w-full md:w-[400px]">
          <input 
            type="text" 
            placeholder="Cari judul film..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-4 py-2.5 bg-white border-[3px] border-[#0F172A] rounded-full font-bold text-sm focus:outline-none focus:border-[#FF708D] focus:shadow-[4px_4px_0px_#FF708D] transition-all placeholder:text-gray-300"
          />
        </div>
      </header>

      {/* 2. TAB NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 mt-10 flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'home', label: 'Latest Drop', color: 'bg-[#2EC4B6]' },
          { id: 'trending', label: 'Hot Ranking', color: 'bg-[#FF9F1C]' },
          { id: 'movies', label: 'Movies', color: 'bg-[#FF99C8]' },
          { id: 'series', label: 'Series', color: 'bg-[#CBEF43]' }
        ].map((t) => (
          <button 
            key={t.id} 
            onClick={() => { setTab(t.id); setSearchQuery(""); }}
            className={`px-6 py-2.5 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-[10px] tracking-wider transition-all shadow-[4px_4px_0px_#0F172A] whitespace-nowrap ${
              tab === t.id && !searchQuery ? `${t.color} text-white -translate-y-1 shadow-[6px_6px_0px_#0F172A]` : 'bg-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* 3. SECTION HEADER */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-end gap-3 mb-10 border-b-[3px] border-[#0F172A] pb-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            {searchQuery ? `Searching: ${searchQuery}` : tab === 'trending' ? 'Hot Ranking 🔥' : 'Fresh Drops 🕒'}
          </h2>
          <span className="text-[10px] font-bold opacity-30 mb-1 uppercase tracking-tighter">{movies.length} TITLES FOUND</span>
        </div>

        {/* 4. GRID CONTENT */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#E7E5D8] border-[3px] border-[#0F172A] rounded-[24px] animate-pulse shadow-[6px_6px_0px_#0F172A]" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
            {movies.map((m: any) => (
              <Link key={m.slug} href={`/movie-hub/${m.slug}`} className="trop-card group bg-white border-[4px] border-[#0F172A] rounded-[28px] overflow-hidden shadow-[8px_8px_0px_#0F172A] hover:-translate-y-1.5 hover:shadow-[12px_12px_0px_#FF708D] transition-all duration-300">
                <div className="aspect-[3/4] relative border-b-[4px] border-[#0F172A] bg-[#E7E5D8]">
                  <Image 
                    src={m.thumbnail} 
                    alt={m.title} 
                    fill 
                    className="object-cover" 
                    unoptimized // <--- PENTING: Untuk bypass domain check Next.js
                    priority={false}
                  />
                  <div className="absolute top-4 right-4 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-0.5 text-[10px] font-black shadow-sm rounded-md">
                    {m.rating || "0.0"} ★
                  </div>
                </div>
                <div className="p-5 bg-white">
                  <h3 className="font-black text-sm uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D] transition-colors">
                    {m.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[8px] font-black uppercase bg-[#0F172A] text-white px-2 py-0.5 rounded-sm">
                      {m.type || "MOVIE"}
                    </span>
                    <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">{m.year || "2026"}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white border-[4px] border-[#0F172A] rounded-[32px] shadow-[12px_12px_0px_#FF708D]">
            <p className="text-3xl font-black uppercase italic opacity-20 italic">No Movies in sight, Bre.</p>
          </div>
        )}
      </section>
    </main>
  );
}
