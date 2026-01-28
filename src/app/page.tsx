import Link from "next/link";

// --- DATA SOURCE (SUDAH DIPERBAIKI: ADA INITIAL) ---
const SUB_CHANNELS = [
  { 
    id: "flickreels", 
    name: "FlickReels", 
    desc: "Short cinematic universe.", 
    status: "ACTIVE", 
    code: "F-01",
    initial: "F" // <-- INI YANG TADI KURANG
  },
  { 
    id: "netshort", 
    name: "NetShort", 
    desc: "Vertical series HD.", 
    status: "ACTIVE", 
    code: "N-01",
    initial: "N"
  },
  { 
    id: "dramabox", 
    name: "DramaBox", 
    desc: "Daily curated picks.", 
    status: "LOCKED", 
    code: "D-01",
    initial: "D"
  },
  { 
    id: "reelshort", 
    name: "ReelShort", 
    desc: "Snack-sized drama.", 
    status: "LOCKED", 
    code: "R-01",
    initial: "R"
  },
  { 
    id: "melolo", 
    name: "Melolo", 
    desc: "Asian variety shows.", 
    status: "SOON", 
    code: "M-01",
    initial: "M"
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col relative overflow-x-hidden font-sans pb-24">
      
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
          SECTION: KOLEKSI ARSIP (CATALOG INDEX)
         ========================================= */}
      <section className="neo-container w-full my-24">
        
        {/* 1. SECTION HEADER: Clean & Technical */}
        <div className="flex items-end justify-between border-b-[3px] border-[#121212] pb-6 mb-12">
            <div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                    Koleksi Arsip
                </h2>
                <div className="flex items-center gap-3 mt-2">
                    <span className="w-2 h-2 bg-[#FF9A9E] border border-black rounded-full animate-pulse"></span>
                    <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
                        Ecosphere Content & Platform
                    </p>
                </div>
            </div>
            <div className="hidden md:block">
                <span className="inline-block px-3 py-1 border border-black bg-white font-mono text-[10px] font-bold">
                    INDEX_V2.0
                </span>
            </div>
        </div>

        {/* 2. THE CATALOG LAYOUT */}
        <div className="flex flex-col gap-8">

            {/* A. MASTER HUB (DRACIN) - Full Width Panel */}
            <div className="archive-card p-0 group">
                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start relative bg-white z-10">
                    
                    {/* Floating Label */}
                    <div className="absolute top-0 right-0 bg-[#FDFFB6] px-4 py-2 border-b-[3px] border-l-[3px] border-[#121212] text-[10px] font-black uppercase tracking-widest">
                        Master Hub
                    </div>

                    {/* Identity Icon */}
                    <div className="shrink-0 w-24 h-24 bg-[#FF9A9E] border-[3px] border-[#121212] flex items-center justify-center shadow-[6px_6px_0px_#121212] group-hover:rotate-3 transition-transform">
                        <span className="text-5xl">🍿</span>
                    </div>

                    {/* Info Content */}
                    <div className="flex-grow space-y-4 pt-2">
                        <div className="space-y-1">
                             <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none decoration-4 underline-offset-4 decoration-[#FF9A9E] group-hover:underline">
                                Dracin Stream
                            </h3>
                            <p className="font-mono text-[10px] text-[#121212] opacity-40">ID: MASTER_HUB_01 • STATUS: ONLINE</p>
                        </div>
                        
                        <p className="text-sm font-bold opacity-60 max-w-2xl leading-relaxed">
                            Pusat hiburan utama. Akses ribuan drama Asia premium, update harian, player brutal tanpa gangguan iklan. 
                            Semua sub-channel di bawah ini terintegrasi di dalam Dracin.
                        </p>
                    </div>

                    {/* Action Area */}
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end justify-center h-full gap-2 mt-4 md:mt-0">
                         {/* Kita gunakan Link ke Login jika guest (Logic existing) */}
                         <Link href="/login" className="neo-action-btn w-full md:w-auto">
                            Login Member &rarr;
                         </Link>
                         <span className="text-[9px] font-bold opacity-30 uppercase">Access Required</span>
                    </div>
                </div>

                {/* Decorative Connector (Visual Hierarchy) */}
                <div className="bg-[#F6F1E8] border-t-[3px] border-[#121212] px-8 py-3 flex items-center gap-3">
                    <span className="text-[14px]">↳</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Connected Sub-Channels</span>
                    <div className="h-[2px] flex-grow bg-[#121212] opacity-10 border-t border-dashed border-black"></div>
                </div>
            </div>

            {/* B. SUB-CHANNELS (INDEX GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-0 md:pl-8 border-l-[3px] border-dashed border-[#121212]/20">
                {SUB_CHANNELS.map((ch) => (
                    <div key={ch.id} className="group archive-card p-5 bg-white hover:bg-[#FDFFB6]/20 transition-colors">
                        
                        {/* Header: Code & Status */}
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-mono text-[10px] font-bold border border-black px-1.5 bg-[#121212] text-white">
                                {ch.code}
                            </span>
                            
                            <div className="status-badge">
                                <span className={`w-1.5 h-1.5 rounded-full border border-black ${
                                    ch.status === 'ACTIVE' ? 'bg-[#A8E6CF]' : 
                                    ch.status === 'SOON' ? 'bg-[#FDFFB6]' : 'bg-[#E5E5E5]'
                                }`}></span>
                                {ch.status}
                            </div>
                        </div>

                        {/* Title & Desc */}
                        <div className="mb-6">
                            <h4 className="text-xl font-black uppercase mb-1 leading-none group-hover:translate-x-1 transition-transform">
                                {ch.name}
                            </h4>
                            <p className="text-[10px] font-bold opacity-50 uppercase tracking-wide">
                                {ch.desc}
                            </p>
                        </div>

                        {/* Minimal Footer */}
                        <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-[#121212]/10">
                            {/* Initials Visual (SEKARANG SUDAH AMAN KARENA ADA PROPERTY INITIAL) */}
                            <div className="w-6 h-6 border-2 border-[#121212] rounded-full flex items-center justify-center text-[10px] font-black bg-white">
                                {ch.initial}
                            </div>
                            
                            {/* Link/Button */}
                            {ch.status === 'ACTIVE' ? (
                                <Link href={`/login`} className="text-[10px] font-black uppercase hover:underline">
                                    OPEN &rarr;
                                </Link>
                            ) : (
                                <span className="text-[9px] font-bold opacity-30 cursor-not-allowed uppercase">
                                    {ch.status === 'SOON' ? 'Waitlist' : 'Locked 🔒'}
                                </span>
                            )}
                        </div>

                    </div>
                ))}
            </div>

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
