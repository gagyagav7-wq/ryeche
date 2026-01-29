"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { movieApi } from "@/lib/movie-hub-api";

export default function MovieHubPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    movieApi.getHome(activeTab).then(json => {
      setMovies(json.data || []);
      setLoading(false);
    });
  }, [activeTab]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] pb-20">
      <header className="sticky top-0 z-30 bg-[#FFFDF7]/90 backdrop-blur-md border-b-[3px] border-[#0F172A] py-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Movie <span className="text-[#FF708D]">Hub</span>
          </h1>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['home', 'trending', 'movies', 'series'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full border-[2px] border-[#0F172A] text-[10px] font-black uppercase transition-all shadow-[3px_3px_0px_#0F172A] ${activeTab === tab ? 'bg-[#FF708D] text-white -translate-y-0.5' : 'bg-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-10">
        {loading ? (
          <div className="flex justify-center py-20 font-black uppercase animate-pulse">Syncing Mainframe...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((m: any) => (
              <Link key={m.slug} href={`/movie-hub/${m.slug}`} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[16px] overflow-hidden shadow-[4px_4px_0px_#0F172A] hover:-translate-y-1 transition-all">
                <div className="aspect-[3/4] relative border-b-[3px] border-[#0F172A]">
                  <Image src={m.thumbnail} alt={m.title} fill className="object-cover" unoptimized />
                  <div className="absolute top-2 right-2 bg-[#CBEF43] border-[2px] border-[#0F172A] px-1.5 py-0.5 text-[9px] font-black">{m.rating} ★</div>
                  <div className="absolute bottom-2 left-2 bg-white/90 border border-[#0F172A] px-1.5 py-0.5 text-[8px] font-bold uppercase">{m.type}</div>
                </div>
                <div className="p-3">
                  <h3 className="font-black text-xs uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D]">{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
