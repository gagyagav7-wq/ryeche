import Link from "next/link";
import { notFound } from "next/navigation";
import BrutCard from "@/components/BrutCard";
import VideoPlayer from "@/components/VideoPlayer"; 
import { getDramaDetail } from "@/lib/api";

// Helper deteksi tipe video (Regex robust)
const determineVideoType = (url: string) => {
  if (!url) return "mp4";
  return /\.m3u8(\?|$)/i.test(url) ? "hls" : "mp4";
};

export const revalidate = 60;

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DramaDetailPage({ params, searchParams }: Props) {
  const { id } = params;

  // --- LOGIC FETCH DATA ---
  let data;
  try {
    data = await getDramaDetail(id);
  } catch (error) {
    console.error("Error fetching drama:", error);
  }

  // --- LOGIC PENYELAMAT (FALLBACK) ---
  if (data && !data.info && data.episodes && data.episodes.length > 0) {
     const firstEp = data.episodes[0];
     const firstEpName = firstEp.name || "";
     const cleanTitle = firstEpName ? firstEpName.replace(/-EP\.\d+.*$/i, "").trim() : "Drama Tanpa Judul";
     
     data.info = {
        id: String(id),
        title: cleanTitle,
        synopsis: firstEp.raw?.introduce || "Sinopsis belum tersedia.",
        cover_url: firstEp.raw?.chapter_cover || "" 
     };
  }

  // Validasi Akhir
  if (!data || !data.info) return notFound();

  // --- PREPARE DATA ---
  const episodes = Array.isArray(data.episodes) ? data.episodes : [];
  const rawEpId = searchParams?.epId;
  const epIdParam = Array.isArray(rawEpId) ? rawEpId[0] : rawEpId;
  const activeEpisode = episodes.find((ep: any) => String(ep.id) === String(epIdParam)) || episodes[0];
  
  // Safe Title untuk Replace nanti
  const dramaTitle = data.info.title || "";

  // Logic Direct Video
  const videoUrl = activeEpisode?.video_url || activeEpisode?.videoUrl || activeEpisode?.raw?.videoUrl || "";
  const videoType = determineVideoType(videoUrl);
  const storageKey = `dracin-${id}-ep-${activeEpisode?.id || 'default'}`;

  return (
    <main className="min-h-dvh bg-[#F4F4F0] text-[#171717] relative overflow-x-hidden selection:bg-[#FDFFB6]">
      
      {/* UPDATE 1: Noise Layer di -z-10 biar aman banget */}
      <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none -z-10" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
      
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 relative z-10">
        
        {/* HEADER */}
        <header className="flex items-center gap-4 mb-6">
           <Link href="/dracin" className="group">
              <div className="px-4 py-2 bg-white border-2 border-[#171717] shadow-[4px_4px_0px_#171717] font-black text-sm uppercase tracking-wider transition-transform active:translate-y-1 active:shadow-none md:group-hover:bg-[#FDFFB6]">
                &larr; Library
              </div>
           </Link>
           <div className="h-[2px] flex-1 bg-[#171717] opacity-20 hidden md:block"></div>
           <span className="font-bold text-xs uppercase tracking-widest opacity-50 hidden md:block">ButterHub Premium Player</span>
        </header>

        {/* LAYOUT GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* KOLOM KIRI: Player & Info */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             
             {/* VIDEO PLAYER */}
             <div className="bg-black border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717] relative group overflow-hidden rounded-sm">
               <div className="aspect-video w-full">
                 {videoUrl ? (
                   <VideoPlayer 
                     url={videoUrl} 
                     type={videoType} 
                     storageKey={storageKey}
                     subtitles={[]}
                     key={String(activeEpisode?.id || "init")}
                   />
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-white font-bold p-4 text-center">
                      <span className="text-4xl mb-4">🔌</span>
                      <p className="tracking-widest text-sm opacity-80">SOURCE NOT FOUND</p>
                      <p className="text-xs opacity-50 mt-2">Try selecting another episode</p>
                   </div>
                 )}
               </div>
             </div>

             {/* INFO CARD */}
             <BrutCard className="bg-white border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-6 md:p-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight">
                    {data.info.title}
                  </h1>
                  <div className="flex gap-3 text-xs font-bold uppercase tracking-widest opacity-60">
                    <span className="bg-[#171717] text-white px-2 py-1">Drama</span>
                    <span className="border border-[#171717] px-2 py-1">HD 1080p</span>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed opacity-80 font-medium max-w-3xl">
                    {data.info.synopsis || "No synopsis available."}
                  </p>
                </div>
             </BrutCard>
          </div>

          {/* KOLOM KANAN: Playlist (PLAIN CONTAINER FIX) */}
          <div className="lg:col-span-4 min-h-0 z-20">
             <div className="lg:sticky lg:top-6">
                
                {/* UPDATE 2: Height Mobile pake 65vh biar aman, Desktop pake calc */}
                <aside className="bg-white border-[3px] border-[#171717] shadow-[6px_6px_0px_#171717] flex flex-col overflow-hidden h-[65vh] lg:h-[calc(100dvh-120px)] transition-all min-h-0 rounded-sm">
                  
                  {/* Playlist Header */}
                  <div className="p-4 border-b-[3px] border-[#171717] bg-[#FDFFB6] flex justify-between items-center shrink-0">
                    <span className="font-black text-lg uppercase tracking-tight flex items-center gap-2">
                      <span>📺</span> Playlist
                    </span>
                    <span className="text-xs font-bold bg-[#171717] text-white px-2 py-1 rounded-sm">
                      {episodes.length} EP
                    </span>
                  </div>

                  {/* Scrollable Area */}
                  {/* UPDATE 3: custom-scrollbar DIHAPUS dulu, ditambah touch-pan-y */}
                  <div 
                    className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2 bg-white overscroll-contain touch-pan-y"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {episodes.map((ep: any, idx: number) => {
                      const isActive = String(ep.id) === String(activeEpisode?.id);
                      
                      // UPDATE 4: Safe Replace Title
                      const epName = ep.name || "";
                      const displayName = dramaTitle 
                        ? epName.replace(dramaTitle, "").replace(/-EP\.\d+/, "").trim() 
                        : epName;

                      return (
                        <Link 
                          key={ep.id} 
                          href={`/dracin/${id}?epId=${encodeURIComponent(String(ep.id))}`} 
                          className="block group outline-none"
                        >
                          <div className={`
                            relative p-3 border-2 transition-all duration-200 ease-out
                            ${isActive 
                              ? "bg-[#171717] text-white border-[#171717] translate-x-1" 
                              : "bg-white border-[#171717]/30 md:hover:border-[#171717] md:hover:bg-[#fafafa] md:hover:translate-x-1"
                            }
                          `}>
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FDFFB6]"></div>
                            )}

                            <div className="flex justify-between items-center gap-3 pl-2">
                              <div className="flex flex-col min-w-0">
                                {isActive && (
                                  <span className="text-[10px] font-black text-[#FDFFB6] tracking-widest mb-0.5 animate-pulse">
                                    NOW PLAYING
                                  </span>
                                )}
                                <span className={`text-sm font-bold truncate ${isActive ? "text-white" : "text-[#171717]"}`}>
                                  Episode {idx + 1}
                                </span>
                                <span className={`text-xs truncate opacity-70 ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                                  {displayName || "Watch Now"}
                                </span>
                              </div>
                              
                              {isActive ? (
                                <span className="text-lg">▶</span>
                              ) : (
                                <span className="text-[#171717] opacity-0 md:group-hover:opacity-100 transition-opacity text-lg">
                                  ▸
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </aside>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}
