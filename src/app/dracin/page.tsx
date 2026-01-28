"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

// --- ICONS ---
const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconFire = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF9F1C]"><path d="M8.5,14.5c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4S8.5,16.7,8.5,14.5z M12.5,3c-3,2.5-5,6-5,9.5c0,3.6,2.2,6.5,5,7.5 c2.8-1,5-3.9,5-7.5C17.5,9,15.5,5.5,12.5,3z"/></svg>;
const IconStar = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF99C8]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M5 3l14 9-14 9V3z"/></svg>;

// --- MOCK DATA ---
// Tag disesuaikan untuk simulasi filter tab
const MOVIES = [
  { id: 1, title: "Tak Bisa Melepasmu", ep: 80, tag: "Romance", category: "HOT", cover: "https://via.placeholder.com/300x400/FF9F1C/FFFFFF?text=ROMANCE" },
  { id: 2, title: "Menikah Lagi Dengan Ketua", ep: 60, tag: "Drama", category: "HOT", cover: "https://via.placeholder.com/300x400/2EC4B6/FFFFFF?text=DRAMA" },
  { id: 3, title: "Cintaku Hadir di Kehidupan", ep: 77, tag: "Fantasy", category: "FORYOU", cover: "https://via.placeholder.com/300x400/FF99C8/FFFFFF?text=FANTASY" },
  { id: 4, title: "Masa Bersinarku", ep: 81, tag: "Slice of Life", category: "FORYOU", cover: "https://via.placeholder.com/300x400/CBEF43/0F172A?text=LIFE" },
  { id: 5, title: "Adik Ipar Memanjakanku", ep: 52, tag: "Family", category: "LATEST", cover: "https://via.placeholder.com/300x400/A0C4FF/0F172A?text=FAMILY" },
  { id: 6, title: "Menaklukkan Suami Nakal", ep: 62, tag: "Comedy", category: "HOT", cover: "https://via.placeholder.com/300x400/BDB2FF/0F172A?text=COMEDY" },
  { id: 7, title: "Kembalinya Sang Pewaris", ep: 80, tag: "Action", category: "LATEST", cover: "https://via.placeholder.com/300x400/FFC6FF/0F172A?text=ACTION" },
  { id: 8, title: "Cinta Dalam Diam", ep: 65, tag: "Melodrama", category: "FORYOU", cover: "https://via.placeholder.com/300x400/FDFFB6/0F172A?text=MELO" },
];

