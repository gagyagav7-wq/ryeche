"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <main className="min-h-dvh bg-bg text-main p-4 md:p-8 relative overflow-hidden">
      
      {/* --- DECORATIVE BG (Optimized Blur) --- */}
      {/* Blur dikurangi jadi xl biar lebih ringan di mobile */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FDFFB6] rounded-full border-brut border-main opacity-60 -z-10 blur-xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#A8E6CF] rounded-full border-brut border-main opacity-60 -z-10 blur-xl" />

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-brut border-main pb-6 bg-white/50 backdrop-blur-sm p-4 rounded-sm border-brut shadow-brut-sm">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              COMMAND<span className="text-accent">CENTER</span>
            </h1>
            <p className="text-sm font-bold opacity-60">Selamat datang kembali, Commander.</p>
          </div>
          <BrutButton 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            variant="secondary" 
            className="text-sm py-2 px-6 bg-white"
          >
            {isLoggingOut ? "KELUAR..." : "LOGOUT 🚪"}
          </BrutButton>
        </header>

        {/* APPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. DRACIN (Hero Card) */}
          <div className="md:col-span-2 lg:col-span-2 group">
            <Link href="/dracin" className="block h-full outline-none focus-visible:ring-4 focus-visible:ring-main rounded-none">
              {/* Tambah md:hover biar cuma aktif di desktop */}
              <BrutCard className="h-full bg-white md:hover:bg-surface transition-colors border-brut shadow-brut md:group-hover:translate-y-[-4px] transition-transform duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-accent text-white font-black px-3 py-1 border-b-brut border-l-brut border-main text-xs z-10">
                  FLAGSHIP
                </div>
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-1/2 aspect-video md:aspect-auto bg-black relative border-b-brut md:border-b-0 md:border-r-brut border-main overflow-hidden">
                    {/* Placeholder Visual Dracin */}
                    <div className="absolute inset-0 bg-[url('https://placehold.co/600x400/1a1a1a/FFF?text=DRACIN+STREAM')] bg-cover bg-center opacity-80 md:group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl md:group-hover:scale-110 transition-transform">🍿</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-center space-y-4 w-full md:w-1/2">
                    <div>
                      <h2 className="text-3xl font-black uppercase mb-2">Dracin Stream</h2>
                      <p className="font-bold opacity-70 text-sm">
                        Katalog ribuan drama china ongoing & completed. Player brutal, tanpa iklan popup sampah.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block bg-main text-white px-4 py-2 font-black text-sm uppercase md:group-hover:bg-accent transition-colors border-brut border-white shadow-sm">
                        GAS NONTON &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </BrutCard>
            </Link>
          </div>

          {/* 2. DOWNLOADER */}
          <Link href="/downloader" className="group outline-none focus-visible:ring-4 focus-visible:ring-main rounded-none">
            <BrutCard className="h-full bg-[#FDFFB6] md:hover:brightness-105 transition-all border-brut shadow-brut md:group-hover:translate-y-[-4px] flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 text-4xl md:group-hover:rotate-12 transition-transform">⚡</div>
              <div className="space-y-3 mt-8">
                <h2 className="text-2xl font-black uppercase border-b-2 border-main pb-2 inline-block">Downloader</h2>
                <p className="font-bold text-sm opacity-80">
                  Sedot video TikTok, IG, Youtube tanpa watermark. Murni file video.
                </p>
              </div>
              <div className="mt-6 text-right">
                <span className="text-xs font-black uppercase opacity-50 md:group-hover:opacity-100">Buka Tools &rarr;</span>
              </div>
            </BrutCard>
          </Link>

          {/* 3. TOOLS (Placeholder) */}
          <div className="group opacity-70 md:hover:opacity-100 transition-opacity cursor-not-allowed">
            <BrutCard className="h-full bg-gray-200 border-brut shadow-brut flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-black uppercase text-gray-500">Tools</h2>
                  <span className="text-2xl grayscale">🛠️</span>
                </div>
                <p className="font-bold text-sm text-gray-500">
                  Utility belt: Image upscaler, PDF tools, dll. (Coming Soon)
                </p>
              </div>
              <div className="mt-4">
                <span className="bg-gray-400 text-white px-2 py-1 text-[10px] font-bold uppercase border border-main">Dev Process</span>
              </div>
            </BrutCard>
          </div>

          {/* 4. SETTINGS (Placeholder) */}
          <div className="group opacity-70 md:hover:opacity-100 transition-opacity cursor-not-allowed">
            <BrutCard className="h-full bg-white border-brut shadow-brut flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-black uppercase text-gray-500">Settings</h2>
                  <span className="text-2xl grayscale">⚙️</span>
                </div>
                <p className="font-bold text-sm text-gray-500">
                  Atur profil, ganti password, dan preferensi akun.
                </p>
              </div>
            </BrutCard>
          </div>

        </div>
      </div>
    </main>
  );
}
