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

    // 1. Reset State saat URL berubah
    setError(null);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (plyrRef.current) {
      plyrRef.current.destroy();
      plyrRef.current = null;
    }

    // 2. Setup Playback
    const initPlayer = () => {
      // HLS HANDLING
      if (type === "hls" && Hls.isSupported()) {
        const hls = new Hls({
          // Config debug HLS (Opsional: nyalain kalau mau liat log detail di console)
          debug: false, 
          xhrSetup: function (xhr, url) {
             // CORS Credential (kadang butuh, kadang malah bikin error. Default off dulu)
             // xhr.withCredentials = true; 
          },
        });
        
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);

        // ERROR HANDLING HLS
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS ERROR:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError(`Network Error: Gagal konek ke server video. (CORS/403/404)`);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Media Error: Format video rusak/tidak didukung.");
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
      // NATIVE HLS (SAFARI)
      else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.addEventListener('error', (e) => {
           setError(`Native Playback Error: ${(e.target as HTMLVideoElement).error?.message}`);
        });
      } 
      // MP4 DIRECT
      else {
        video.src = url;
        video.addEventListener('error', (e) => {
           setError(`MP4 Error: ${(e.target as HTMLVideoElement).error?.message || "Source refused connection"}`);
        });
      }

      // 3. Initialize Plyr
      const player = new Plyr(video, {
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "fullscreen"],
        autoplay: false,
        resetOnEnd: true,
      });
      plyrRef.current = player;
    };

    initPlayer();

    // 4. Load Saved Time
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime && video) {
      // Tunggu metadata loaded baru seek (biar ga error)
      video.addEventListener('loadedmetadata', () => {
         video.currentTime = parseFloat(savedTime);
      }, { once: true });
    }

    // 5. Save Progress Interval
    const saveInterval = setInterval(() => {
      if (video && !video.paused) {
        localStorage.setItem(storageKey, video.currentTime.toString());
      }
    }, 5000);

    // 6. Event Listener Ended
    const handleEnded = () => {
       if (onEnded) onEnded();
    };
    video.addEventListener("ended", handleEnded);

    // CLEANUP
    return () => {
      clearInterval(saveInterval);
      video.removeEventListener("ended", handleEnded);
      if (hlsRef.current) hlsRef.current.destroy();
      if (plyrRef.current) plyrRef.current.destroy();
      // Penting: Kosongkan src biar browser gak download di background
      video.removeAttribute('src'); 
      video.load();
    };
  }, [url, type, subtitles, storageKey, onEnded]);

  // UI ERROR (Biar gak cuma blank hitam)
  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center z-50">
        <span className="text-4xl mb-2">⚠️</span>
        <h3 className="text-xl font-bold text-red-500 mb-2">VIDEO ERROR</h3>
        <p className="text-sm opacity-80 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-black font-bold text-xs uppercase"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video 
        ref={videoRef} 
        className="plyr-react plyr" 
        playsInline 
        controls 
        preload="metadata"
        crossOrigin="anonymous" // Penting buat CORS
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