export default function DracinPage() {
  const [activeTab, setActiveTab] = useState("ALL"); // Default ALL biar user liat semua dulu
  const [query, setQuery] = useState("");

  // FILTER LOGIC (Gabungan Tab + Search)
  const filteredMovies = useMemo(() => {
    let result = MOVIES;

    // 1. Filter by Tab (Category)
    if (activeTab !== "ALL") {
       // Simulasi: Kalau tab HOT, ambil kategori HOT, dst.
       // Di real app, ini bisa fetch API berbeda.
       // Untuk mock ini, kita filter kasar aja biar ada interaksi.
       if(activeTab === "HOT") result = result.filter(m => m.category === "HOT");
       if(activeTab === "FORYOU") result = result.filter(m => m.category === "FORYOU");
       if(activeTab === "LATEST") result = result.filter(m => m.category === "LATEST");
    }

    // 2. Filter by Search Query
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((m) => m.title.toLowerCase().includes(q));
    }
    
    return result;
  }, [query, activeTab]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#FF9F1C] pb-24">
      
      {/* BACKGROUND TEXTURE (Static Optimized) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* =======================
          1. TROPICAL HEADER
         ======================= */}
      <header className="relative z-20 sticky top-0 bg-[#FFFDF7]/90 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Link href="/dashboard" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-lg flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[2px_2px_0px_#0F172A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF9F1C]/50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </Link>
                <div>
                    <h1 className="text-xl font-black uppercase leading-none tracking-tight">
                        Dracin<span className="text-[#FF9F1C]">.Stream</span>
                    </h1>
                    <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">Premium Collection</p>
                </div>
            </div>

            {/* Search Bar Tropical (Now Working!) */}
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

      {/* =======================
          2. NAVIGASI (TABS - Accessible)
         ======================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-8">
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Dracin Categories">
            {[
                { id: "ALL", label: "All Movies", icon: null, color: "bg-[#0F172A] text-white" },
                { id: "HOT", label: "Hot Ranking", icon: <IconFire />, color: "bg-[#FF9F1C] text-white" },
                { id: "FORYOU", label: "For You", icon: <IconStar />, color: "bg-[#FF99C8] text-[#0F172A]" },
                { id: "LATEST", label: "Latest Drop", icon: <IconClock />, color: "bg-[#2EC4B6] text-white" }
            ].map((tab) => (
                <button 
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-xs tracking-wide transition-all focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_#0F172A] focus-visible:-translate-y-[2px] ${
                        activeTab === tab.id 
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

      {/* =======================
          3. CONTENT GRID
         ======================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title (Dynamic Count) */}
        <div className="flex items-end gap-3 mb-6 border-b-[3px] border-[#0F172A] pb-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {activeTab === 'ALL' ? "Discover All" : activeTab === 'HOT' ? "Trending Now 🔥" : activeTab === 'FORYOU' ? "Curated Picks ✨" : "Fresh Drops 🕒"}
            </h2>
            <p className="text-xs font-bold opacity-50 mb-1">
                SHOWING {filteredMovies.length} TITLES
            </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
                <div key={movie.id} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[16px] overflow-hidden shadow-[4px_4px_0px_#0F172A] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300">
                    
                    {/* Poster Image Area (Optimized with next/image) */}
                    <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden border-b-[3px] border-[#0F172A]">
                        <Image 
                            src={movie.cover}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            {/* Tombol Link ke Detail */}
                            <Link href={`/dracin/${movie.id}`} className="w-full">
                                <button type="button" className="w-full py-3 bg-[#FF9F1C] border-[2px] border-[#0F172A] rounded-lg font-black uppercase text-white text-xs shadow-[2px_2px_0px_#0F172A] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_#0F172A]">
                                    <IconPlay /> Watch Now
                                </button>
                            </Link>
                        </div>
                        {/* Episode Badge */}
                        <div className="absolute top-3 right-3 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-1 rounded-md text-[10px] font-black text-[#0F172A] shadow-sm">
                            {movie.ep} EP
                        </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-4 bg-white">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-[8px] font-bold uppercase bg-[#E7E5D8] px-1.5 py-0.5 rounded text-[#0F172A] border border-[#0F172A]/20">
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

        {/* EMPTY STATE (Brutal Style) */}
        {filteredMovies.length === 0 && (
            <div className="mt-10 bg-white border-[3px] border-[#0F172A] rounded-[16px] p-8 md:p-12 shadow-[6px_6px_0px_#0F172A] text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-[#E7E5D8] border-[3px] border-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    🤔
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">Tidak ada hasil</h3>
                <p className="text-sm font-bold opacity-60">
                    Coba cari judul drama lain atau ganti kategori tab, Bre.
                </p>
                <button 
                    onClick={() => {setQuery(""); setActiveTab("ALL");}}
                    className="mt-6 px-6 py-3 bg-[#0F172A] text-white border-[3px] border-[#0F172A] rounded-lg font-black uppercase text-xs hover:bg-[#FF9F1C] hover:text-[#0F172A] transition-colors"
                >
                    Reset Filter
                </button>
            </div>
        )}

      </section>

      {/* Decorative Footer Spacer */}
      {filteredMovies.length > 0 && (
        <div className="mt-20 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">End of List • Load More</p>
        </div>
      )}

    </main>
  );
}
