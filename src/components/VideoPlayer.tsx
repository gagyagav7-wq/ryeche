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
  const [error, setError] = useState<{ title: string; msg: string } | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const plyrRef = useRef<Plyr | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // CLEANUP AWAL
    setError(null);
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (plyrRef.current) { plyrRef.current.destroy(); plyrRef.current = null; }

    const handleNativeError = () => {
      const err = video.error;
      if (err && err.code === 4) {
        setError({
          title: "SOURCE REFUSED (403/404)",
          msg: "Server video menolak akses. Kemungkinan butuh Proxy/Token."
        });
      }
    };
    video.addEventListener("error", handleNativeError);

    const initPlayer = () => {
      if (type === "hls" && Hls.isSupported()) {
        const hls = new Hls({ debug: false });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const savedTime = localStorage.getItem(storageKey);
          if (savedTime) video.currentTime = parseFloat(savedTime);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              // DETEKSI 403 / CORS
              if (data.response && (data.response.code === 403 || data.response.code === 404)) {
                setError({
                  title: `ACCESS DENIED (${data.response.code})`,
                  msg: "Link video mati atau diproteksi. Butuh Proxy."
                });
              } else {
                setError({
                  title: "NETWORK ERROR",
                  msg: "Gagal memuat video. Cek koneksi atau refresh."
                });
              }
              hls.destroy();
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
              setError({ title: "FATAL ERROR", msg: "Format video tidak didukung." });
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else {
        video.src = url;
      }

      // Init Plyr (Tanpa Controls Attribute di JSX biar gak dobel)
      plyrRef.current = new Plyr(video, {
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "fullscreen"],
        autoplay: false,
        resetOnEnd: true,
      });
    };

    initPlayer();

    // Event & Interval
    const saveInterval = setInterval(() => {
      if (video && !video.paused) localStorage.setItem(storageKey, video.currentTime.toString());
    }, 5000);

    const handleEnded = () => { if (onEnded) onEnded(); };
    video.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(saveInterval);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleNativeError);
      if (hlsRef.current) hlsRef.current.destroy();
      if (plyrRef.current) plyrRef.current.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [url, type, subtitles, storageKey, onEnded]);

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white p-6 text-center z-50">
        <span className="text-4xl mb-2">🚫</span>
        <h3 className="text-xl font-bold text-red-500 mb-2">{error.title}</h3>
        <p className="text-sm font-mono mb-4">{error.msg}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white text-black font-bold text-xs uppercase border-2 border-red-500">
          REFRESH
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} className="plyr-react plyr" playsInline preload="metadata" crossOrigin="anonymous">
        {subtitles.map((sub, index) => (
          <track key={index} kind="captions" label={sub.lang} srcLang={sub.lang} src={sub.url} default={index === 0} />
        ))}
      </video>
    </div>
  );
}
