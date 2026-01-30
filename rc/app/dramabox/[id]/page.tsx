"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { dramaboxApi } from "@/lib/providers/dramabox";

export default function DramaboxDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  // State Data
  const [detail, setDetail] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  
  // State Player
  const [currentEp, setCurrentEp] = useState<any>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [resolution, setResolution] = useState(720); // Default 720p
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Load Data Awal
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      const [detailRes, epRes] = await Promise.all([
        dramaboxApi.getDetail(id as string),
        dramaboxApi.getEpisodes(id as string)
      ]);

      if (detailRes.success) setDetail(detailRes.data);
      if (epRes.success) {
        setEpisodes(epRes.data);
        // Otomatis mainkan episode 1 jika ada
        if (epRes.data.length > 0) {
          selectEpisode(epRes.data[0]);
        }
      }
      setLoading(false);
    };

    if (id) initData();
  }, [id]);

  // 2. Logic Ganti Episode
  const selectEpisode = (ep: any) => {
    setCurrentEp(ep);
    // Cari URL sesuai resolusi yang sedang dipilih, atau fallback ke default
    const selectedQuality = ep.qualities.find((q: any) => q.quality === resolution);
    const targetUrl = selectedQuality ? selectedQuality.url : ep.defaultUrl;
    
    // PENTING: Bungkus dengan Proxy Universal lu biar aman dari CORS
    setCurrentUrl(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
  };

  // 3. Logic Ganti Resolusi
  const changeResolution = (quality: number) => {
    if (!currentEp) return;
    setResolution(quality);
    
    // Cari URL baru
    const newQuality = currentEp.qualities.find((q: any) => q.quality === quality);
    if (newQuality) {
      // Simpan durasi saat ini biar gak ngulang dari awal
      const currentTime = videoRef.current?.currentTime || 0;
      const wasPlaying = !videoRef.current?.paused;

      setCurrentUrl(`/api/proxy?url=${encodeURIComponent(newQuality.url)}`);
      
      // Restore playback position (sedikit delay biar src ke-load)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (wasPlaying) videoRef.current.play();
        }
      }, 100);
    }
  };

  if (loading || !detail) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] text-[#0F172A] font-black animate-pulse">
      LOADING ASSETS...
    </div>
  );

  return (
    <main className="min-h-dvh bg-[#FFFDF7] p-4 md:p-8">
      {/* NAVIGASI BALIK */}
      <Link href="/dramabox" className="inline-flex items-center gap-2 mb-6 border-[3px] border-[#0F172A] px-4 py-2 bg-white shadow-[4px_4px_0px_#0F172A] font-black uppercase text-xs hover:translate-x-1 transition-all">
        ← Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* KOLOM KIRI: PLAYER & INFO */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* VIDEO PLAYER BRUTAL */}
          <div className="relative aspect-video bg-black border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF708D] rounded-[20px] overflow-hidden group">
             {currentUrl ? (
               <video 
                 ref={videoRef}
                 src={currentUrl} 
                 controls 
                 className="w-full h-full object-contain"
                 poster={detail.cover}
                 autoPlay
               >
                 Browser lu gak support video HTML5, Bre.
               </video>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-white/50 font-black">
                 SELECT AN EPISODE
               </div>
             )}
             
             {/* Overlay Kualitas (Muncul pas hover) */}
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               {currentEp?.qualities?.map((q: any) => (
                 <button
                   key={q.quality}
                   onClick={() => changeResolution(q.quality)}
                   className={`px-2 py-1 text-[10px] font-black border-2 border-white rounded ${
                     resolution === q.quality ? 'bg-[#CBEF43] text-black' : 'bg-black/50 text-white hover:bg-white/20'
                   }`}
                 >
                   {q.label}
                 </button>
               ))}
             </div>
          </div>

          {/* JUDUL & META */}
          <div className="bg-white border-[3px] border-[#0F172A] p-6 rounded-[20px] shadow-[6px_6px_0px_#0F172A]">
            <h1 className="text-2xl md:text-3xl font-black uppercase italic leading-none mb-4">
              {detail.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {detail.tags?.map((tag: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-[#0F172A] text-white text-[10px] font-bold uppercase rounded-full">
                  {typeof tag === 'string' ? tag : tag.tagName}
                </span>
              ))}
            </div>

            <p className="text-sm font-medium opacity-80 leading-relaxed border-l-4 border-[#FF708D] pl-4">
              {detail.synopsis}
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: EPISODE LIST */}
        <div className="bg-[#0F172A] text-white border-[4px] border-[#0F172A] p-6 rounded-[24px] h-fit shadow-[8px_8px_0px_#CBEF43]">
           <div className="flex justify-between items-end mb-6 border-b border-white/20 pb-4">
             <h3 className="text-xl font-black italic uppercase">Playlist</h3>
             <span className="text-xs font-bold text-[#CBEF43]">{episodes.length} EPISODES</span>
           </div>

           <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
             {episodes.map((ep) => (
               <button
                 key={ep.id}
                 onClick={() => selectEpisode(ep)}
                 className={`aspect-square flex items-center justify-center font-black text-sm border-2 rounded-xl transition-all ${
                   currentEp?.id === ep.id 
                   ? 'bg-[#FF708D] border-white text-white scale-110 shadow-[0px_0px_10px_#FF708D]' 
                   : 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-white'
                 }`}
               >
                 {ep.index + 1}
               </button>
             ))}
           </div>
        </div>

      </div>
    </main>
  );
}
