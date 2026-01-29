"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { movieApi } from "@/lib/movie-hub-api";

export default function MovieHubPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    movieApi.getHome().then(res => {
      // API v2.0 biasanya mengembalikan data di dalam field 'data' atau 'results'
      setMovies(res.data || res.results || []);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] pb-24">
      {/* HEADER TROPICAL */}
      <header className="sticky top-0 z-30 bg-[#FFFDF7]/90 backdrop-blur-md border-b-[3px] border-[#0F172A] py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Movie <span className="text-[#FF708D]">Hub</span>
          </h1>
          <Link href="/dashboard" className="bg-[#FF9F1C] border-[3px] border-[#0F172A] px-4 py-2 rounded-xl font-black uppercase text-xs shadow-[3px_3px_0px_#0F172A] hover:translate-y-0.5 transition-all">Back</Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-end gap-3 mb-8 border-b-[3px] border-[#0F172A] pb-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Fresh Drops 🕒</h2>
          <span className="bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-0.5 text-[10px] font-black rounded mb-1 shadow-sm">v2.0 ACTIVE</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-200 border-[3px] border-[#0F172A] rounded-[20px] animate-pulse shadow-[6px_6px_0px_#0F172A]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {movies.map((m: any) => (
              <Link key={m.slug} href={`/movie-hub/${m.slug}`} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#FF708D] transition-all">
                <div className="aspect-[3/4] relative border-b-[3px] border-[#0F172A]">
                  <Image src={m.thumbnail || m.poster} alt={m.title} fill className="object-cover" unoptimized />
                  <div className="absolute top-3 right-3 bg-[#CBEF43] border-[2px] border-[#0F172A] px-1.5 py-0.5 text-[9px] font-black shadow-sm">{m.rating || "0.0"} ★</div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-black text-sm uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D] transition-colors">{m.title}</h3>
                  <p className="text-[10px] font-bold opacity-40 mt-2 uppercase tracking-widest">{m.type || 'Movie'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
