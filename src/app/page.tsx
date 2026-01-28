import Link from "next/link";

// --- COMPONENTS ---
// Logo SVG Sederhana (Re-use yang tadi)
const IconFilm = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><circle cx="12" cy="12" r="9"/><path d="M10 8L16 12L10 16V8Z" fill="currentColor"/></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M11 17H13"/></svg>;
const IconBox = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconSnack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>;
const IconBolt = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

// DATA (Status & Links)
const SUB_CHANNELS = [
  { id: "flickreels", name: "FlickReels", code: "SHORT-MV", status: "ACTIVE", icon: <IconFilm />, link: "/login" },
  { id: "netshort", name: "NetShort", code: "V-SERIES", status: "ACTIVE", icon: <IconPhone />, link: "/login" },
  { id: "dramabox", name: "DramaBox", code: "CURATED", status: "LOCKED", icon: <IconBox />, link: "/login" },
  { id: "reelshort", name: "ReelShort", code: "SNACK", status: "LOCKED", icon: <IconSnack />, link: "/login" },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col font-sans overflow-x-hidden selection:bg-[#CCFF00] selection:text-black">
      
      {/* =========================================
          1. HERO: Clean & Scalable
         ========================================= */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 neo-container flex flex-col items-center text-center relative border-b-[3px] border-black bg-[#F4F1EA]">
        
        {/* Badge: Satu-satunya elemen PINK (Signature Accent) */}
        <div className="absolute top-6 right-6 md:top-12 md:right-12 rotate-6">
           <div className="bg-[#FF90E8] border-[3px] border-black px-3 py-1.5 font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:rotate-0 transition-transform cursor-default">
              Private Access
           </div>
        </div>

        {/* Scalable Typography using Clamp */}
        <h1 className="font-black leading-[0.85] tracking-tighter mb-8" style={{ fontSize: 'clamp(3.5rem, 12vw, 9rem)' }}>
          <span className="block text-black">BUTTER</span>
          {/* Fallback color for text-stroke compat */}
          <span className="block text-transparent relative" style={{ WebkitTextStroke: '3px black' }}>
             HUB
          </span>
        </h1>

        <p className="max-w-[40ch] mx-auto font-bold text-sm md:text-base uppercase tracking-widest opacity-60 mb-10 leading-relaxed">
          The Underground Streaming Archive. No Ads. Pure Cinema. Raw Aesthetics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
           <Link href="/login" className="btn-primary w-full sm:w-auto">
             Enter Archive
           </Link>
           <Link href="/register" className="btn-secondary w-full sm:w-auto">
             Request Access
           </Link>
        </div>
      </section>

      {/* MARQUEE: Controlled & Accessible */}
      <div className="border-b-[3px] border-black bg-[#CCFF00] overflow-hidden py-3 flex relative z-10">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
            {[...Array(6)].map((_, i) => (
                <span key={i} className="text-lg md:text-xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                    <span>/// STREAMING UNLIMITED</span>
                    <span className="not-italic text-sm">✦</span>
                    <span>DRACIN MASTER HUB</span>
                    <span className="not-italic text-sm">✦</span>
                    <span>NO ADS FOREVER</span>
                </span>
            ))}
        </div>
      </div>

      {/* =========================================
          2. THE ARCHIVE GRID (BENTO V2)
         ========================================= */}
      <section className="neo-container py-20">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 pb-4 border-b-[3px] border-black">
            <div>
                <h2 className="text-4xl md:text-5xl font-black uppercase leading-none">
                    System<br/>Index
                </h2>
            </div>
            <div className="text-right hidden md:block">
                <span className="inline-block px-2 py-1 border border-black text-[10px] font-mono font-bold uppercase bg-white">
                   Grid_Layout_V2
                </span>
            </div>
        </div>

        {/* --- GRID LAYOUT (12 Columns) --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-fr">

            {/* A. MASTER CARD (DRACIN) - Dominant */}
            <div className="md:col-span-7 lg:col-span-8 bento-card bento-card-interactive bg-[#050505] text-[#F4F1EA] p-8 md:p-12 flex flex-col justify-between group min-h-[400px]">
                
                <div className="flex justify-between items-start">
                    {/* Icon Box */}
                    <div className="w-14 h-14 bg-[#CCFF00] border-[3px] border-[#F4F1EA] flex items-center justify-center text-2xl shadow-[4px_4px_0px_#F4F1EA]">
                        🍿
                    </div>
                    {/* Tag */}
                    <div className="flex flex-col items-end">
                        <span className="text-[#CCFF00] text-[10px] font-black uppercase tracking-widest mb-1">Status: Online</span>
                        <div className="h-1.5 w-1.5 bg-[#CCFF00] rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="mt-8 md:mt-0">
                    <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 group-hover:text-[#CCFF00] transition-colors">
                        Dracin<br/>Stream
                    </h3>
                    <p className="font-mono text-xs md:text-sm opacity-60 max-w-md border-l-2 border-[#CCFF00] pl-4 leading-relaxed">
                        Database drama Asia terbesar. Update harian, player anti-lemot, tanpa iklan. 
                        Akses ke semua sub-channel di bawah ini.
                    </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                     <Link href="/login" className="px-6 py-3 border-[2px] border-[#F4F1EA] text-[#F4F1EA] font-black uppercase text-sm hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-colors w-full md:w-auto text-center">
                        Launch Hub &rarr;
                     </Link>
                </div>
            </div>

            {/* B. SUB-CHANNELS & UTILITY - Side Grid */}
            <div className="md:col-span-5 lg:col-span-4 grid grid-cols-2 gap-4 h-full">
                
                {/* 1. Sub-Channels Loop */}
                {SUB_CHANNELS.map((ch) => (
                    <Link href={ch.link} key={ch.id} className="bento-card bento-card-interactive p-4 flex flex-col justify-between min-h-[140px] group bg-white hover:bg-[#FAFAFA]">
                        <div className="flex justify-between items-start">
                            <div className="opacity-80 group-hover:scale-110 transition-transform text-black">
                                {ch.icon}
                            </div>
                            {/* Status Dot */}
                            <div className={`w-2 h-2 border border-black rounded-full ${ch.status === 'ACTIVE' ? 'bg-[#CCFF00]' : 'bg-gray-300'}`}></div>
                        </div>

                        <div>
                            <h4 className="font-black uppercase text-base leading-none mb-1 group-hover:underline decoration-2 underline-offset-2">
                                {ch.name}
                            </h4>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[9px] font-mono font-bold opacity-50">{ch.code}</span>
                                <span className="text-[9px] font-black uppercase">
                                    {ch.status === 'ACTIVE' ? 'OPEN ↗' : 'LOCKED 🔒'}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* 2. FUNCTIONAL CARD: DOWNLOADER (Tools) */}
                <Link href="/downloader" className="bento-card bento-card-interactive p-4 bg-[#CCFF00] flex flex-col justify-between col-span-1 min-h-[140px] group">
                    <div className="flex justify-between items-start">
                        <IconBolt />
                        <span className="text-[9px] font-black uppercase border border-black px-1 bg-white">TOOL</span>
                    </div>
                    <div>
                        <h4 className="font-black uppercase text-base leading-none mb-1">Downloader</h4>
                        <p className="text-[9px] font-mono font-bold opacity-70">TIKTOK/IG/YT</p>
                    </div>
                </Link>

                {/* 3. INFORMATIVE CARD: SERVER STATUS */}
                <div className="bento-card p-4 bg-black text-white flex flex-col justify-between col-span-1 min-h-[140px]">
                    <div className="flex justify-between items-start">
                         <span className="text-[9px] font-mono font-bold opacity-60">SYS_STAT</span>
                         <span className="text-xs">🟢</span>
                    </div>
                    <div>
                        <p className="font-black uppercase text-sm leading-tight mb-1">
                            All Systems<br/>Normal
                        </p>
                        <p className="text-[9px] font-mono opacity-50">PING: 24ms</p>
                    </div>
                </div>

            </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#F4F1EA] border-t-[3px] border-black text-center mt-auto">
        <h2 className="text-[15vw] leading-none font-black text-black opacity-5 select-none pointer-events-none">
            BUTTER
        </h2>
        <p className="font-mono text-[10px] font-bold mt-[-4vw] uppercase tracking-widest opacity-40">
            ButterHub OS v2.0 • Secure Gateway
        </p>
      </footer>
    </main>
  );
}
