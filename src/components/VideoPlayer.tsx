"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface VideoPlayerProps {
  url: string;
  type: "mp4" | "hls";
  subtitles?: { url: string; lang: string }[];
  storageKey: string;
  onEnded?: () => void;
}

export default function VideoPlayer({ url, type, subtitles = [], storageKey, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const plyrRef = useRef<Plyr | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. CLEANUP & RESET (Penting biar gak numpuk instance)
    setError(null);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (plyrRef.current) {
      plyrRef.current.destroy();
      plyrRef.current = null;
    }

    // 2. ERROR HANDLER (Di-define di sini biar bisa di-remove)
    const handleNativeError = () => {
      const err = video.error;
      let msg = "Unknown Error";
      if (err) {
        switch (err.code) {
          case 1: msg = "Aborted: Fetching process aborted by user."; break;
          case 2: msg = "Network: Error downloading video (Check Network Tab)."; break;
          case 3: msg = "Decode: Error decoding video media."; break;
          case 4: msg = "Source Not Supported: Server refused connection (403/404) or format invalid."; break;
        }
      }
      setError(`Native Video Error: ${msg}`);
    };

    // Pasang listener native error
    video.addEventListener("error", handleNativeError);

    // 3. SETUP PLAYER
    const initPlayer = () => {
      // --- LOGIC HLS ---
      if (type === "hls" && Hls.isSupported()) {
        const hls = new Hls({ debug: false }); // Debug false biar console bersih
        hlsRef.current = hls;

        hls.loadSource(url);
        hls.attachMedia(video);

        // Resume Time saat Manifest Siap (Lebih aman dari loadedmetadata)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const savedTime = localStorage.getItem(storageKey);
          if (savedTime) {
            video.currentTime = parseFloat(savedTime);
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error("HLS FATAL ERROR:", data);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // JANGAN RETRY INFINITE LOOP. Kalau 403, ya udah error aja.
                setError("Network Error: Gagal memuat stream (CORS/403 Forbidden). Cek Network Tab.");
                hls.destroy(); 
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Media Error: Segmen video rusak.");
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                setError(`Fatal Error: ${data.details}`);
                break;
            }
          }
        });
      } 
      // --- LOGIC NATIVE HLS (SAFARI) ---
      else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        // Resume time native
        video.addEventListener("loadedmetadata", () => {
           const savedTime = localStorage.getItem(storageKey);
           if (savedTime) video.currentTime = parseFloat(savedTime);
        }, { once: true });
      } 
      // --- LOGIC MP4 ---
      else {
        video.src = url;
        // Resume time MP4
        video.addEventListener("loadedmetadata", () => {
           const savedTime = localStorage.getItem(storageKey);
           if (savedTime) video.currentTime = parseFloat(savedTime);
        }, { once: true });
      }

      // 4. INIT PLYR (Tanpa Controls Attribute di JSX)
      const player = new Plyr(video, {
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "fullscreen"],
        autoplay: false,
        resetOnEnd: true,
      });
      plyrRef.current = player;
    };

    initPlayer();

    // 5. SAVE PROGRESS & AUTO NEXT
    const saveInterval = setInterval(() => {
      if (video && !video.paused) {
        localStorage.setItem(storageKey, video.currentTime.toString());
      }
    }, 5000);

    const handleEnded = () => {
       if (onEnded) onEnded();
    };
    video.addEventListener("ended", handleEnded);

    // 6. FINAL CLEANUP (Anti Memory Leak)
    return () => {
      clearInterval(saveInterval);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleNativeError); // <--- INI PENTING
      
      if (hlsRef.current) hlsRef.current.destroy();
      if (plyrRef.current) plyrRef.current.destroy();
      
      video.removeAttribute("src");
      video.load();
    };
  }, [url, type, subtitles, storageKey, onEnded]);

  // UI ERROR OVERLAY
  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center z-50">
        <span className="text-4xl mb-2">🚫</span>
        <h3 className="text-xl font-bold text-red-500 mb-2">PLAYBACK FAILED</h3>
        <p className="text-xs font-mono bg-gray-900 p-2 rounded mb-4 max-w-md break-words">
          {error}
        </button>
        <div className="text-xs opacity-60 max-w-xs">
          Tip: Jika error "CORS" atau "403", berarti server video menolak akses direct. Butuh Proxy Server.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* HAPUS ATRIBUT CONTROLS BIAR GAK BENTROK SAMA PLYR */}
      <video 
        ref={videoRef} 
        className="plyr-react plyr" 
        playsInline 
        preload="metadata"
        crossOrigin="anonymous" 
      >
        {subtitles.map((sub, index) => (
          <track
            key={index}
            kind="captions"
            label={sub.lang}
            srcLang={sub.lang}
            src={sub.url}
            default={index === 0}
          />
        ))}
      </video>
    </div>
  );
}
