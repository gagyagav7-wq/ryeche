"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// --- ICONS ---
const IconBack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>;
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M5 3l14 9-14 9V3z"/></svg>;
const IconLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

export default function DracinPlayerPage() {
  const { id } = useParams();
  
  const [drama, setDrama] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpIndex, setCurrentEpIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // FETCH DETAIL
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`https://api.sansekai.my.id/api/flickreels/detailAndAllEpisode?id=${id}`)
      .then(res => res.json())
      .then(json => {
        // Ambil data drama dan episode dari struktur API
        setDrama(json.drama);
        setEpisodes(json.episodes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-dvh flex items-center justify-center bg-[#FFFDF7] font-black uppercase tracking-widest text-xs">
      Loading Theater...
    </div>
  );

  if (!drama) return <div className="p-10 text-center">Drama not found.</div>;

  const currentEp = episodes[currentEpIndex];

  return (
    <main className="min-h-dvh bg-[#0F172A] text-[#FFFDF7] font-sans pb-20">
      
      {/* HEADER NAV */}
      <div className="bg-[#0F172A] border-b border-gray-800 p-4 sticky top-0 z-50 flex items-center gap-4">
        <Link href="/dracin" className="w-10 h-10 bg-[#FF9F1C] border-[2px] border-white rounded-lg flex items-center justify-center text-white hover:scale-105 transition-transform">
          <IconBack />
        </Link>
        <div>
           <h1 className="font-black uppercase text-lg line-clamp-1">{drama.title}</h1>
           <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
             EPISODE {currentEpIndex + 1} / {episodes.length}
           </p>
        </div>
      </div>

      {/* VIDEO PLAYER AREA */}
      <div className="w-full max-w-4xl mx-auto aspect-video bg-black relative shadow-[0px_10px_40px_rgba(0,0,0,0.5)]">
        {currentEp ? (
          <video 
            key={currentEp.raw.videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full"
            poster={currentEp.raw.chapter_cover}
          >
            <source src={currentEp.raw.videoUrl} type="video/mp4" />
            Browser lu gak support video HTML5, Bre.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Pilih Episode dulu</div>
        )}
      </div>

      {/* INFO & EPISODE LIST */}
      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Kiri */}
        <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-black uppercase text-[#FF9F1C]">{drama.title}</h2>
            <div className="flex flex-wrap gap-2">
               {drama.labels?.map((l: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold uppercase">{l}</span>
               ))}
               <span className="px-2 py-1 bg-gray-800 rounded text-[10px] font-bold uppercase">{drama.chapterCount} Episodes</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed font-medium">
               {drama.description}
            </p>
        </div>

        {/* Episode Selector Kanan */}
        <div className="bg-[#1E293B] p-4 rounded-xl border border-gray-700 h-fit max-h-[500px] overflow-y-auto">
           <h3 className="font-black uppercase text-xs mb-4 sticky top-0 bg-[#1E293B] py-2">Select Episode</h3>
           <div className="grid grid-cols-4 gap-2">
              {episodes.map((ep, idx) => (
                 <button
                    key={ep.id}
                    onClick={() => setCurrentEpIndex(idx)}
                    className={`aspect-square flex items-center justify-center rounded-lg border-[2px] font-bold text-xs relative ${
                       currentEpIndex === idx 
                       ? "bg-[#FF9F1C] border-white text-white shadow-[0px_0px_10px_#FF9F1C]"
                       : "bg-[#0F172A] border-gray-700 hover:border-gray-500 text-gray-400"
                    }`}
                 >
                    {idx + 1}
                    {!ep.unlock && (
                       <div className="absolute top-1 right-1 opacity-50"><IconLock /></div>
                    )}
                 </button>
              ))}
           </div>
        </div>

      </div>

    </main>
  );
}
