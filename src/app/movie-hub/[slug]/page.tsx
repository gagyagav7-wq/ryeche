"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { movieHubApi } from "@/lib/movie-hub-api"; // <--- Pastikan namanya 'movieHubApi'

export default function MovieDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [activeEp, setActiveEp] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");

  // Load Detail
  useEffect(() => {
    movieApi.getDetail(slug as string).then(res => setData(res.data));
  }, [slug]);

  // Load Player when Episode changes
  useEffect(() => {
    movieApi.getPlay(slug as string, activeEp).then(res => {
      setServers(res.data || []);
      // Set server pertama sebagai default
      if (res.data?.[0]?.url) setCurrentUrl(res.data[0].url);
    });
  }, [slug, activeEp]);

  if (!data) return <div className="min-h-screen flex items-center justify-center font-black animate-bounce">SYNCING CORE...</div>;

  return (
    <main className="min-h-screen bg-[#FFFDF7] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link href="/movie-hub" className="inline-flex items-center gap-2 border-[3px] border-[#0F172A] px-4 py-2 bg-white shadow-[4px_4px_0px_#0F172A] font-black uppercase text-xs hover:translate-x-1 transition-all">← Back to Gallery</Link>
        
        {/* BIG PLAYER */}
        <div className="aspect-video bg-[#0F172A] border-[4px] border-[#0F172A] shadow-[12px_12px_0px_#FF708D] overflow-hidden rounded-[24px]">
          {currentUrl ? (
            <iframe src={currentUrl} className="w-full h-full" allowFullScreen />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-black opacity-20">ESTABLISHING UPLINK...</div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-[3px] border-[#0F172A] p-8 shadow-[6px_6px_0px_#0F172A] rounded-[24px]">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">{data.title}</h2>
              <p className="text-sm font-bold opacity-70 leading-relaxed italic border-l-4 border-[#FF708D] pl-4">{data.synopsis}</p>
            </div>
            
            {/* SERVER PICKER */}
            <div className="flex flex-wrap gap-3">
              {servers.map((srv, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentUrl(srv.url)}
                  className={`px-4 py-2 border-[3px] border-[#0F172A] rounded-lg font-black text-[10px] uppercase transition-all ${currentUrl === srv.url ? 'bg-[#CBEF43] shadow-[3px_3px_0px_#0F172A]' : 'bg-white opacity-60'}`}
                >
                  Server {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* SIDEBAR: EPISODES */}
          <div className="bg-[#0F172A] text-white border-[3px] border-[#0F172A] p-6 shadow-[8px_8px_0px_#0F172A] rounded-[24px]">
            <h3 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-4 tracking-widest">Episode Deck</h3>
            <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto no-scrollbar">
              {[...Array(data.episodes_count || 1)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveEp(i + 1)}
                  className={`aspect-square border-2 font-black text-xs flex items-center justify-center rounded-xl transition-all ${activeEp === i + 1 ? 'bg-[#FF708D] border-white text-white scale-110 shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/40'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
