"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // <--- TAMBAHKAN BARIS INI, BRE!
import { movieApi } from "@/lib/movie-hub-api";

export default function MovieDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    movieApi.getDetail(slug as string).then(res => {
      setData(res.data);
      setCurrentUrl(res.data.player_url);
    });
  }, [slug]);

  if (!data) return <div className="min-h-screen flex items-center justify-center font-black">ACCESSING CORE...</div>;

  return (
    <main className="min-h-screen bg-[#FFFDF7] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/movie-hub" className="inline-block border-[3px] border-[#0F172A] p-2 bg-white shadow-[3px_3px_0px_#0F172A] font-black uppercase text-xs">← Back</Link>
        
        {/* PLAYER BOX */}
        <div className="aspect-video bg-[#0F172A] border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF708D] overflow-hidden rounded-xl">
          <iframe src={currentUrl} className="w-full h-full" allowFullScreen />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* INFO */}
          <div className="md:col-span-2 bg-white border-[3px] border-[#0F172A] p-6 shadow-[5px_5px_0px_#0F172A] rounded-xl">
            <h2 className="text-3xl font-black uppercase leading-none mb-4">{data.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {data.genres.map((g: string) => <span key={g} className="bg-[#FF708D] text-white text-[10px] font-black px-2 py-1 rounded border border-[#0F172A] shadow-[2px_2px_0px_#0F172A]">{g}</span>)}
            </div>
            <p className="text-sm font-bold opacity-70 leading-relaxed">{data.synopsis}</p>
          </div>

          {/* EPISODE DECK */}
          <div className="bg-[#0F172A] text-white border-[3px] border-[#0F172A] p-4 shadow-[5px_5px_0px_#0F172A] rounded-xl">
            <h3 className="font-black uppercase text-xs mb-4 border-b border-white/20 pb-2 tracking-widest">Episode Deck</h3>
            <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2">
              {data.episodes?.map((ep: any) => (
                <button 
                  key={ep.episode} 
                  onClick={() => setCurrentUrl(ep.player_url)}
                  className={`aspect-square border-2 font-black text-xs flex items-center justify-center rounded-lg transition-all ${currentUrl === ep.player_url ? 'bg-[#CBEF43] border-white text-[#0F172A] scale-105' : 'bg-white/10 border-white/20 hover:border-[#FF708D]'}`}
                >
                  {ep.episode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
