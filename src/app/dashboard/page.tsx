import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-bg text-main p-4 md:p-8 relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* --- DECORATIVE BG --- */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#FDFFB6] rounded-full border-brut border-main opacity-60 -z-10 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#A8E6CF] rounded-full border-brut border-main opacity-60 -z-10 blur-3xl" />

      <div className="max-w-5xl w-full space-y-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b-[3px] border-black pb-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              BUTTER<span className="text-accent bg-black text-[#FDFFB6] px-2 ml-1">HUB</span>
            </h1>
            <p className="text-sm font-bold opacity-60 mt-2 tracking-wide">PUSAT KONTROL APLIKASI</p>
          </div>
          <LogoutButton />
        </header>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. LINK KE DRACIN (FLAGSHIP APP) */}
          <Link href="/dracin" className="group outline-none">
            <BrutCard className="h-full bg-white hover:bg-[#FDFFB6] transition-all border-[3px] border-black shadow-[8px_8px_0px_#000] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#000] p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-black text-white font-bold text-[10px] px-3 py-1 uppercase tracking-widest">
                Main App
              </div>
              
              <div className="space-y-4 relative z-10">
                <span className="text-6xl block mb-4">🍿</span>
                <h2 className="text-3xl font-black uppercase border-b-4 border-black inline-block pb-1">Dracin Stream</h2>
                <p className="font-bold opacity-80 leading-relaxed">
                  Akses ribuan Drama China premium. Update harian, player brutal, tanpa iklan.
                </p>
              </div>

              <div className="mt-8 flex justify-end">
                <span className="bg-black text-white px-6 py-2 font-black uppercase text-sm group-hover:bg-white group-hover:text-black border-2 border-transparent group-hover:border-black transition-all">
                  Buka Aplikasi &rarr;
                </span>
              </div>
            </BrutCard>
          </Link>

          {/* 2. LINK KE DOWNLOADER (SECONDARY APP) */}
          <Link href="/downloader" className="group outline-none">
            <BrutCard className="h-full bg-white hover:bg-[#A8E6CF] transition-all border-[3px] border-black shadow-[8px_8px_0px_#000] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_#000] p-8 flex flex-col justify-between relative">
               <div className="space-y-4">
                <span className="text-6xl block mb-4">⚡</span>
                <h2 className="text-3xl font-black uppercase border-b-4 border-black inline-block pb-1">Downloader</h2>
                <p className="font-bold opacity-80 leading-relaxed">
                  Download video TikTok, Instagram, YouTube tanpa watermark. Cepat & gratis.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                 <span className="font-black uppercase text-sm opacity-50 group-hover:opacity-100">Tools &rarr;</span>
              </div>
            </BrutCard>
          </Link>

        </div>

        <footer className="text-center text-xs font-bold opacity-30 pt-8">
          &copy; 2026 BUTTERHUB ECOSYSTEM. ALL SYSTEMS NORMAL.
        </footer>

      </div>
    </main>
  );
}
