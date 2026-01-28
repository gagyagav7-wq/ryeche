import Link from "next/link";

// --- LOGO COMPONENTS (SVG) ---
const LogoFlickReels = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 md:w-10 md:h-10 text-black">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
  </svg>
);

const LogoNetShort = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 md:w-10 md:h-10 text-black">
    <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);

const LogoDramaBox = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 md:w-10 md:h-10 text-black">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="3" />
    <path d="M8 12H16" stroke="currentColor" strokeWidth="3" />
    <path d="M12 8V16" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const LogoReelShort = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 md:w-10 md:h-10 text-black">
    <path d="M2 12H22" stroke="currentColor" strokeWidth="3" />
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="3" />
    <path d="M7 6V18" stroke="currentColor" strokeWidth="2" />
    <path d="M17 6V18" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// --- DATA ---
const SUB_CHANNELS = [
  { 
    id: "flickreels", 
    name: "FlickReels", 
    code: "SHORT MOVIE", 
    status: "ACTIVE", 
    bg: "bg-[#FFFFFF]",
    logo: <LogoFlickReels />
  },
  { 
    id: "netshort", 
    name: "NetShort", 
    code: "V-SERIES HD", 
    status: "ACTIVE", 
    bg: "bg-[#FFFFFF]",
    logo: <LogoNetShort />
  },
  { 
    id: "dramabox", 
    name: "DramaBox", 
    code: "DAILY PICKS", 
    status: "LOCKED", 
    bg: "bg-[#F3F0E7]",
    logo: <LogoDramaBox />
  },
  { 
    id: "reelshort", 
    name: "ReelShort", 
    code: "SNACK DRAMA", 
    status: "LOCKED", 
    bg: "bg-[#F3F0E7]",
    logo: <LogoReelShort />
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col font-sans overflow-x-hidden">
      
      {/* =========================================
          1. HERO: POSTER STYLE
         ========================================= */}
      <section className="pt-32 pb-16 px-6 md:px-12 flex flex-col items-center text-center relative border-b-[3px] border-black bg-[#F3F0E7]">
        
        {/* Floating Sticker */}
        <div className="absolute top-10 right-10 md:right-32 rotate-12 hidden md:block">
           <div className="bg-[#FF90E8] border-[3px] border-black px-4 py-2 font-black text-xs shadow-[4px_4px_0px_#000]">
              MEMBERS ONLY
           </div>
        </div>

        {/* --- JUDUL DIPERBAIKI (HUB JADI OUTLINE) --- */}
        <h1 className="text-[12vw] md:text-[8rem] font-black leading-[0.8] tracking-tighter mb-6">
          <span className="text-black">BUTTER</span>
          {/* Pakai WebkitTextStroke biar outline-nya garansi muncul */}
          <span className="text-transparent" style={{ WebkitTextStroke: '3px black' }}>HUB</span>
        </h1>

        <p className="max-w-md mx-auto font-bold text-sm md:text-base uppercase tracking-widest opacity-60 mb-10">
          The Underground Streaming Archive.<br/>
          No Ads. Pure Cinema. Raw Aesthetics.
        </p>

        <div className="flex gap-4">
           <Link href="/login" className="btn-brutal">
             Enter Archive
           </Link>
           <Link href="/register" className="px-6 py-3 font-bold uppercase text-xs border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all">
             Register
           </Link>
        </div>
      </section>

      {/* MARQUEE STRIP (Running Text) */}
      <div className="border-b-[3px] border-black bg-[#E5FD76] overflow-hidden py-3 flex">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
            {[...Array(10)].map((_, i) => (
                <span key={i} className="text-xl font-black uppercase italic tracking-tighter">
                    /// PRIVATE ACCESS ONLY /// STREAMING UNLIMITED /// DRACIN MASTER HUB ///
                </span>
            ))}
        </div>
      </div>

      {/* =========================================
          2. THE BENTO GRID ARCHIVE
         ========================================= */}
      <section className="px-6 md:px-12 py-20 bg-[#FFFFFF]">
        
        {/* Header Aesthetic */}
        <div className="flex justify-between items-end mb-10 border-b-[3px] border-black pb-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none">
                Collection<br/>Index_01
            </h2>
            <div className="text-right hidden md:block">
                <p className="font-mono text-xs font-bold">COORDS: 00.12.94</p>
                <p className="font-mono text-xs font-bold">STATUS: ONLINE</p>
            </div>
        </div>

        {/* --- BENTO LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 h-auto">

            {/* A. MASTER CARD (BLACK INVERTED) - Takes 7/12 columns */}
            <div className="md:col-span-7 bento-card bg-[#0F0F0F] text-[#F3F0E7] p-8 md:p-12 flex flex-col justify-between min-h-[400px] group">
                
                <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-[#E5FD76] border-[3px] border-[#F3F0E7] flex items-center justify-center text-3xl shadow-[4px_4px_0px_#F3F0E7]">
                        🍿
                    </div>
                    <span className="border border-[#F3F0E7] px-2 py-1 text-[10px] font-mono uppercase">Master Hub</span>
                </div>

                <div className="mt-12">
                    <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 group-hover:text-[#E5FD76] transition-colors">
                        Dracin<br/>Stream
                    </h3>
                    <p className="font-mono text-xs md:text-sm opacity-60 max-w-md border-l-2 border-[#E5FD76] pl-4">
                        Primary Database. Access Asian Drama library, daily updates, brutal player. 
                        Includes all sub-channels.
                    </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#333] pt-4">
                     <span className="text-[10px] font-black uppercase opacity-50">ACCESS REQUIRED</span>
                     <Link href="/login" className="text-[#E5FD76] font-black uppercase text-xl hover:underline decoration-4 underline-offset-4">
                        OPEN &rarr;
                     </Link>
                </div>
            </div>

            {/* B. SUB-CHANNELS GRID (LOGOS ADDED) - Takes 5/12 columns */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
                {SUB_CHANNELS.map((ch) => (
                    <div key={ch.id} className={`bento-card ${ch.bg} p-4 flex flex-col justify-between aspect-square group`}>
                        <div className="flex justify-between items-start">
                            {/* LOGO RENDERED HERE */}
                            <div className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                {ch.logo}
                            </div>
                            
                            <span className={`text-[8px] font-bold border border-black px-1 h-fit ${ch.status === 'ACTIVE' ? 'bg-[#E5FD76]' : 'bg-gray-200'}`}>
                                {ch.status}
                            </span>
                        </div>

                        <div>
                            <h4 className="font-black uppercase text-lg leading-none mb-1 group-hover:underline decoration-2">{ch.name}</h4>
                            <p className="text-[9px] font-mono font-bold opacity-50">{ch.code}</p>
                        </div>
                    </div>
                ))}
                
                {/* Visual Filler (Aesthetic Box) */}
                <div className="bento-card bg-[#FF90E8] p-4 flex items-center justify-center">
                    <p className="font-black text-center text-xs uppercase leading-tight">
                        More<br/>Coming<br/>Soon
                    </p>
                </div>
                
                 {/* Visual Filler (Stripe) */}
                 <div className="bento-card bg-black p-4 flex items-center justify-center overflow-hidden relative">
                     <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <h1 className="text-6xl text-white font-black -rotate-45">???</h1>
                     </div>
                </div>

            </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#F3F0E7] border-t-[3px] border-black text-center">
        <h2 className="text-[15vw] leading-none font-black text-black opacity-5 select-none pointer-events-none">
            BUTTER
        </h2>
        <p className="font-mono text-xs font-bold mt-[-4vw]">SYSTEM VER 2.0 • SECURE</p>
      </footer>
    </main>
  );
}
