import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrutCard from "@/components/BrutCard";
import VideoPlayer from "@/components/VideoPlayer"; 
import { getDramaDetail } from "@/lib/api";

export const revalidate = 60;

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DramaDetailPage({ params, searchParams }: Props) {
  const { id } = params;

  // --- DEBUG LOG START ---
  console.log("=================================");
  console.log("DEBUG: ISI DATA ASLI:", JSON.stringify(data, null, 2));
  // --- DEBUG LOG END ---

  let data;
  try {
    data = await getDramaDetail(id);
    
    // --- DEBUG LOG START ---
    console.log("DEBUG: Hasil API apa?", JSON.stringify(data ? "ADA DATA" : "KOSONG", null, 2));
    // --- DEBUG LOG END ---

  } catch (error) {
    console.error("DEBUG ERROR:", error);
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-bg gap-6 p-4">
        <div className="text-6xl">⚠️</div>
        <BrutCard className="bg-white border-brut shadow-brut max-w-md text-center">
          <h1 className="text-2xl font-black uppercase mb-2">Gagal Memuat Data</h1>
          <p className="opacity-70 font-bold mb-6">ID salah atau server error.</p>
          <Link href="/dracin">
             <div className="w-full bg-main text-white font-black py-3 border-[3px] border-black text-center cursor-pointer hover:bg-black">
              &larr; KEMBALI
            </div>
          </Link>
        </BrutCard>
      </div>
    );
  }

  // Jika data kosong atau tidak ada info, tampilkan 404
  if (!data || !data.info) {
    console.log("DEBUG: Data tidak valid, masuk ke notFound()");
    return notFound();
  }

  const episodes = Array.isArray(data.episodes) ? data.episodes : [];
  const rawEpId = searchParams?.epId;
  const epIdParam = Array.isArray(rawEpId) ? rawEpId[0] : rawEpId;
  const activeEpisode = episodes.find((ep: any) => String(ep.id) === String(epIdParam)) || episodes[0];

  // Logic Proxy
  let videoUrl = "";
  const rawUrl = activeEpisode?.video_url || activeEpisode?.videoUrl || activeEpisode?.raw?.videoUrl;

  if (rawUrl) {
    const encodedOriginalUrl = encodeURIComponent(rawUrl);
    videoUrl = `/api/proxy?url=${encodedOriginalUrl}`;
  }

  const videoType = "mp4"; 
  const storageKey = `dracin-${id}-ep-${activeEpisode?.id || 'default'}`;

  return (
    <main className="min-h-dvh bg-bg text-main relative overflow-hidden">
      <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none -z-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 space-y-8 relative z-10">
        <header className="flex gap-4 items-center mb-6">
           <Link href="/dracin">
              <span className="px-3 py-1 text-xs font-black bg-white border-[3px] border-main cursor-pointer hover:bg-surface">&larr; BACK</span>
           </Link>
           <h1 className="text-xl font-black uppercase truncate">{data.info.title}</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Video & Info */}
          <div className="lg:col-span-2 space-y-4">
             <div className="bg-black aspect-video border-[3px] border-main shadow-brut relative group">
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
                    <span className="text-2xl">🔌</span>
                    <p>VIDEO TIDAK TERSEDIA</p>
                 </div>
               )}
             </div>
             <BrutCard className="bg-white border-brut shadow-brut p-4">
                <h1 className="text-2xl font-black uppercase mb-2">{data.info.title}</h1>
                <p className="opacity-80 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.info.synopsis || "No synopsis available."}
                </p>
             </BrutCard>
          </div>

          {/* Kolom Kanan: Playlist */}
          <div className="lg:col-span-1">
             <BrutCard className="bg-surface border-brut shadow-brut h-[600px] flex flex-col p-0">
                <div className="p-4 border-b-[3px] border-main font-black">PLAYLIST ({episodes.length})</div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                  {episodes.map((ep: any, idx: number) => {
                    const isActive = String(ep.id) === String(activeEpisode?.id);
                    return (
                      <Link 
                        key={ep.id} 
                        href={`/dracin/${id}?epId=${encodeURIComponent(String(ep.id))}`} 
                        replace 
                        className={`block p-3 border-[3px] border-main font-bold text-sm transition-all outline-none focus-visible:ring-4 focus-visible:ring-accent ${isActive ? "bg-accent text-white" : "bg-white hover:bg-[#FDFFB6]"}`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="truncate w-[80%]">#{idx+1} {ep.name}</span>
                          {isActive && <span>▶</span>}
                        </div>
                      </Link>
                    )
                  })}
                </div>
             </BrutCard>
          </div>
        </div>
      </div>
    </main>
  );
}
