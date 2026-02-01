"use client";

import { useMemo } from "react";

type Props = {
  src: string;
  title?: string;
};

export default function VideoPlayerMoviebox({ src, title = "Movie Player" }: Props) {
  const safeSrc = useMemo(() => (src || "").trim(), [src]);

  if (!safeSrc) {
    return (
      <div className="relative aspect-video bg-black border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF9F1C] rounded-[20px] overflow-hidden grid place-items-center text-white font-black text-center p-6">
        iframe_link kosong / tidak ada src
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF9F1C] rounded-[20px] overflow-hidden">
      <iframe
        src={safeSrc}
        className="w-full h-full"
        title={title}
        loading="lazy"
        // ini sering ngaruh besar buat provider embed
        referrerPolicy="no-referrer"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        scrolling="no"
        frameBorder="0"
      />

      {/* tombol fallback kalau provider embed error */}
      <div className="absolute bottom-3 left-3">
        <a
          href={safeSrc}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-lg font-black text-[11px] shadow-[3px_3px_0px_#0F172A] hover:translate-y-1 hover:shadow-none transition-all"
        >
          OPEN PLAYER
        </a>
      </div>
    </div>
  );
}
