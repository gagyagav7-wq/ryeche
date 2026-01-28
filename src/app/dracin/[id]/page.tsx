"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

// --- ICONS ---
const IconBack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>;
const IconLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconPlayCircle = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="#FFFDF7" /></svg>;
const IconLoading = () => <svg className="animate-spin h-10 w-10 text-[#FF9F1C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

export default function DracinPlayerPage() {
  const { id } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [drama, setDrama] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [currentEpIndex, setCurrentEpIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // FETCH DETAIL
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Gunakan ID dari URL untuk fetch
    fetch(`https://api.sansekai.my.id/api/flickreels/detailAndAllEpisode?id=${id}`)
      .then(res => res.json())
      .then(json => {
        setDrama(json.drama);
        setEpisodes(json.episodes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // --- FITUR AUTO PLAY NEXT ---
  const handleVideoEnded = () => {
    // Cek apakah ini bukan episode terakhir
    if (currentEpIndex < episodes.length - 1) {
        console.log("Video selesai, lanjut episode berikutnya...");
        // Pindah ke index selanjutnya.
        // Karena di elemen video ada props `autoPlay`, dia bakal otomatis play.
        setCurrentEpIndex(prev => prev + 1);
    } else {
        console.log("Semua episode selesai.");
    }
  };

  // Scroll ke episode aktif di list samping
  useEffect(() => {
    if(episodes.length > 0) {
        const activeBtn = document.getElementById(`ep-btn-${currentEpIndex}`);
        if(activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
  }, [currentEpIndex, episodes]);


  if (loading) return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-[#FFFDF7]">
      <IconLoading />
      <p className="mt-4 font-black uppercase tracking-widest text-sm text-[#0F172A]">Memuat Bioskop...</p>
    </div>
  );

  if (!drama) return <div className="min-h-dvh flex items-center justify-center bg-[#FFFDF7] font-black text-2xl">Drama tidak ditemukan.</div>;

  const currentEp = episodes[currentEpIndex];

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#FF9F1C] pb-24">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* TROPICAL HEADER NAV */}
      <header className="sticky top-0 z-50 bg-[#FFFDF7]/90 backdrop-blur-md border-b-[3px] border-[#0F172A] py-3 px-4 lg:px-8 shadow-sm">
         <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link href="/dracin" className="group flex items-center gap-2 font-black uppercase text-xs border-[2px] border-[#0F172A] px-4 py-2 rounded-lg bg-white hover:bg-[#FF9F1C] hover:text-white hover:shadow-[3px_3px_0px_#0F172A] hover:-translate-y-[2px] transition-all">
                 <IconBack />
                 <span className="hidden md:inline">Back to Gallery</span>
            </Link>
            <div className="flex-grow overflow-hidden">
                 {/* Marquee effect untuk judul panjang */}
                 <h1 className="font-black uppercase text-lg md:text-xl whitespace-nowrap overflow-hidden text-ellipsis">
                    {drama.title}
                 </h1>
                 <p className="text-[10px] font-bold text-[#FF9F1C] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Now Playing: Episode {currentEpIndex + 1}
                 </p>
            </div>
         </div>
      </header>

      {/* VIDEO PLAYER AREA (CINEMA MODE) */}
      <section className="relative z-10 max-w-5xl mx-auto mt-6 lg:mt-10 px-4">
        <div className="w-full aspect-video bg-[#0F172A] relative rounded-xl overflow-hidden border-[3px] border-[#0F172A] shadow-[8px_8px_0px_#0F172A]">
            {currentEp ? (
            // --- VIDEO PLAYER DENGAN AUTO PLAY NEXT ---
            <video 
                ref={videoRef}
                key={currentEp.raw.videoUrl} // Key penting biar React tau video ganti
                controls 
                autoPlay // Otomatis play saat ganti episode
                onEnded={handleVideoEnded} // Event listener saat video habis
                className="w-full h-full object-contain focus:outline-none"
                poster={currentEp.raw.chapter_cover}
            >
                <source src={currentEp.raw.videoUrl} type="video/mp4" />
                Browser lu terlalu tua buat muter video ini, Bre. Update gih.
            </video>
            ) : (
            <div className="flex items-center justify-center h-full text-white font-black uppercase tracking-widest">
                Memuat Episode...
            </div>
            )}
        </div>
      </section>

      {/* INFO & EPISODE LIST CONTAINER */}
      <section className="relative z-10 max-w-5xl mx-auto p-4 lg:px-0 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* KIRI: Detail Drama */}
        <div className="lg:col-span-2 bg-white border-[3px] border-[#0F172A] rounded-2xl p-6 shadow-[4px_4px_0px_#0F172A]">
            <h2 className="text-3xl font-black uppercase text-[#0F172A] leading-none mb-4">
                {drama.title}
            </h2>
            
            {/* Tags / Labels */}
            <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-[#FF9F1C] text-white border-[2px] border-[#0F172A] rounded-md text-[10px] font-black uppercase shadow-[2px_2px_0px_#0F172A]">
                    {drama.chapterCount} Episodes Total
                </span>
               {drama.labels?.map((l: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-[#E7E5D8] text-[#0F172A] border-[2px] border-[#0F172A]/30 rounded-md text-[10px] font-bold uppercase">
                    {l}
                  </span>
               ))}
            </div>
            
            {/* Synopsis */}
            <div className="bg-[#FFFDF7] p-4 rounded-xl border-[2px] border-[#0F172A]/10">
                <h3 className="text-xs font-black uppercase mb-2 opacity-50 tracking-widest">Synopsis Mission</h3>
                <p className="text-sm opacity-80 leading-relaxed font-medium">
                {drama.description}
                </p>
            </div>
        </div>

        {/* KANAN: Episode Selector (Control Panel Style) */}
        <div className="bg-[#0F172A] p-4 rounded-2xl border-[3px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] lg:sticky lg:top-24">
           <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-white/10">
                <h3 className="font-black uppercase text-xs text-white tracking-widest">
                    Episode Deck
                </h3>
                <span className="text-[10px] font-bold text-[#FF9F1C] bg-[#FF9F1C]/10 px-2 py-1 rounded">
                    {episodes.length} Ready
                </span>
           </div>
           
           {/* Grid Episode Buttons */}
           <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {episodes.map((ep, idx) => {
                 const isActive = currentEpIndex === idx;
                 const isLocked = !ep.unlock;
                 return (
                 <button
                    key={ep.id}
                    id={`ep-btn-${idx}`} // ID untuk auto-scroll
                    onClick={() => !isLocked && setCurrentEpIndex(idx)}
                    disabled={isLocked}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-[2px] font-black text-xs relative transition-all ${
                       isActive 
                       ? "bg-[#FF9F1C] border-[#0F172A] text-[#0F172A] shadow-[3px_3px_0px_#0F172A] -translate-y-[2px] scale-105 z-10"
                       : isLocked
                         ? "bg-[#0F172A] border-white/20 text-white/30 cursor-not-allowed"
                         : "bg-white border-[#0F172A] text-[#0F172A] hover:bg-[#CBEF43] hover:shadow-[2px_2px_0px_#0F172A] hover:-translate-y-[1px]"
                    }`}
                 >
                    {isActive && <IconPlayCircle />}
                    <span className={isActive ? "text-[10px] mt-0.5" : ""}>{idx + 1}</span>
                    
                    {isLocked && (
                       <div className="absolute top-0.5 right-0.5 text-white/50"><IconLock /></div>
                    )}
                 </button>
              )})}
           </div>
        </div>

      </section>

      {/* Custom Scrollbar Style untuk Episode List */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0F172A;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FF9F1C;
          border-radius: 4px;
        }
      `}</style>

    </main>
  );
}
