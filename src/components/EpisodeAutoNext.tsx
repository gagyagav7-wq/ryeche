"use client";

import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { useEffect } from "react";

type Ep = { id: string | number };

interface Props {
  dramaId: string;
  episodes: Ep[];
  activeEpId: string;
  url: string;
  type: "hls" | "mp4";
  storageKey: string;
}

export default function EpisodeAutoNext({
  dramaId,
  episodes,
  activeEpId,
  url,
  type,
  storageKey,
}: Props) {
  const router = useRouter();

  const handleEnded = () => {
    // Cari index episode sekarang
    const idx = episodes.findIndex((e) => String(e.id) === String(activeEpId));
    
    // Cek apakah ada episode selanjutnya?
    if (idx >= 0 && idx < episodes.length - 1) {
      const nextEp = episodes[idx + 1];
      console.log("🎬 Episode selesai! Lanjut ke EP:", nextEp.id);
      
      // Pindah halaman
      const nextUrl = `/dracin/${dramaId}?epId=${encodeURIComponent(String(nextEp.id))}`;
      router.push(nextUrl);
    } else {
      console.log("🏁 Udah tamat bos. Gak ada episode lagi.");
    }
  };

  return (
    <VideoPlayer
      url={url}
      type={type}
      storageKey={storageKey}
      subtitles={[]}
      onEnded={handleEnded} // Trigger fungsi di atas
    />
  );
}
