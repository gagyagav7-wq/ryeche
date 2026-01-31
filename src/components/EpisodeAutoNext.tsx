"use client";
import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/dracin/VideoPlayerDracin";

interface Props {
  dramaId: string;
  nextEpId?: string;
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
      console.log("🎬 Episode selesai! Auto-replace ke EP:", nextEpId);
      const nextUrl = `/dracin/${dramaId}?epId=${encodeURIComponent(nextEpId)}`;
      // Gunakan replace agar history back tetap ke library, bukan episode sebelumnya
      router.replace(nextUrl);
    } else {
      console.log("🏁 Tamat bos.");
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
