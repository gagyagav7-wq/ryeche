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

  if (!data || !data.info) return notFound();

  const episodes = Array.isArray(data.episodes) ? data.episodes : [];
  const epIdParam = Array.isArray(searchParams?.epId) ? searchParams.epId[0] : searchParams?.epId;
  const activeEpisode = episodes.find((ep: any) => String(ep.id) === String(epIdParam)) || episodes[0];
  const videoUrl = activeEpisode?.video_url || "";
  
  return (
    <main className="min-h-dvh bg-bg text-main p-4 md:p-8 pb-24">
      {/* HEADER */}
      <header className="flex gap-4 items-center mb-6">
         <Link href="/dracin">
            <span className="px-3 py-1 text-xs font-black bg-white border-[3px] border-main cursor-pointer hover:bg-surface">
              &larr; BACK
            </span>
         </Link>
         <h1 className="text-xl font-black uppercase truncate">{data.info.title}</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PLAYER */}
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-black aspect-video border-[3px] border-main shadow-brut relative">
             {videoUrl ? (
               <VideoPlayer 
                 url={videoUrl} 
                 type={getVideoType(videoUrl)} 
                 storageKey={`dracin-${id}`}
                 subtitles={[]}
                 key={activeEpisode?.id || "init"}
               />
             ) : (
               <div className="flex items-center justify-center h-full text-white font-bold">VIDEO TIDAK TERSEDIA</div>
             )}
           </div>
           <BrutCard className="bg-white border-brut shadow-brut p-4">
              <h1 className="text-2xl font-black uppercase mb-2">{data.info.title}</h1>
              <p className="opacity-80 text-sm">{data.info.synopsis || "No synopsis."}</p>
           </BrutCard>
        </div>

        {/* EPISODES */}
        <div className="lg:col-span-1">
           <BrutCard className="bg-surface border-brut shadow-brut h-[600px] flex flex-col p-0">
              <div className="p-4 border-b-[3px] border-main font-black">PLAYLIST ({episodes.length})</div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {episodes.map((ep: any, idx: number) => {
                  const isActive = String(ep.id) === String(activeEpisode?.id);
                  return (
                    <Link key={ep.id} href={`/dracin/${id}?epId=${encodeURIComponent(ep.id)}`} replace 
                          className={`block p-3 border-[3px] border-main font-bold text-sm ${isActive ? "bg-accent text-white" : "bg-white hover:bg-[#FDFFB6]"}`}>
                      <div className="flex justify-between">
                        <span className="truncate">#{idx+1} {ep.name}</span>
                        {isActive && <span>▶</span>}
                      </div>
                    </Link>
                  )
                })}
              </div>
           </BrutCard>
        </div>
      </div>
    </main>
  );
}
