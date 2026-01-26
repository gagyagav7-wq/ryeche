import Image from "next/image";
import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";
import VideoPlayer from "@/components/VideoPlayer";
import { getDramaDetail, getVideoType } from "@/lib/api";

export default async function DramaDetailPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string }, 
  searchParams: { epId?: string } 
}) {
  const data = await getDramaDetail(params.id);
  
  // LOGIC ROBUST: Cari episode
  // Ambil query ?epId=... atau kosong
  const activeKey = searchParams.epId ? String(searchParams.epId) : null;
  
  let activeEpisode = null;

  if (activeKey && data.episodes.length > 0) {
    // 1. Coba match ID (String vs String)
    activeEpisode = data.episodes.find(e => String(e.id) === activeKey);
    
    // 2. Fallback: Kalau gak ketemu, coba anggap itu Index Array
    if (!activeEpisode) {
      const idx = parseInt(activeKey);
      if (!isNaN(idx)) activeEpisode = data.episodes[idx];
    }
  }

  return (
    <main className="layout-container p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {activeEpisode ? (
        <section className="animate-in slide-in-from-top duration-500">
          <BrutCard title={`Playing: ${activeEpisode.name}`} className="bg-black text-white border-main">
            <VideoPlayer 
              url={activeEpisode.video_url} 
              type={getVideoType(activeEpisode.video_url)} 
              subtitles={[]} 
              storageKey={`drama-${params.id}-ep-${activeEpisode.id}`} 
            />
          </BrutCard>
        </section>
      ) : (
         <section className="flex flex-col md:flex-row gap-6">
           {/* ... Info UI (Sama kayak sebelumnya) ... */}
           {/* TIPS: Pake unoptimized={true} di <Image> juga disini */}
         </section>
      )}

      {/* EPISODE LIST */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-4 h-4 bg-black"></div>
          <h2 className="text-2xl font-black uppercase">Episodes</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.episodes.map((ep, idx) => {
            // FIX: Nullish Coalescing (Prioritas ID, kalau null pake index)
            const uniqueId = ep.id ?? idx;
            // FIX: Bandingkan String biar aman ( "1" === "1" )
            const isActive = String(uniqueId) === activeKey;
            
            return (
              <Link 
                key={uniqueId} 
                // FIX: Encode URI biar karakter aneh gak ngerusak URL
                href={`/drama/${params.id}?epId=${encodeURIComponent(String(uniqueId))}`} 
                scroll={true}
              >
                <BrutButton 
                  fullWidth 
                  variant={isActive ? "primary" : "secondary"}
                  className={`text-sm truncate ${isActive ? 'ring-4 ring-black ring-offset-2' : ''}`}
                >
                  {ep.name || `EPS ${idx + 1}`}
                </BrutButton>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  );
}
