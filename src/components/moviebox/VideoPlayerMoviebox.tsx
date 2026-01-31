"use client";

export default function VideoPlayerMoviebox({ src }: { src: string }) {
  return (
    <div className="relative aspect-video bg-black border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF9F1C] rounded-[20px] overflow-hidden">
      <iframe
        src={src}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        scrolling="no"
        frameBorder="0"
      />
    </div>
  );
}
