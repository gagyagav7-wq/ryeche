'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  url: string;
  type: 'hls' | 'mp4';
  subtitles?: { url: string; lang: string }[];
  storageKey: string;
}

export default function VideoPlayer({ url, type, subtitles = [], storageKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  // FIX: Split Counter biar adil
  const networkRetryCount = useRef(0);
  const mediaRetryCount = useRef(0);
  
  const lastSavedTime = useRef(0);
  const [error, setError] = useState<string | null>(null);

  // --- LOGIC: Resume & Save Progress ---
  const saveProgress = useCallback(() => {
    if (videoRef.current) {
      localStorage.setItem(storageKey, String(videoRef.current.currentTime));
    }
  }, [storageKey]);

  const handleTimeUpdate = () => {
    const now = Date.now();
    if (now - lastSavedTime.current > 2000) {
      saveProgress();
      lastSavedTime.current = now;
    }
  };

  const handlePauseOrEnd = () => saveProgress();

  const handleMetadataLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      const time = parseFloat(savedTime);
      // FIX: Tambah guard Number.isFinite biar gak error NaN
      if (!isNaN(time) && Number.isFinite(video.duration) && time > 0 && time < video.duration - 2) {
        video.currentTime = time;
      }
    }
  };

  const getNativeErrorMessage = (code: number) => {
    switch (code) {
      case 1: return "Video dibatalkan (Aborted).";
      case 2: return "Masalah jaringan (Network Error).";
      case 3: return "Video rusak/corrupt (Decode Error).";
      case 4: return "Format video tidak didukung / File tidak ditemukan.";
      default: return "Terjadi kesalahan memutar video.";
    }
  };

  // --- LOGIC: Load Video ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    // Reset kedua counter tiap ganti video
    networkRetryCount.current = 0;
    mediaRetryCount.current = 0;

    const handleNativeError = () => {
      if (video.error) {
         setError(getNativeErrorMessage(video.error.code));
      }
    };

    video.addEventListener("error", handleNativeError);

    if (type === 'hls' && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // FIX: Pakai counter khusus Network (Max 3)
              if (networkRetryCount.current < 3) {
                networkRetryCount.current++;
                console.log(`Network error, retry ${networkRetryCount.current}/3...`);
                hls.startLoad();
              } else {
                hls.destroy();
                setError("Jaringan bermasalah, gagal memuat video.");
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              // FIX: Pakai counter khusus Media (Max 3)
              if (mediaRetryCount.current < 3) {
                mediaRetryCount.current++;
                console.log(`Media error, recovering ${mediaRetryCount.current}/3...`);
                hls.recoverMediaError();
              } else {
                hls.destroy();
                setError("Video rusak, tidak dapat dipulihkan.");
              }
              break;
            default:
              hls.destroy();
              setError("Fatal Stream Error.");
              break;
          }
        }
      });
    } 
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } 
    else {
      video.src = url;
    }

    return () => {
      video.removeEventListener("error", handleNativeError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.src = "";
      video.load();
    };
  }, [url, type]);

  return (
    <div className="relative aspect-video bg-black w-full overflow-hidden border-brut border-main group">
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
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePauseOrEnd}
        onEnded={handlePauseOrEnd}
        onLoadedMetadata={handleMetadataLoaded}
      >
        {subtitles.map((sub, idx) => (
          <track
            key={idx}
            kind="subtitles"
            src={sub.url}
            srcLang={sub.lang}
            label={sub.lang}
            default={idx === 0}
          />
        ))}
        Browser Anda tidak mendukung tag video.
      </video>
    </div>
  );
}
