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
  
  const networkRetryCount = useRef(0);
  const mediaRetryCount = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const lastSavedTime = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(true); 

  // --- LOGIC: Handler (useCallback biar dependency aman) ---
  const saveProgress = useCallback(() => {
    if (videoRef.current) {
      localStorage.setItem(storageKey, String(videoRef.current.currentTime));
    }
  }, [storageKey]);

  const handleTimeUpdate = useCallback(() => {
    // Kalau time update jalan, berarti video main -> matikan buffering
    setIsBuffering(false);

    const now = Date.now();
    if (now - lastSavedTime.current > 2000) {
      saveProgress();
      lastSavedTime.current = now;
    }
  }, [saveProgress]);

  const handlePauseOrEnd = useCallback(() => saveProgress(), [saveProgress]);
  
  const handlePlaying = useCallback(() => setIsBuffering(false), []);
  
  // FIX: Handle waiting/stalled buat nyalain spinner
  const handleBuffering = useCallback(() => setIsBuffering(true), []);

  const handleMetadataLoaded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // FIX: Metadata udah ke-load, matikan spinner (walau belum play)
    setIsBuffering(false);

    const savedTime = localStorage.getItem(storageKey);
    if (savedTime) {
      const time = parseFloat(savedTime);
      if (!isNaN(time) && Number.isFinite(video.duration) && time > 0 && time < video.duration - 2) {
        video.currentTime = time;
      }
    }
  }, [storageKey]);

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
    setIsBuffering(true);
    networkRetryCount.current = 0;
    mediaRetryCount.current = 0;

    const handleNativeError = () => {
      if (video.error) {
         setIsBuffering(false);
         setError(getNativeErrorMessage(video.error.code));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveProgress();
    };

    const handlePageHide = () => saveProgress();

    // Event Listeners
    video.addEventListener("error", handleNativeError);
    video.addEventListener("stalled", handleBuffering);
    video.addEventListener("waiting", handleBuffering);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handlePlaying); // Tambahan biar makin responsif
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

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
              // FIX: Nyalain buffering pas lagi retry network
              setIsBuffering(true);
              
              if (networkRetryCount.current < 3) {
                networkRetryCount.current++;
                const delay = networkRetryCount.current * 1000;
                console.log(`Network error, retry ${networkRetryCount.current}/3 in ${delay}ms...`);
                
                if (retryTimer.current) clearTimeout(retryTimer.current);
                
                retryTimer.current = setTimeout(() => {
                  if (!hlsRef.current) return;
                  hlsRef.current.startLoad();
                  // FIX: Nullify timer ref setelah jalan
                  retryTimer.current = null;
                }, delay);
                
              } else {
                hls.destroy();
                setError("Jaringan bermasalah, gagal memuat video.");
                setIsBuffering(false);
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              if (mediaRetryCount.current < 3) {
                mediaRetryCount.current++;
                hls.recoverMediaError();
              } else {
                hls.destroy();
                setError("Video rusak, tidak dapat dipulihkan.");
                setIsBuffering(false);
              }
              break;
            default:
              hls.destroy();
              setError("Fatal Stream Error.");
              setIsBuffering(false);
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

    // --- CLEANUP ---
    return () => {
      video.removeEventListener("error", handleNativeError);
      video.removeEventListener("stalled", handleBuffering);
      video.removeEventListener("waiting", handleBuffering);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("canplay", handlePlaying);
      
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      
      if (retryTimer.current) {
        clearTimeout(retryTimer.current);
        retryTimer.current = null;
      }

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      video.pause();
      video.src = "";
      video.load();
    };
  }, [url, type, saveProgress, handlePlaying, handleBuffering]);

  return (
    <div className="relative aspect-video bg-black w-full overflow-hidden border-brut border-main group">
      {/* ERROR UI */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 text-white p-4 text-center">
          <p className="text-danger font-black text-xl mb-2">⚠️ ERROR</p>
          <p className="text-sm font-bold opacity-80">{error}</p>
        </div>
      )}

      {/* BUFFERING UI */}
      {!error && isBuffering && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      <video
        ref={videoRef}
        key={url}
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
