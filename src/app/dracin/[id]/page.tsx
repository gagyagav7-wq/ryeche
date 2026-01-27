import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";
import VideoPlayer from "@/components/VideoPlayer"; 
import { getDramaDetail, getVideoType } from "@/lib/api";

export const revalidate = 60;

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DramaDetailPage({ params, searchParams }: Props) {
  const { id } = params;

  let data;
  try {
    data = await getDramaDetail(id);
  } catch (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-bg gap-6 p-4">
        <div className="text-6xl">⚠️</div>
        <BrutCard className="bg-white border-brut shadow-brut max-w-md text-center">
          <h1 className="text-2xl font-black uppercase mb-2">Gagal Memuat Data</h1>
          <p className="opacity-70 font-bold mb-6">
            Mungkin ID salah atau server lagi ngopi. Coba balik lagi nanti, Commander.
          </p>
          <Link href="/dracin">
            {/* FIX: Pakai fullWidth di BrutButton kalau support, atau style manual */}
            <div className="w-full bg-main text-white font-black py-3 border-[3px] border-black text-center cursor-pointer hover:bg-black">
              &larr; KEMBALI KE MARKAS
            </div>
          </Link>
        </BrutCard>
      </div>
    );
  }

  if (!data || !data.info) return notFound();

  const episodes = Array.isArray(data.episodes) ? data.episodes : [];
  const rawEpId = searchParams.epId;
  const epIdParam = Array.isArray(rawEpId) ? rawEpId[0] : rawEpId;
  const activeEpisode = episodes.find((ep: any) => String(ep.id) === String(epIdParam)) || episodes[0];
  
  const hasEpisodes = episodes.length > 0;
  const videoUrl = activeEpisode?.video_url || "";
  const videoType = getVideoType(videoUrl);
  const storageKey = `dracin-${id}-ep-${activeEpisode?.id || 'default'}`;

  // --- DEBUGGING VIDEO URL (Cek Terminal Server) ---
  if (hasEpisodes) {
    console.warn(`[VideoDebug] ID: ${id} | Ep: ${activeEpisode?.id} | URL: ${videoUrl ? videoUrl.slice(0, 100) : "KOSONG/NULL"}`);
  }
  // ------------------------------------------------

  return (
    <main className="min-h-dvh bg-bg text-main relative overflow-hidden">
      {/* Decorative BG */}
      <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none -z-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 md:w-96 md:h-96 bg-[#A8E6CF] rounded-full border-[3px] border-main opacity-40 -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-[#FDFFB6] border-[3px] border-main rotate-12 opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 space-y-8">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface/90 backdrop-blur-md p-4 border-[3px] border-main shadow-brut relative z-10">
          <div className="flex items-center gap-3">
            <Link href="/dracin">
              {/* FIX: Tombol Back Semantic (Link > styled span) */}
              <span className="inline-block px-3 py-1 text-xs font-black bg-white border-[3px] border-main hover:bg-surface transition-colors cursor-pointer">
                &larr; BACK
              </span>
            </Link>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter truncate max-w-[200px] md:max-w-none">
              BUTTERHUB <span className="opacity-30">/</span> WATCH
            </h1>
            <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 border-[2px] border-black shadow-sm -rotate-2">BETA</span>
          </div>
          <div className="hidden md:block font-bold opacity-60 uppercase text-sm tracking-widest">{data.info.title}</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* PLAYER */}
            <div className="bg-black border-[3px] border-main shadow-brut relative group aspect-video overflow-hidden">
              {hasEpisodes && videoUrl ? (
                <VideoPlayer 
                  url={videoUrl} 
                  type={videoType} 
                  storageKey={storageKey} 
                  subtitles={[]} 
                  key={activeEpisode?.id ?? "no-ep"} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white font-bold gap-2 p-4 text-center">
                  <span className="text-4xl">🔌</span>
                  <p>SUMBER VIDEO TIDAK TERSEDIA</p>
                  <p className="text-xs opacity-50 font-normal">
                    {hasEpisodes ? "Link video rusak dari server pusat." : "Belum ada episode yang diupload."}
                  </p>
                  {/* Debug ID di UI (Optional, hapus kalau mau bersih) */}
                  <p className="text-[10px] opacity-30 font-mono mt-4">ID: {activeEpisode?.id || "N/A"}</p>
                </div>
              )}
            </div>

            {/* INFO */}
            <BrutCard className="bg-white border-brut shadow-brut">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="hidden md:block w-32 shrink-0 aspect-[3/4] relative border-[3px] border-main bg-gray-200">
                  <Image src={data.info.cover_url || "/placeholder.jpg"} alt={data.info.title} fill className="object-cover" sizes="128px" unoptimized={true} />
                </div>
                <div className="space-y-4 flex-1 min-w-0">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-black uppercase leading-none mb-2 break-words">{data.info.title}</h1>
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                      <span className="bg-accent text-white px-2 py-1 border-2 border-main shadow-sm">{episodes.length} EPISODES</span>
                      <span className="bg-[#FDFFB6] text-main px-2 py-1 border-2 border-main shadow-sm truncate max-w-[200px]">{activeEpisode ? `PLAYING: EP ${activeEpisode.name}` : "NO DATA"}</span>
                    </div>
                  </div>
                  <div className="h-[2px] w-full bg-main/10" />
                  <div>
                    <p className="font-medium opacity-80 leading-relaxed text-sm md:text-base">{data.info.synopsis || "Sinopsis belum tersedia."}</p>
                  </div>
                </div>
              </div>
            </BrutCard>
          </div>

          <div className="lg:col-span-1">
            <BrutCard className="bg-surface border-brut shadow-brut h-full max-h-[600px] flex flex-col p-0 overflow-hidden">
              <div className="p-4 border-b-[3px] border-main bg-white flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-black uppercase text-xl flex items-center gap-2"><span>Playlist</span><span className="text-xs bg-main text-white px-2 py-0.5 rounded-full">{episodes.length}</span></h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {episodes.length > 0 ? (
                  episodes.map((ep: any, idx: number) => {
                    const isActive = String(ep.id) === String(activeEpisode?.id);
                    return (
                      <Link 
                        key={ep.id} 
                        href={`/dracin/${id}?epId=${encodeURIComponent(String(ep.id))}`} 
                        replace 
                        className={`block w-full text-left p-3 border-[3px] border-main font-bold text-sm transition-all group outline-none focus-visible:ring-4 focus-visible:ring-accent ${isActive ? "bg-accent text-white shadow-[4px_4px_0px_0px_#171717] translate-x-[-2px] translate-y-[-2px] z-10 relative" : "bg-white text-main md:hover:bg-[#FDFFB6] md:hover:translate-x-[-2px] md:hover:translate-y-[-2px] md:hover:shadow-[2px_2px_0px_0px_#171717]"}`}
                      >
                        <div className="flex justify-between items-center gap-2"><span className="truncate min-w-0 flex-1"><span className="opacity-60 mr-2 text-xs">#{idx + 1}</span>{ep.name || `Episode ${idx + 1}`}</span>{isActive && <span className="text-[10px] animate-pulse">▶ playing</span>}</div>
                      </Link>
                    );
                  })
                ) : ( <div className="p-8 text-center opacity-50 font-bold">Belum ada episode.</div> )}
              </div>
            </BrutCard>
          </div>
        </div>
      </div>
    </main>
  );
}
