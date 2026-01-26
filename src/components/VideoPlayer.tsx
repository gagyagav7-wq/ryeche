'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  url: string;
  type: 'hls' | 'mp4';
  subtitles?: { url: string; lang: string }[];
  storageKey: string; // Kunci buat nyimpen progress nonton
}

export default function VideoPlayer({ url, type, subtitles = [], storageKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIC: Resume & Save Progress ---
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Simpan posisi detik ke localStorage
      localStorage.setItem(storageKey, String(videoRef.current.currentTime));
    }
  };

  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video) return;

    // Ambil posisi terakhir
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      const time = parseFloat(savedTime);
      // Cek biar gak error kalau durasi video beda atau udah abis
      if (!isNaN(time) && time > 0 && time < video.duration - 2) {
        video.currentTime = time;
      }
    }
  };

  // --- LOGIC: Load Video ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);

    // Fungsi handle error Native (Safari/iPhone)
    const handleNativeError = () => {
      if (video.error) {
         setError(`Playback Error: ${video.error.message || "Gagal memuat video."}`);
      }
    };

    video.addEventListener("error", handleNativeError);

    // --- SETUP HLS ---
    if (type === 'hls' && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        // FIX: Matikan lowLatency biar VOD lebih stabil
        lowLatencyMode: false, 
      });
      
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, mencoba recover...");
              hls.startLoad(); // Coba load ulang
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, mencoba recover...");
              hls.recoverMediaError(); // Coba benerin codec
              break;
            default:
              // Kalau fatal banget, baru nyerah
              hls.destroy();
              setError("Fatal Stream Error: Tidak bisa diputar.");
              break;
          }
        }
      });
    } 
    // --- SETUP NATIVE (iPhone/Safari) ---
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } 
    // --- SETUP MP4 BIASA ---
    else {
      video.src = url;
    }

    // --- CLEANUP (Penting biar gak Memory Leak) ---
    return () => {
      // 1. Bersihkan Event Listener
      video.removeEventListener("error", handleNativeError);
      
      // 2. Hancurkan HLS Instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // 3. Reset Video Element (Urutan ini penting!)
      video.pause();
      video.removeAttribute('src'); // Hapus source
      video.load(); // Reset player state
    };
  }, [url, type]);

  return (
    <div className="relative aspect-video bg-black w-full overflow-hidden border-brut border-main group">
      {/* ERROR UI */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white p-4 text-center">
          <p className="text-danger font-black text-xl mb-2">⚠️ ERROR</p>
          <p className="text-sm font-bold opacity-80">{error}</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain focus:outline-none"
        controls
        playsInline // WAJIB: Biar iPhone gak fullscreen otomatis
        preload="metadata"
        onTimeUpdate={handleTimeUpdate} // Simpan progress tiap detik
        onLoadedMetadata={handleMetadataLoaded} // Load progress pas mulai
      >
        {subtitles.map((sub, idx) => (
          <track
            key={idx}
            kind="subtitles"
            src={sub.url}
            srcLang={sub.lang}
            label={sub.lang}
            default={idx === 0} // FIX: Subtitle pertama otomatis aktif
          />
        ))}
        Browser Anda tidak mendukung tag video.
      </video>
    </div>
  );
}
