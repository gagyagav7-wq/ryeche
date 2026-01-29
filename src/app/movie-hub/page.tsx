"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { movieHubApi } from "@/lib/movie-hub-api"; 

export default function MovieDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [activeEp, setActiveEp] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");

  // 1. Load Detail (Ganti movieApi jadi movieHubApi)
  useEffect(() => {
    movieHubApi.getDetail(slug as string).then(res => setData(res.data));
  }, [slug]);

  // 2. Load Player (Ganti movieApi jadi movieHubApi)
  useEffect(() => {
    movieHubApi.getPlay(slug as string, activeEp).then(res => {
      setServers(res.data || []);
      if (res.data?.[0]?.url) setCurrentUrl(res.data[0].url);
    });
  }, [slug, activeEp]);
  
  return (
    <main className="min-h-screen bg-[#FFFDF7] text-[#0F172A] pb-24">
      {/* STICKY TOPBAR */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white shadow-[3px_3px_0px_#0F172A]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">MOVIE <span className="text-[#FF708D]">HUB</span></h1>
        </div>
        <input 
          type="text" placeholder="Cari film..." value={q} onChange={(e) => setQ(e.target.value)}
          className="w-full md:w-[400px] px-6 py-2.5 bg-white border-[3px] border-[#0F172A] rounded-full font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_#FF708D] transition-all"
        />
      </header>

      {/* TABS */}
      <nav className="max-w-7xl mx-auto px-6 mt-10 flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {(['home', 'trending', 'movies', 'series'] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setQ(""); }}
            className={`px-6 py-2 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-xs transition-all shadow-[3px_3px_0px_#0F172A] ${tab === t && !q ? 'bg-[#2EC4B6] text-white -translate-y-0.5' : 'bg-white'}`}
          >
            {t === 'home' ? 'Latest Drop' : t.replace('_', ' ')}
          </button>
        ))}
      </nav>

      {/* GRID CONTENT */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-end gap-3 mb-8 border-b-[3px] border-[#0F172A] pb-4">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            {q ? `Search: ${q}` : tab === 'trending' ? 'Trending Now 🔥' : 'Fresh Drops 🕒'}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-pulse">
            {[...Array(10)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-200 border-[3px] border-[#0F172A] rounded-[20px] shadow-[6px_6px_0px_#0F172A]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {items.map((m: any) => (
              <Link key={m.slug} href={`/movie-hub/${m.slug}`} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#FF708D] transition-all">
                <div className="aspect-[3/4] relative border-b-[3px] border-[#0F172A]">
                  <Image src={m.thumbnail} alt={m.title} fill className="object-cover" unoptimized />
                  <div className="absolute top-2 right-2 bg-[#CBEF43] border-[2px] border-[#0F172A] px-1.5 py-0.5 text-[9px] font-black">{m.rating} ★</div>
                </div>
                <div className="p-4"><h3 className="font-black text-sm uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D]">{m.title}</h3></div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
