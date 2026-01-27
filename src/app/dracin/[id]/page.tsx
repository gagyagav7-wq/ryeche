"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Hls from "hls.js";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";

// Tipe data sesuai API baru
interface Episode {
  id: string;
  name: string;
  video_url: string;
}

interface DramaDetail {
  info: {
    id: string;
    title: string;
    cover_url: string;
    synopsis: string;
    total_ep: string | number;
  };
  episodes: Episode[];
}

export default function DramaDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<DramaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State Player
  const [currentEp, setCurrentEp] = useState<Episode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Fetch Data
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        const res = await fetch(`/lib/api_client_side_helper?id=${id}`); 
        // NOTE: Karena getDramaDetail itu server-side function, kita gak bisa panggil langsung di "use client".
        // KITA PAKAI FETCH API ROUTE /api INTERNAL ATAU PANGGIL SERVER ACTION.
        // TAPI UNTUK SIMPEL, SAYA AKAN PANGGIL API LANGSUNG DARI CLIENT PAKE FETCH BIASA:
        
        // Panggil API public langsung (Bypass api.ts server function sementara biar jalan di client)
        const apiRes = await fetch(`https://api.sansekai.my.id/api/flickreels/detailAndAllEpisode?id=${id}`);
        const json = await apiRes.json();
        
        // Normalisasi Manual (Mirip api.ts) biar data konsisten
        const rawData = json?.data || json?.result || json;
        if (!rawData) throw new Error("Data kosong");

        const info = rawData.drama || rawData.info;
        const episodes = rawData.episodes || [];

        setData({
          info: {
            id: info.playlet_id || info.id,
            title: info.title,
            cover_url: info.cover || info.cover_square || info.cover_vertical,
            synopsis: info.introduce || info.description || "Sinopsis belum tersedia.",
            total_ep: info.upload_num || info.chapterCount || 0,
          },
          episodes: episodes.map((ep: any) => ({
            id: ep.id,
            name: ep.name,
            video_url: ep.raw?.videoUrl || ep.videoUrl || "",
          })),
        });

        // Auto select episode 1
        if (episodes.length > 0) {
          setCurrentEp({
             id: episodes[0].id,
             name: episodes[0].name,
             video_url: episodes[0].raw?.videoUrl || episodes[0].videoUrl
          });
        }

      } catch (err) {
        setError("Gagal memuat drama. Coba refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 2. Setup HLS Player
  useEffect(() => {
    if (currentEp && videoRef.current) {
      const video = videoRef.current;
      const src = currentEp.video_url;

      if (Hls.isSupported() && src.includes(".m3u8")) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        video.src = src;
      }
    }
  }, [currentEp]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg">
        <div className="animate-spin text-4xl">🧈</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-bg gap-4">
        <h1 className="text-2xl font-black">ERROR: {error}</h1>
        <Link href="/dracin">
          <BrutButton>KEMBALI KE KATALOG</BrutButton>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-bg text-main p-4 md:p-8 pb-24">
      
      {/* HEADER: Back & Title */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4">
        <Link href="/dracin">
          <BrutButton variant="secondary" className="px-3 py-1 text-xs">&larr; BACK</BrutButton>
        </Link>
        <h1 className="text-xl md:text-3xl font-black uppercase truncate">{data.info.title}</h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: Player & Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PLAYER */}
          <div className="aspect-video bg-black border-[3px] border-main shadow-brut relative group">
            <video 
              ref={videoRef} 
              controls 
              className="w-full h-full object-contain"
              poster={data.info.cover_url}
              autoPlay
            />
          </div>

          {/* INFO CARD */}
          <BrutCard className="bg-white border-brut shadow-brut">
            <h2 className="text-2xl font-black uppercase mb-2">{data.info.title}</h2>
            <div className="flex gap-2 text-xs font-bold mb-4">
              <span className="bg-accent text-white px-2 py-1 border border-black">
                {data.episodes.length} EPS
              </span>
              <span className="bg-surface border border-main px-2 py-1">ONGOING</span>
            </div>
            <p className="opacity-80 leading-relaxed text-sm md:text-base">
              {data.info.synopsis}
            </p>
          </BrutCard>
        </div>

        {/* KOLOM KANAN: Episode List */}
        <div className="lg:col-span-1">
          <BrutCard className="bg-surface border-brut shadow-brut h-full max-h-[80vh] flex flex-col">
            <div className="mb-4 border-b-2 border-main pb-2">
              <h3 className="font-black uppercase text-xl">PILIH EPISODE</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {data.episodes.map((ep, idx) => {
                const isActive = currentEp?.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setCurrentEp(ep)}
                    className={`w-full text-left p-3 border-2 border-main font-bold text-sm transition-all flex justify-between items-center group
                      ${isActive 
                        ? "bg-accent text-white shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]" 
                        : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    <span className="truncate w-3/4">
                      {/* Kalau nama kepanjangan, truncate biar gak pecah layout */}
                      EP {idx + 1}: {ep.name.replace(data.info.title, "").trim() || "Episode " + (idx+1)}
                    </span>
                    {isActive && <span>▶</span>}
                  </button>
                );
              })}
            </div>
          </BrutCard>
        </div>

      </div>
    </main>
  );
}
