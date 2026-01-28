import Link from "next/link";
import LogoutButton from "@/components/LogoutButton"; // Pastikan path import ini sesuai

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-[#F2F0E9] text-[#121212] relative flex flex-col">
      
      {/* 1. BACKGROUND TEXTURE (NOISE + DECORATION) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
      
      {/* Dekorasi Abstrak (Creamy shapes) */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-[#FDFFB6] rounded-full blur-[80px] opacity-50 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-[#FF9A9E] rounded-full blur-[80px] opacity-40 pointer-events-none" />

      {/* =======================
          2. HEADER SECTION
         ======================= */}
      <header className="relative z-10 px-6 py-8 md:px-12 border-b-[3px] border-[#121212] bg-[#F2F0E9]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand Identity */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              BUTTER<span className="bg-[#121212] text-[#F2F0E9] px-2 ml-1">HUB</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start opacity-60">
              <span className="w-2 h-2 bg-[#FF9A9E] rounded-full animate-pulse"></span>
              <p className="text-xs font-bold uppercase tracking-widest font-mono">
                System Control Center
              </p>
            </div>
          </div>

          {/* Logout Area */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold uppercase opacity-50">Current Session</p>
              <p className="text-xs font-black uppercase">Active</p>
            </div>
            {/* Wrapper div untuk styling tombol logout existing */}
            <div className="logout-btn-premium">
              <LogoutButton /> 
            </div>
          </div>
        </div>
      </header>

      {/* =======================
          3. MAIN CONTENT (CARDS)
         ======================= */}
      <section className="relative z-10 flex-grow px-6 py-12 md:px-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* GRID KARTU APLIKASI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CARD 1: DRACIN (MAIN APP) */}
            <div className="dashboard-card group min-h-[320px]">
              {/* Badge */}
              <div className="card-badge bg-[#FF9A9E] text-[#121212]">
                Main Module
              </div>
              
              <div className="p-8 flex flex-col h-full justify-center items-center text-center space-y-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🍿</div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tight decoration-4 decoration-[#FF9A9E] underline underline-offset-4">
                    Dracin Stream
                  </h2>
                  <p className="text-sm font-bold opacity-60 max-w-xs mx-auto leading-relaxed">
                    Akses ribuan Drama China premium. Update harian, player brutal, tanpa iklan.
                  </p>
                </div>
              </div>

              {/* CTA Full Width */}
              <Link href="/dracin" className="action-btn action-btn-primary group-hover:bg-[#121212] group-hover:text-white">
                BUKA APLIKASI &rarr;
              </Link>
            </div>

            {/* CARD 2: DOWNLOADER (TOOLS) */}
            <div className="dashboard-card group min-h-[320px]">
              {/* Badge */}
              <div className="card-badge bg-[#A8E6CF] text-[#121212]">
                Utility
              </div>

              <div className="p-8 flex flex-col h-full justify-center items-center text-center space-y-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">⚡</div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tight decoration-4 decoration-[#A8E6CF] underline underline-offset-4">
                    Downloader
                  </h2>
                  <p className="text-sm font-bold opacity-60 max-w-xs mx-auto leading-relaxed">
                    Unduh video TikTok, Instagram, YouTube tanpa watermark. Cepat & Gratis.
                  </p>
                </div>
              </div>

              {/* CTA Full Width */}
              <Link href="/downloader" className="action-btn action-btn-secondary">
                BUKA TOOLS &rarr;
              </Link>
            </div>

          </div>

          {/* 4. QUICK ACTIONS (MINI ROW) - OPTIONAL */}
          <div className="border-t-[3px] border-[#121212] pt-8">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Item 1 */}
              <button disabled className="px-4 py-3 border-2 border-[#121212] bg-white opacity-50 cursor-not-allowed text-xs font-bold uppercase text-left flex justify-between items-center">
                <span>History</span>
                <span className="text-[8px] bg-[#121212] text-white px-1">SOON</span>
              </button>
              {/* Item 2 */}
              <button disabled className="px-4 py-3 border-2 border-[#121212] bg-white opacity-50 cursor-not-allowed text-xs font-bold uppercase text-left flex justify-between items-center">
                <span>Request</span>
                <span className="text-[8px] bg-[#121212] text-white px-1">SOON</span>
              </button>
               {/* Item 3 */}
               <button disabled className="px-4 py-3 border-2 border-[#121212] bg-white opacity-50 cursor-not-allowed text-xs font-bold uppercase text-left flex justify-between items-center">
                <span>Profile</span>
                <span className="text-[8px] bg-[#121212] text-white px-1">SOON</span>
              </button>
               {/* Item 4 */}
               <button disabled className="px-4 py-3 border-2 border-[#121212] bg-white opacity-50 cursor-not-allowed text-xs font-bold uppercase text-left flex justify-between items-center">
                <span>Settings</span>
                <span className="text-[8px] bg-[#121212] text-white px-1">SOON</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-6 text-center border-t-[3px] border-[#121212] bg-[#F2F0E9] mt-auto">
        <p className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-widest">
          ButterHub OS v2.0 • Secure Connection Established
        </p>
      </footer>

    </main>
  );
}
