import Link from "next/link";

// --- ICONS & LOGOS (Brand Style) ---
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M8 5v14l11-7z"/></svg>;
const IconBolt = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

// Logo FlickReels (Roll Film Circle)
const LogoFlickReels = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="4 4" />
  </svg>
);

// Logo NetShort (Vertical Screen + Bolt)
const LogoNetShort = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7">
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <path d="M10 10l4 4" />
    <path d="M14 10l-4 4" />
  </svg>
);

// Logo DramaBox (Box with Play)
const LogoDramaBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none"/>
  </svg>
);

// Logo ReelShort (Film Strip S)
const LogoReelShort = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7">
    <path d="M16 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
    <path d="M6 7h12" />
    <path d="M6 12h12" />
    <path d="M6 17h12" />
  </svg>
);

// --- DATA: ARSIP HIBURAN ---
const SUB_CHANNELS = [
  { id: "flickreels", name: "FlickReels", tag: "SHORT MOVIE", status: "ACTIVE", icon: <LogoFlickReels />, link: "/login" },
  { id: "netshort", name: "NetShort", tag: "VERTICAL HD", status: "ACTIVE", icon: <LogoNetShort />, link: "/login" },
  { id: "dramabox", name: "DramaBox", tag: "CURATED", status: "LOCKED", icon: <LogoDramaBox />, link: "/login" },
  { id: "reelshort", name: "ReelShort", tag: "SNACKS", status: "LOCKED", icon: <LogoReelShort />, link: "/login" },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col font-sans overflow-x-hidden selection:bg-[#FF9F1C] selection:text-white">
      
      {/* =========================================
          1. HERO: TROPICAL BREEZE
         ========================================= */}
      <section className="pt-32 pb-24 md:pt-44 md:pb-32 neo-container flex flex-col items-center text-center relative z-10">
        
        {/* Decorative Sun (CSS Only) */}
        <div className="absolute top-10 md:top-20 w-40 h-40 bg-[#FF9F1C] rounded-full blur-[80px] opacity-30 -z-10"></div>

        {/* Badge: Hibiscus Pink */}
        <div className="bg-[#FF99C8] border-[3px] border-[#0F172A] px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_#0F172A] mb-8 transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
           Free Access
        </div>

        {/* Title: Stacked & Bold */}
        <div className="flex flex-col items-center leading-[0.85] mb-8">
           <h1 className="text-[16vw] md:text-[9rem] font-black text-[#0F172A] tracking-tighter">
             BUTTER
           </h1>
           {/* FIX HUB VISIBILITY: Text Putih + Stroke Hitam */}
           <h1 className="text-[16vw] md:text-[9rem] font-black text-white tracking-tighter relative"
               style={{ WebkitTextStroke: '3px #0F172A' }}>
             HUB
             {/* Little tropical accent */}
             <span className="absolute -top-4 -right-4 w-6 h-6 md:w-10 md:h-10 bg-[#CBEF43] rounded-full border-[3px] border-[#0F172A]"></span>
           </h1>
        </div>

        <p className="max-w-md mx-auto font-bold text-sm md:text-base opacity-70 mb-10 leading-relaxed text-[#0F172A]">
          Your Premium Island of Entertainment.<br/>
          No Ads. No Distractions. Just Chill.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
           <Link href="/login" className="btn-mango">
             Login
           </Link>
           <Link href="/register" className="btn-outline">
             Register
           </Link>
        </div>
      </section>

      {/* =========================================
          2. KOLEKSI ARSIP (ENTERTAINMENT)
         ========================================= */}
      <section className="neo-container pb-20">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10">
             <div className="w-10 h-10 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-full flex items-center justify-center font-black text-lg">A</div>
             <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Archives</h2>
             <div className="h-[3px] flex-grow bg-[#E7E5D8] rounded-full"></div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

            {/* --- MASTER CARD (DRACIN) --- */}
            <div className="trop-card lg:col-span-2 p-8 md:p-10 flex flex-col md:flex-row items-start gap-8 bg-white group">
                
                {/* Visual Identity: Sunset Yellow */}
                <div className="shrink-0 w-24 h-24 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_#0F172A] group-hover:rotate-6 transition-transform">
                    <span className="text-white"><IconPlay /></span>
                </div>

                <div className="flex flex-col h-full justify-between w-full">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0F172A]">
                                Dracin
                            </h3>
                            <span className="bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Master Hub</span>
                        </div>
                        <p className="font-medium text-sm opacity-60 leading-relaxed max-w-lg">
                            The main resort. Premium Asian Drama library, daily fresh drops, brutal player. Relax and watch.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t-[2px] border-dashed border-[#E7E5D8] flex justify-between items-center w-full">
                        <span className="text-xs font-bold opacity-40 uppercase">Status: Sunny ☀️</span>
                        <Link href="/dracin" className="font-black text-sm uppercase border-b-2 border-[#0F172A] hover:text-[#FF9F1C] hover:border-[#FF9F1C] transition-colors">
                            Buka Hub &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- SUB-CHANNELS LOOP --- */}
            {SUB_CHANNELS.map((ch) => (
                <Link href={ch.link} key={ch.id} className="trop-card p-6 flex flex-col justify-between min-h-[200px] group bg-white hover:bg-[#FFFDF7]">
                    
                    <div className="flex justify-between items-start">
                        <div className="text-[#0F172A] opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all">
                            {/* NEW BRAND ICONS */}
                            {ch.icon}
                        </div>
                        {ch.status === 'LOCKED' ? (
                            <span className="text-gray-300"><IconLock /></span>
                        ) : (
                             <span className="w-3 h-3 bg-[#CBEF43] border-[2px] border-[#0F172A] rounded-full"></span>
                        )}
                    </div>

                    <div>
                        <h4 className="text-2xl font-black uppercase mb-1 text-[#0F172A]">{ch.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                             <span className="text-[10px] font-bold border border-[#0F172A] px-1.5 py-0.5 rounded-md uppercase bg-[#E7E5D8]/30">
                                {ch.tag}
                             </span>
                             <span className="text-[10px] font-black uppercase text-[#0F172A]">
                                {ch.status === 'ACTIVE' ? 'OPEN' : 'LOCKED'}
                             </span>
                        </div>
                    </div>
                </Link>
            ))}

        </div>
      </section>

      {/* =========================================
          3. TROPICAL TOOLS (UTILITY SECTION)
         ========================================= */}
      <section className="neo-container pb-24">
         
         {/* Section Header */}
         <div className="flex items-center gap-4 mb-10">
             <div className="w-10 h-10 bg-[#2EC4B6] border-[3px] border-[#0F172A] rounded-full flex items-center justify-center font-black text-lg text-white">T</div>
             <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Tools</h2>
             <div className="h-[3px] flex-grow bg-[#E7E5D8] rounded-full"></div>
        </div>

        {/* THE DOWNLOADER ISLAND */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LINK KE /downloader SEKARANG BEBAS AKSES */}
            <Link href="/downloader" className="trop-card p-8 bg-[#2EC4B6] flex flex-col md:flex-row items-center gap-8 group hover:bg-[#25B0A2] transition-colors col-span-1 md:col-span-2">
                
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-white border-[3px] border-[#0F172A] rounded-full flex items-center justify-center shadow-[4px_4px_0px_#0F172A] shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-[#0F172A]"><IconBolt /></span>
                </div>

                <div className="text-center md:text-left flex-grow">
                    <h3 className="text-3xl md:text-4xl font-black uppercase text-white drop-shadow-md mb-2">
                        Universal Downloader
                    </h3>
                    <p className="text-white font-bold opacity-90 text-sm md:text-base">
                        Simpan video favoritmu dari TikTok, Instagram, & YouTube. Tanpa Watermark. Cepat. Gratis.
                    </p>
                </div>

                <div className="shrink-0">
                    <span className="inline-block bg-white border-[3px] border-[#0F172A] px-6 py-3 rounded-full font-black uppercase text-xs shadow-[4px_4px_0px_#0F172A] group-hover:translate-x-1 transition-transform">
                        Launch Tool &rarr;
                    </span>
                </div>
            </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center border-t-[3px] border-[#0F172A] bg-white mt-auto">
        <h2 className="text-[15vw] leading-none font-black text-[#0F172A] opacity-5 select-none pointer-events-none">
            BUTTER
        </h2>
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-40 mt-[-4vw]">
            ButterHub OS v2.0 • Tropical Secure Gateway
        </p>
      </footer>
    </main>
  );
}
