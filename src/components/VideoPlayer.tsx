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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset error kalau URL berubah
    setError(null);

    let hls: Hls | null = null;
    let player: Plyr | null = null;

    // Setup HLS / MP4
    if (type === "hls" && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
           setError("Stream error. Try refreshing.");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS (Safari)
      video.src = url;
    } else {
      // MP4 biasa
      video.src = url;
    }

    // Initialize Plyr (Tanpa 'tracks' di config, karena udah di JSX)
    player = new Plyr(video, {
      controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "fullscreen"],
      // HAPUS BAGIAN TRACKS YANG BIKIN ERROR ITU
    });

    // Load saved time
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }

    // Save progress interval
    const saveInterval = setInterval(() => {
      if (video && !video.paused) {
        localStorage.setItem(storageKey, video.currentTime.toString());
      }
    }, 5000);

    // Event Listener 'ended'
    const handleEnded = () => {
       if (onEnded) onEnded();
    };
    video.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(saveInterval);
      video.removeEventListener("ended", handleEnded);
      if (hls) hls.destroy();
      if (player) player.destroy();
    };
  }, [url, type, subtitles, storageKey, onEnded]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black text-white p-4 text-center">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video 
        ref={videoRef} 
        className="plyr-react plyr" 
        playsInline 
        crossOrigin="anonymous"
      >
        {/* INI CARA BENER PASANG SUBTITLE BIAR GAK ERROR TYPE */}
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
