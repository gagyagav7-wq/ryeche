import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";

export default function LandingPage() {
  return (
    <main className="min-h-dvh relative overflow-hidden bg-bg text-main selection:bg-accent selection:text-white flex flex-col">
      
      {/* --- DECORATIVE LAYERS (Optimized) --- */}
      {/* Noise Texture: Absolute (bukan fixed) biar ikut scroll & ringan */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-20" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* Shapes: Tanpa Blur/Pulse biar tajam (Neo-Brutalism sejati) */}
      <div className="absolute top-[-5%] right-[-10%] md:right-[5%] w-64 h-64 md:w-96 md:h-96 bg-[#A8E6CF] rounded-full border-brut border-main opacity-100 -z-10" />
      <div className="absolute bottom-[10%] left-[-15%] md:left-[-5%] w-72 h-72 bg-[#FDFFB6] border-brut border-main rotate-12 -z-10" />

      {/* --- MAIN CONTENT --- */}
      <div className="flex-grow flex items-center">
        <div className="max-w-6xl mx-auto w-full p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* === KOLOM KIRI: HERO TEXT & CTA === */}
          <div className="space-y-8 z-10 text-center lg:text-left pt-10 lg:pt-0">
            
            {/* Brand Badge */}
            <div className="inline-flex relative">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                BUTTER<br/><span className="text-accent">HUB</span>
              </h1>
              {/* Badge: Pakai border-brut biar konsisten */}
              <span className="absolute -top-6 -right-6 md:-right-10 rotate-6 bg-main text-white text-xs md:text-sm font-bold px-3 py-1 border-brut border-white shadow-brut-sm">
                BETA v1.0
              </span>
            </div>

            {/* Subtext */}
            <p className="text-lg md:text-2xl font-bold opacity-90 max-w-lg mx-auto lg:mx-0 leading-tight">
              Satu akses. Semua hiburan. <br className="hidden md:block" />
              Platform <span className="bg-[#A8E6CF] px-1 border-brut border-main">Dracin</span>, <span className="bg-[#FDFFB6] px-1 border-brut border-main">Downloader</span>, dan <span className="bg-accent px-1 text-white border-brut border-main">Tools</span> paling brutal.
            </p>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {['📺 Streaming HD', '⬇️ No-WM Download', '🛠️ Utility'].map((chip, idx) => (
                <div key={idx} className="bg-surface border-brut border-main px-4 py-2 rounded-full text-xs md:text-sm font-black shadow-brut-sm hover:-translate-y-1 transition-transform cursor-default">
                  {chip}
                </div>
              ))}
            </div>

            {/* Desktop CTA (Hidden on Mobile) */}
            <div className="hidden lg:flex gap-4 pt-4">
              <Link href="/login" className="w-48 outline-none focus-visible:ring-4 focus-visible:ring-main/30 rounded-none">
                <BrutButton fullWidth variant="primary" className="h-14 text-lg">
                  MASUK HUB
                </BrutButton>
              </Link>
              <Link href="/register" className="w-48 outline-none focus-visible:ring-4 focus-visible:ring-main/30 rounded-none">
                <BrutButton fullWidth variant="secondary" className="h-14 text-lg">
                  DAFTAR
                </BrutButton>
              </Link>
            </div>
          </div>

          {/* === KOLOM KANAN: CARD STACK (Desktop Only) === */}
          <div className="hidden lg:block relative h-[500px] w-full">
            {/* Card 3 (Belakang - Tools) */}
            <div className="absolute top-12 right-12 w-80 rotate-6 hover:rotate-12 transition-transform duration-300 z-10">
              <BrutCard className="bg-gray-200" title="TOOLS">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🛠️</div>
                  <p className="text-sm font-bold opacity-70 truncate">Utility belt buat power user.</p>
                </div>
              </BrutCard>
            </div>

            {/* Card 2 (Tengah - Downloader) */}
            <div className="absolute top-24 right-24 w-80 -rotate-3 hover:-rotate-6 transition-transform duration-300 z-20">
              <BrutCard className="bg-[#FDFFB6]" title="DOWNLOADER">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">⚡</div>
                  <p className="text-sm font-bold opacity-70 truncate">Sedot video TikTok/IG polos.</p>
                </div>
              </BrutCard>
            </div>

            {/* Card 1 (Depan - Dracin) - Main Focus */}
            <div className="absolute top-40 right-36 w-80 -rotate-6 hover:rotate-0 transition-transform duration-300 z-30 group cursor-default">
              <BrutCard className="bg-white" title="DRACIN">
                <div className="space-y-3">
                  <div className="aspect-video bg-main w-full relative overflow-hidden border-b-brut border-main">
                     <div className="absolute inset-0 bg-accent opacity-20 group-hover:opacity-40 transition-opacity"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-white font-black text-4xl">▶</div>
                  </div>
                  <div className="flex items-center gap-3 px-1">
                    <div className="text-3xl">🍿</div>
                    <p className="text-sm font-bold truncate">Nonton ribuan drama on-going.</p>
                  </div>
                </div>
              </BrutCard>
            </div>
          </div>

        </div>
      </div>

      {/* === MOBILE STICKY CTA (Optimized) === */}
      {/* Sticky bottom beneran, ada backdrop blur biar teks belakang gak ganggu */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 p-4 pb-6 bg-bg/90 backdrop-blur-md border-t-brut border-main z-50 flex gap-3">
        <Link href="/login" className="flex-1 outline-none focus-visible:ring-4 focus-visible:ring-main">
          <BrutButton fullWidth variant="primary" className="py-3 text-lg">
            LOGIN
          </BrutButton>
        </Link>
        <Link href="/register" className="flex-1 outline-none focus-visible:ring-4 focus-visible:ring-main">
          <BrutButton fullWidth variant="secondary" className="py-3 text-lg">
            DAFTAR
          </BrutButton>
        </Link>
      </div>

      <footer className="hidden lg:block absolute bottom-4 left-0 right-0 text-center text-xs font-bold opacity-40 uppercase tracking-widest pointer-events-none">
        ButterHub Project © 2026
      </footer>
    </main>
  );
}
