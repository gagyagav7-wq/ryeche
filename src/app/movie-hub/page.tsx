"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { movieHubApi } from "@/lib/movie-hub-api";

export default function MovieHubPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data Trending (atau ganti ke 'home' sesuai kebutuhan)
    movieHubApi.getHome('trending').then(res => {
      setMovies(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] p-6 md:p-12">
      <header className="mb-12 border-b-4 border-[#0F172A] pb-6 flex justify-between items-center">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          MOVIE <span className="text-[#FF708D]">HUB</span>
        </h1>
        <span className="bg-[#CBEF43] border-2 border-[#0F172A] px-3 py-1 text-[10px] font-black uppercase rounded shadow-[3px_3px_0px_#0F172A]">
          Proxy: Cloudflared Active
        </span>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[#E7E5D8] border-4 border-[#0F172A] rounded-[20px] animate-pulse shadow-[6px_6px_0px_#0F172A]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {movies.map((m: any) => (
            <Link key={m.slug} href={`/movie-hub/${m.slug}`} className="trop-card group bg-white border-4 border-[#0F172A] rounded-[24px] overflow-hidden shadow-[6px_6px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#FF708D] transition-all">
              <div className="aspect-[3/4] relative border-b-4 border-[#0F172A]">
                <Image src={m.thumbnail} alt={m.title} fill className="object-cover" unoptimized />
                <div className="absolute top-3 right-3 bg-[#CBEF43] border-2 border-[#0F172A] px-2 py-0.5 text-[10px] font-black">{m.rating} ★</div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-black text-xs uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D]">{m.title}</h3>
                <p className="text-[8px] font-bold opacity-40 mt-2 uppercase tracking-widest">{m.year} // {m.type}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
