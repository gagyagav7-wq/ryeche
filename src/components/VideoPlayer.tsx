'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  url: string;
  type: 'hls' | 'mp4';
  subtitles?: { url: string; lang: string }[];
  storageKey: string;
}

export default function VideoPlayer({ url, type, subtitles = [], storageKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Video Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error tiap ganti URL
    setError(null);

    let hls: Hls | null = null;

    const handleHlsError = (_: any, data: any) => {
      if (data.fatal) {
        setError("Stream Error: Gagal memuat video.");
      }
    };

    if (type === 'hls') {
      // 1. Cek Native Support (Safari/iOS)
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      }
      // 2. Cek HLS.js Support (Chrome/Firefox/Desktop)
      else if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, handleHlsError);
      } 
      // 3. Fallback Total
      else {
        setError("Browser lu gak support video ini, Bre.");
      }
    } else {
      // MP4 biasa
      video.src = url;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      // Bersihin src biar gak memory leak
      video.removeAttribute('src');
      video.load();
    };
  }, [url, type]);

  return (
    <div className="relative aspect-video bg-black w-full overflow-hidden border-brut border-main">
      {/* ERROR UI */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white p-4 text-center">
          <p className="text-danger font-black text-xl mb-2">⚠️ ERROR</p>
          <p className="text-sm font-bold opacity-80">{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline // WAJIB BUAT IPHONE
        preload="metadata"
        poster="/video-placeholder.png" // Bikin gambar hitam/logo biar rapi sebelum play
      >
        {subtitles.map((sub, idx) => (
          <track
            key={idx}
            kind="subtitles"
            src={sub.url}
            srcLang={sub.lang}
            label={sub.lang}
          />
        ))}
        Browser Anda tidak mendukung tag video.
      </video>
    </div>
  );
}
