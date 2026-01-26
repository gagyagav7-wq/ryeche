import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";
import VideoPlayer from "@/components/VideoPlayer"; // Ambil dari step sebelumnya
import { getDramaDetail } from "@/lib/api";
import Link from "next/link";

export default async function DramaDetailPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string }, 
  searchParams: { ep?: string } // Tangkap query ?ep=...
}) {
  const data = await getDramaDetail(params.id);
  
  // Cari episode yang mau diputer (Default: episode pertama atau null)
  // Logic ini tergantung data API lu array-nya mulai dari index 0 atau ada field 'episode_number'
  const activeEpIndex = searchParams.ep ? parseInt(searchParams.ep) : -1;
  const activeEpisode = activeEpIndex >= 0 ? data.episodes[activeEpIndex] : null;

  return (
    <main className="layout-container p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* 1. PLAYER SECTION (Muncul cuma kalau ada ?ep=...) */}
      {activeEpisode ? (
        <section className="animate-in slide-in-from-top duration-500">
          <BrutCard title={`Now Playing: ${activeEpisode.name}`} className="bg-black text-white border-main">
            <VideoPlayer 
              url={activeEpisode.video_url} 
              type="hls" // Asumsi API lu ngasih m3u8. Kalau mp4, ganti logic-nya.
              subtitles={[]} 
              storageKey={`drama-${params.id}-ep-${activeEpIndex}`} 
            />
          </BrutCard>
        </section>
      ) : (
        // Kalau belum pilih episode, tampilin Info Drama gede
        <section className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <BrutCard noPadding className="aspect-[2/3]">
              <img src={data.info.cover_url} className="w-full h-full object-cover" />
            </BrutCard>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none">
              {data.info.title}
            </h1>
            <BrutCard className="bg-accent-2">
              <p className="font-bold text-lg">{data.info.synopsis || "No synopsis available."}</p>
            </BrutCard>
          </div>
        </section>
      )}

      {/* 2. EPISODE LIST */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 bg-black"></div>
          <h2 className="text-2xl font-black uppercase">Episodes List</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.episodes.map((ep, index) => {
            const isActive = index === activeEpIndex;
            return (
              <Link key={index} href={`/drama/${params.id}?ep=${index}`} scroll={true}>
                <BrutButton 
                  fullWidth 
                  variant={isActive ? "primary" : "secondary"}
                  className={`text-sm ${isActive ? 'ring-4 ring-black ring-offset-2' : ''}`}
                >
                  {ep.name || `EPS ${index + 1}`}
                </BrutButton>
              </Link>
            )
          })}
        </div>
      </section>

    </main>
  );
}
