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
  searchParams: { epId?: string } // Kita pake epId string biar lebih robust
}) {
  const data = await getDramaDetail(params.id);
  
  // LOGIC: Cari episode berdasarkan ID
  let activeEpisode = null;
  if (searchParams.epId && data.episodes.length > 0) {
    // Coba cari by ID (kalau API nyediain ID unik per episode)
    activeEpisode = data.episodes.find(e => String(e.id) === searchParams.epId);
    
    // Fallback: Kalau gak ketemu by ID, coba anggap itu index (buat jaga-jaga)
    if (!activeEpisode) {
      const idx = parseInt(searchParams.epId);
      if (!isNaN(idx)) activeEpisode = data.episodes[idx];
    }
  }

  return (
    <main className="layout-container p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {activeEpisode ? (
        <section className="animate-in slide-in-from-top duration-500">
          <BrutCard title={`Playing: ${activeEpisode.name}`} className="bg-black text-white border-main">
            {/* FIX: Auto detect HLS/MP4 di sini */}
            <VideoPlayer 
              url={activeEpisode.video_url} 
              type={getVideoType(activeEpisode.video_url)} 
              subtitles={[]} 
              storageKey={`drama-${params.id}-ep-${activeEpisode.id}`} 
            />
          </BrutCard>
        </section>
      ) : (
        // Info Section (Sama kayak sebelumnya, cuma ganti img jadi Image)
         <section className="flex flex-col md:flex-row gap-6">
           {/* ... UI Info Drama ... */}
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
            // Kita pake ID episode kalau ada, kalau gak ada terpaksa pake index
            const uniqueId = ep.id || idx;
            const isActive = activeEpisode && (activeEpisode.id === ep.id);
            
            return (
              <Link key={uniqueId} href={`/drama/${params.id}?epId=${uniqueId}`} scroll={true}>
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
