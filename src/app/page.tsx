import Link from "next/link";

// --- DATA MOCKUP ---
const SUB_CHANNELS = [
  { id: "flickreels", name: "FlickReels", desc: "Short cinematic universe.", status: "ACTIVE", initial: "F" },
  { id: "netshort", name: "NetShort", desc: "Vertical series HD.", status: "ACTIVE", initial: "N" },
  { id: "dramabox", name: "DramaBox", desc: "Daily curated picks.", status: "LOCKED", initial: "D" },
  { id: "reelshort", name: "ReelShort", desc: "Snack-sized drama.", status: "LOCKED", initial: "R" },
  { id: "melolo", name: "Melolo", desc: "Asian variety shows.", status: "SOON", initial: "M" },
];

const FEATURES = [
  { title: "Downloader", icon: "⚡", desc: "No-watermark downloads." },
  { title: "Smart Search", icon: "🔍", desc: "Find content instantly." },
  { title: "My List", icon: "❤️", desc: "Save favorites." },
  { title: "History", icon: "🕒", desc: "Continue watching." },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col relative overflow-x-hidden pb-24 font-sans">
      
      {/* DECORATION: Subtle Spotlight (Creamy Gradient) */}
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#FDFFB6] rounded-full blur-[120px] opacity-20 pointer-events-none -z-10" />

      {/* =========================================
          1. HERO SECTION (The Portal Entrance)
         ========================================= */}
      <section className="pt-24 pb-20 neo-container text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-block border-[2px] border-[#121212] bg-white px-4 py-1.5 mb-8 transform -rotate-2 hover:rotate-0 transition-transform">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-[#FF9A9E] rounded-full animate-pulse border border-black"></span>
            Private Access Only
          </span>
        </div>

        {/* Monumental Headline */}
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] text-[#121212] mb-8">
          BUTTER<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#FF9A9E] to-[#FDFFB6]" style={{ WebkitTextStroke: '3px #121212' }}>HUB</span>
        </h1>

        <p className="text-sm md:text-lg font-bold opacity-60 max-w-xl mx-auto mb-10 leading-relaxed uppercase tracking-wide">
          Portal streaming premium. Tanpa Iklan. Kurasi Brutal. <br/>
          <span className="bg-[#121212] text-white px-1">Undangan Terbatas.</span>
        </p>
        
        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/login" className="neo-btn neo-btn-primary">
                Masuk Member
            </Link>
            <Link href="/register" className="neo-btn neo-btn-secondary">
                Daftar Akun
            </Link>
        </div>
      </section>


      {/* =========================================
          2. THE ARCHIVE (Ecosystem)
         ========================================= */}
      <section className="neo-container w-full mb-24">
        
        {/* Section Header */}
        <div className="flex items-end justify-between border-b-[3px] border-[#121212] pb-4 mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight">Koleksi Arsip</h2>
            <span className="hidden md:inline-block text-[10px] font-mono font-bold opacity-40 uppercase">
                Database v2.0
            </span>
        </div>

        {/* --- A. MASTER HUB CARD (DRACIN) --- */}
        <div className="neo-card bg-white p-0 mb-8">
            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start relative">
                
                {/* Visual Identity */}
                <div className="w-24 h-24 bg-[#FF9A9E] border-[3px] border-[#121212] flex items-center justify-center shadow-[6px_6px_0px_#121212]">
                    <span className="text-5xl">🍿</span>
                </div>

                {/* Content */}
                <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-3">
                         <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                            Dracin Stream
                        </h3>
                        <span className="neo-chip bg-[#FDFFB6]">MASTER HUB</span>
                    </div>
                    
                    <p className="text-sm font-bold opacity-60 max-w-2xl leading-relaxed">
                        Pusat hiburan utama. Akses ribuan drama Asia premium, update harian, player brutal tanpa gangguan iklan.
                        Semua sub-channel terintegrasi di sini.
                    </p>
                </div>

                {/* Status/CTA */}
                <div className="absolute top-0 right-0 p-4 md:p-8">
                    <span className="text-[60px] opacity-5 pointer-events-none">01</span>
                </div>
                
                <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col items-start md:items-end justify-center h-full">
                     <Link href="/login" className="px-6 py-2 bg-white border-[2px] border-[#121212] text-[10px] font-black uppercase hover:bg-[#121212] hover:text-white transition-colors">
                        Login to Open
                     </Link>
                </div>
            </div>
        </div>

        {/* --- B. SUB-CHANNELS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUB_CHANNELS.map((ch) => (
                <div key={ch.id} className="group neo-card bg-white p-6 hover:-translate-y-1 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        {/* Initial Box */}
                        <div className="w-10 h-10 border-[2px] border-[#121212] flex items-center justify-center font-black text-lg bg-white group-hover:bg-[#121212] group-hover:text-white transition-colors">
                            {ch.initial}
                        </div>
                        {/* Status Chip */}
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase border border-[#121212] rounded-sm 
                            ${ch.status === 'ACTIVE' ? 'bg-[#A8E6CF]' : 'bg-[#F3F4F6] opacity-60'}`}>
                            {ch.status}
                        </span>
                    </div>

                    <h4 className="text-xl font-black uppercase mb-1">{ch.name}</h4>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-wide">
                        {ch.desc}
                    </p>
                </div>
            ))}
        </div>
      </section>


      {/* =========================================
          3. UTILITIES & FEATURES
         ========================================= */}
      <section className="neo-container w-full mb-20">
         <div className="flex items-center gap-4 mb-8 opacity-40">
            <div className="h-[2px] w-8 bg-[#121212]"></div>
            <h3 className="text-xs font-black uppercase tracking-widest">Fitur & Utilitas</h3>
            <div className="h-[2px] flex-grow bg-[#121212]"></div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((feat, idx) => (
                <div key={idx} className="border-[2px] border-[#121212] bg-white p-4 flex flex-col items-center text-center hover:bg-[#FDFFB6] transition-colors cursor-default">
                    <span className="text-2xl mb-2 grayscale">{feat.icon}</span>
                    <h5 className="font-black uppercase text-xs">{feat.title}</h5>
                </div>
            ))}
         </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t-[3px] border-[#121212] bg-white">
        <p className="text-[10px] font-mono font-bold opacity-30 uppercase tracking-[0.2em]">
          ButterHub OS v2.0 • Secure Gateway
        </p>
      </footer>

    </main>
  );
}
