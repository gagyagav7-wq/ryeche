import Link from "next/link";

// --- DATA STRUKTUR BARU ---
const SUB_CHANNELS = [
  {
    id: "flickreels",
    name: "FlickReels",
    desc: "Short cinematic universe.",
    initial: "F",
    status: "ACTIVE",
    color: "bg-[#A8E6CF]", // Mint subtle
  },
  {
    id: "netshort",
    name: "NetShort",
    desc: "Vertical series HD.",
    initial: "N",
    status: "ACTIVE",
    color: "bg-[#FDFFB6]", // Butter subtle
  },
  {
    id: "dramabox",
    name: "DramaBox",
    desc: "Daily curated picks.",
    initial: "D",
    status: "LOCKED", // Contoh status
    color: "bg-[#FFD6A5]", 
  },
  {
    id: "reelshort",
    name: "ReelShort",
    desc: "Snack-sized drama.",
    initial: "R",
    status: "LOCKED",
    color: "bg-[#FF9A9E]",
  },
  {
    id: "melolo",
    name: "Melolo",
    desc: "Asian variety shows.",
    initial: "M",
    status: "SOON",
    color: "bg-[#E5E5E5]",
  },
];

// --- FEATURES DATA ---
const FEATURES = [
  { title: "Downloader", icon: "⚡", desc: "Save content offline." },
  { title: "Smart Search", icon: "🔍", desc: "Instant find." },
  { title: "Playlist", icon: "▶️", desc: "Auto-play next." },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col relative overflow-x-hidden pb-24">
      
      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 left-0 w-full h-full opacity-50 pointer-events-none -z-10"
           style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.8) 0%, rgba(247,245,240,0) 70%)' }}>
      </div>

      {/* =======================
          1. HERO SECTION (Simplified for Context)
         ======================= */}
      <section className="pt-24 pb-16 px-6 text-center">
        <div className="inline-block bg-[#121212] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-4">
          Private Access Only
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#121212] mb-6">
          BUTTER<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A9E] to-[#FDFFB6]" style={{ WebkitTextStroke: '2px #121212' }}>HUB</span>
        </h1>
        <div className="flex justify-center gap-4">
            <Link href="/login" className="px-8 py-3 bg-[#121212] text-white font-black uppercase tracking-wider border-[3px] border-[#121212] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#121212] transition-all">
                Masuk
            </Link>
            <Link href="/register" className="px-8 py-3 bg-[#FDFFB6] text-[#121212] font-black uppercase tracking-wider border-[3px] border-[#121212] shadow-[4px_4px_0px_#121212] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#121212] transition-all">
                Daftar
            </Link>
        </div>
      </section>

      {/* =======================
          2. KOLEKSI ARSIP (HIERARCHY FIXED)
         ======================= */}
      <section className="px-4 md:px-8 max-w-6xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex items-end justify-between border-b-[3px] border-[#121212] pb-4 mb-8">
            <div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Koleksi Arsip</h2>
                <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-1">Ekosistem Konten & Platform</p>
            </div>
            <div className="hidden md:block">
                <span className="badge-chip bg-white">TOTAL: {SUB_CHANNELS.length + 1} PLATFORMS</span>
            </div>
        </div>

        {/* --- PARENT CARD: DRACIN --- */}
        <div className="neo-master-card p-0 flex flex-col">
            
            {/* A. HEADER DRACIN (MASTER) */}
            <div className="p-8 md:p-10 border-b-[3px] border-[#121212] bg-white relative">
                <div className="absolute top-0 right-0 bg-[#121212] text-white px-4 py-2 text-xs font-black uppercase tracking-widest border-l-[3px] border-b-[3px] border-[#121212]">
                    Master Hub
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Icon Box */}
                    <div className="w-20 h-20 bg-[#FF9A9E] border-[3px] border-[#121212] flex items-center justify-center text-4xl shadow-[4px_4px_0px_#121212]">
                        🍿
                    </div>
                    
                    <div className="flex-grow space-y-2">
                        <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                            DRACIN STREAM
                        </h3>
                        <p className="text-sm font-bold opacity-60 max-w-lg leading-relaxed">
                            Rumah utama hiburan Asia. Koleksi drama premium, update harian, player brutal tanpa iklan.
                        </p>
                    </div>

                    <div className="w-full md:w-auto mt-4 md:mt-0">
                         {/* Button: Dummy Link karena guest mode */}
                         <button disabled className="w-full px-8 py-3 bg-[#121212] text-white font-black uppercase border-[3px] border-[#121212] opacity-80 cursor-not-allowed">
                            Login Untuk Akses
                        </button>
                    </div>
                </div>
            </div>

            {/* B. SUB-CHANNELS GRID (INSIDE PARENT) */}
            <div className="bg-[#F2F0E9] p-6 md:p-8 border-t-[3px] border-[#121212] hidden"> 
                 {/* Hack: hidden border-t biar rapi kalau kosong, tapi kita isi konten */}
            </div>
            
            <div className="bg-[#FAFAFA] p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6 opacity-60">
                    <div className="h-[2px] w-8 bg-[#121212]"></div>
                    <span className="text-xs font-black uppercase tracking-widest">Channels di dalam Dracin</span>
                    <div className="h-[2px] flex-grow bg-[#121212] opacity-20"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {SUB_CHANNELS.map((sub) => (
                        <div key={sub.id} className="neo-sub-card p-5 group">
                            
                            <div className="flex justify-between items-start mb-3">
                                {/* Initials Box (Ganti strip warna norak) */}
                                <div className={`w-10 h-10 ${sub.color} border-[3px] border-[#121212] flex items-center justify-center font-black text-lg`}>
                                    {sub.initial}
                                </div>
                                
                                {/* Status Badge */}
                                <span className={`badge-chip ${sub.status === 'ACTIVE' ? 'bg-[#A8E6CF]' : 'bg-[#E5E5E5] opacity-50'}`}>
                                    {sub.status}
                                </span>
                            </div>

                            <h4 className="text-xl font-black uppercase mb-1 group-hover:underline decoration-2 underline-offset-2">
                                {sub.name}
                            </h4>
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-wide mb-4">
                                {sub.desc}
                            </p>

                            <div className="mt-auto pt-3 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase opacity-40">Channel {sub.initial}01</span>
                                <span className="text-[10px] font-black uppercase hover:bg-black hover:text-white px-2 py-1 transition-colors cursor-pointer">
                                    Open →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

      </section>

      {/* =======================
          3. UTILITIES & TOOLS (SEPARATED)
         ======================= */}
      <section className="px-4 md:px-8 max-w-6xl mx-auto w-full mt-16 mb-16">
         <div className="flex items-end gap-4 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight opacity-40">Fitur & Utilitas</h2>
            <div className="h-[2px] flex-grow bg-[#121212] mb-2 opacity-10"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => (
                <div key={idx} className="bg-white border-[3px] border-[#121212] p-5 shadow-[4px_4px_0px_#121212] flex items-center gap-4">
                    <div className="text-2xl grayscale">{feat.icon}</div>
                    <div>
                        <h4 className="font-black uppercase text-sm">{feat.title}</h4>
                        <p className="text-[10px] font-bold opacity-50 uppercase">{feat.desc}</p>
                    </div>
                </div>
            ))}
         </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-[10px] font-black uppercase tracking-widest opacity-30">
        &copy; 2026 ButterHub Ecosystem.
      </footer>

    </main>
  );
}
