"use client";
import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";

interface Props {
  dramaId: string;
  nextEpId?: string; // Cuma butuh ID episode selanjutnya (Hemat Payload!)
  url: string;
  type: "hls" | "mp4";
  storageKey: string;
}

export default function EpisodeAutoNext({
  dramaId,
  nextEpId,
  url,
  type,
  storageKey,
}: Props) {
  const router = useRouter();

  const handleEnded = () => {
    if (nextEpId) {
      console.log("🎬 Episode selesai! Lanjut ke EP:", nextEpId);
      const nextUrl = `/dracin/${dramaId}?epId=${encodeURIComponent(nextEpId)}`;
      router.push(nextUrl);
    } else {
      console.log("🏁 Tamat bos. Gak ada episode lagi.");
    }
  };

  return (
    <VideoPlayer
      url={url}
      type={type}
      storageKey={storageKey}
      subtitles={[]}
      onEnded={handleEnded}
    />
  );
}
