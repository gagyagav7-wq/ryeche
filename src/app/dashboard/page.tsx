import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh flex flex-col font-sans">
      
      {/* =======================
          1. HEADER (The Control Bar)
          Clean, aligned, functional.
         ======================= */}
      <header className="pt-8 pb-6 border-b-[3px] border-[var(--neo-ink)] bg-[var(--neo-bg)] sticky top-0 z-50">
        <div className="neo-container flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand Block */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--neo-ink)] text-white flex items-center justify-center font-black text-xl border-[3px] border-[var(--neo-ink)]">
              B
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
                BUTTER<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A9E] to-[#FDFFB6]">HUB</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#A8E6CF] animate-pulse border border-black"></span>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">System Operational</p>
              </div>
            </div>
          </div>

          {/* User/Session Block */}
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <span className="text-[9px] font-bold uppercase opacity-40 block mb-0.5">Session ID</span>
              <span className="text-xs font-mono font-bold bg-[#E5E5E5] px-2 py-1 rounded-sm border border-black/20">#BH-USER-01</span>
            </div>
            {/* Menggunakan styling baru untuk tombol logout */}
            <div className="neo-btn-logout">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* =======================
          2. MAIN CANVAS (The Gallery)
         ======================= */}
      <div className="flex-grow py-12 neo-container">
        
        {/* SECTION HEADER */}
        <div className="flex items-end gap-4 mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tight">Modules</h2>
          <div className="h-[4px] flex-grow bg-[var(--neo-ink)] mb-3 opacity-10 rounded-full"></div>
        </div>

        {/* --- CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* CARD 1: DRACIN */}
          <div className="neo-card group min-h-[380px]">
            {/* Header Content Area */}
            <div className="p-8 flex-grow flex flex-col items-center text-center relative">
              
              {/* Floating Badge (Ganti strip warna norak) */}
              <div className="absolute top-6 right-6">
                <span className="neo-badge pink">Main App</span>
              </div>

              {/* Icon Monumental */}
              <div className="mt-8 mb-6 text-7xl filter drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                🍿
              </div>

              {/* Typography Hierarchy */}
              <h3 className="text-3xl font-black uppercase mb-3 underline decoration-[4px] decoration-[#FF9A9E] underline-offset-4">
                Dracin Stream
              </h3>
              <p className="text-sm font-bold opacity-60 max-w-xs leading-relaxed">
                Akses perpustakaan drama premium. Tanpa iklan, update harian.
              </p>
            </div>

            {/* STRONG CTA (Full Width) */}
            <Link href="/dracin" className="neo-btn group-hover:bg-[#FF9A9E] group-hover:text-black group-hover:border-t-[3px]">
              BUKA APLIKASI
            </Link>
          </div>

          {/* CARD 2: DOWNLOADER */}
          <div className="neo-card group min-h-[380px]">
            <div className="p-8 flex-grow flex flex-col items-center text-center relative">
              
              <div className="absolute top-6 right-6">
                <span className="neo-badge butter">Utility</span>
              </div>

              <div className="mt-8 mb-6 text-7xl filter drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                ⚡
              </div>

              <h3 className="text-3xl font-black uppercase mb-3 underline decoration-[4px] decoration-[#FDFFB6] underline-offset-4">
                Downloader
              </h3>
              <p className="text-sm font-bold opacity-60 max-w-xs leading-relaxed">
                Unduh video dari sosial media tanpa watermark. Cepat & gratis.
              </p>
            </div>

            <Link href="/downloader" className="neo-btn group-hover:bg-[#FDFFB6] group-hover:text-black group-hover:border-t-[3px]">
              BUKA TOOLS
            </Link>
          </div>

        </div>

        {/* --- QUICK ACCESS (Secondary Grid) --- */}
        <div className="mb-4">
           <h4 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Quick Access Menus</h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Loop items dummy */}
          {['History', 'Requests', 'Profile', 'Settings'].map((item) => (
            <button key={item} disabled className="neo-quick-btn group">
              <span className="text-xs font-black uppercase">{item}</span>
              <span className="text-[8px] font-bold bg-black text-white px-1.5 py-0.5 rounded-sm group-hover:bg-red-500">SOON</span>
            </button>
          ))}
        </div>

      </div>

      {/* =======================
          3. FOOTER (Anchored)
         ======================= */}
      <footer className="py-8 text-center border-t-[3px] border-[var(--neo-ink)] bg-white">
        <p className="text-[10px] font-mono font-bold opacity-30 uppercase tracking-[0.2em]">
          ButterHub Ecosystem &copy; 2026 • All Systems Normal
        </p>
      </footer>

    </main>
  );
}
