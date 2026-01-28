import Link from "next/link";

// --- DATA: SUB-COLLECTIONS ---
const CHANNELS = [
  { id: "flickreels", name: "FlickReels", desc: "Short cinematic universe.", status: "ACTIVE", initial: "F" },
  { id: "netshort", name: "NetShort", desc: "Vertical series HD.", status: "ACTIVE", initial: "N" },
  { id: "dramabox", name: "DramaBox", desc: "Daily curated picks.", status: "LOCKED", initial: "D" },
  { id: "reelshort", name: "ReelShort", desc: "Snack-sized drama.", status: "LOCKED", initial: "R" },
  { id: "melolo", name: "Melolo", desc: "Asian variety shows.", status: "SOON", initial: "M" },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col relative overflow-x-hidden font-sans pb-24">
      
      {/* =======================
          1. HERO (Minimalist Entrance)
         ======================= */}
      <section className="pt-24 pb-20 px-6 text-center">
        <div className="inline-block bg-[#121212] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-6 border-[3px] border-transparent">
          Private Access Only
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-[#121212] mb-8">
          BUTTER<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A9E] to-[#FDFFB6]" style={{ WebkitTextStroke: '3px #121212' }}>HUB</span>
        </h1>
        
        <div className="flex justify-center gap-4">
            <Link href="/login" className="neo-btn bg-[#121212] text-white hover:bg-[#333]">
                Masuk Member
            </Link>
            <Link href="/register" className="neo-btn bg-[#FDFFB6] text-[#121212] hover:bg-white">
                Daftar Akun
            </Link>
        </div>
      </section>

      {/* =======================
          2. KOLEKSI ARSIP (The Masterpiece)
         ======================= */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto w-full">
        
        {/* A. Section Header (Clean & Technical) */}
        <div className="flex items-end justify-between border-b-[3px] border-[#121212] pb-4 mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Koleksi Arsip</h2>
                <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-1">Ekosistem Konten & Platform</p>
            </div>
            <div className="hidden md:block">
                <span className="neo-chip bg-white">SYSTEM V2.0</span>
            </div>
        </div>

        {/* B. THE MASTER HUB CARD (Container Utama) */}
        <div className="neo-card bg-white p-0 flex flex-col">
            
            {/* --- TOP: DRACIN MASTER IDENTITY --- */}
            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center relative">
                
                {/* Badge Absolute */}
                <div className="absolute top-0 right-0 bg-[#FDFFB6] px-4 py-2 border-b-[3px] border-l-[3px] border-[#121212] text-[10px] font-black uppercase tracking-widest">
                    Master Hub
                </div>

                {/* Icon Big */}
                <div className="w-24 h-24 bg-[#FF9A9E] border-[3px] border-[#121212] flex items-center justify-center shadow-[6px_6px_0px_#121212]">
                    <span className="text-5xl">🍿</span>
                </div>

                {/* Info Text */}
                <div className="flex-grow space-y-3">
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none decoration-4 underline-offset-4 decoration-[#FF9A9E] underline">
                        Dracin Stream
                    </h3>
                    <p className="text-sm font-bold opacity-60 max-w-xl leading-relaxed">
                        Rumah utama hiburan Asia. Koleksi drama premium, update harian, player brutal tanpa iklan. Semua channel sub-konten terhubung di sini.
                    </p>
                </div>

                {/* CTA Action (Badge Style jika Guest) */}
                <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col gap-2 items-center md:items-end">
                     <span className="text-[9px] font-black uppercase opacity-40">Access Required</span>
                     <Link href="/login" className="neo-btn bg-[#121212] text-white w-full md:w-auto">
                        Login Untuk Akses
                     </Link>
                </div>
            </div>

            {/* --- MIDDLE: DIVIDER & LABEL --- */}
            <div className="bg-[#F6F1E8] px-8 py-4 border-y-[3px] border-[#121212] flex items-center gap-4">
                <div className="w-2 h-2 bg-[#121212] rounded-full"></div>
                <h4 className="text-xs font-black uppercase tracking-widest opacity-80">
                    Channel Grid (Integrated Platforms)
                </h4>
                <div className="h-[2px] flex-grow bg-[#121212] opacity-10"></div>
                <span className="text-[10px] font-mono font-bold opacity-40">TOTAL: {CHANNELS.length}</span>
            </div>

            {/* --- BOTTOM: CHANNELS GRID --- */}
            <div className="p-8 md:p-12 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CHANNELS.map((ch) => (
                        <div key={ch.id} className="group relative border-[3px] border-[#121212] p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#121212] transition-all bg-white flex flex-col">
                            
                            {/* Header Card: Initials & Status */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-8 h-8 bg-[#121212] text-white flex items-center justify-center font-black text-sm border-[2px] border-transparent group-hover:bg-[#FF9A9E] group-hover:text-[#121212] group-hover:border-[#121212] transition-colors">
                                    {ch.initial}
                                </div>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase border border-[#121212] rounded-sm 
                                    ${ch.status === 'ACTIVE' ? 'bg-[#A8E6CF]' : 'bg-[#E5E5E5] opacity-60'}`}>
                                    {ch.status}
                                </span>
                            </div>

                            {/* Content */}
                            <h5 className="text-lg font-black uppercase mb-1">{ch.name}</h5>
                            <p className="text-[10px] font-bold opacity-50 uppercase leading-relaxed mb-6">
                                {ch.desc}
                            </p>

                            {/* Footer Link */}
                            <div className="mt-auto pt-3 border-t-[2px] border-dashed border-[#E5E5E5] flex justify-between items-center">
                                <span className="text-[9px] font-mono font-bold opacity-30">IDX-{ch.initial}01</span>
                                <span className="text-[9px] font-black uppercase group-hover:underline cursor-pointer">
                                    Open &rarr;
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 py-8 text-center border-t-[3px] border-[#121212] bg-white">
        <p className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-widest">
          &copy; 2026 ButterHub Ecosystem. Secure Connection.
        </p>
      </footer>

    </main>
  );
}
