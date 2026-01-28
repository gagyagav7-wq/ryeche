import Link from "next/link";

// --- ICONS (SVG Clean) ---
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M8 5v14l11-7z"/></svg>;
const IconFilm = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const IconMobile = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
const IconBox = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

// --- DATA ---
const SUB_CHANNELS = [
  { id: "flickreels", name: "FlickReels", tag: "SHORT FILM", status: "ACTIVE", icon: <IconFilm />, link: "/login" },
  { id: "netshort", name: "NetShort", tag: "VERTICAL HD", status: "ACTIVE", icon: <IconMobile />, link: "/login" },
  { id: "dramabox", name: "DramaBox", tag: "CURATED", status: "LOCKED", icon: <IconBox />, link: "/login" },
  { id: "reelshort", name: "ReelShort", tag: "SNACKS", status: "LOCKED", icon: <IconFilm />, link: "/login" },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col font-sans overflow-x-hidden selection:bg-[#FFD23F] selection:text-black">
      
      {/* =========================================
          1. HERO: CLEAN STACKED
         ========================================= */}
      <section className="pt-28 pb-20 md:pt-40 md:pb-32 neo-container flex flex-col items-center text-center relative">
        
        {/* Badge Floating */}
        <div className="bg-[#FF9A9E] border-[3px] border-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_#000] mb-8 animate-bounce">
           Private Access Only
        </div>

        {/* Title: Safe & Bold */}
        <div className="flex flex-col items-center leading-[0.9] mb-8">
           <h1 className="text-[15vw] md:text-[8rem] font-black text-[#18181B] tracking-tighter">
             BUTTER
           </h1>
           {/* TEXT STROKE MANUAL (High Contrast) */}
           <h1 className="text-[15vw] md:text-[8rem] font-black text-transparent tracking-tighter"
               style={{ 
                 WebkitTextStroke: '3px #18181B',
                 textShadow: '6px 6px 0px rgba(0,0,0,0.05)'
               }}>
             HUB
           </h1>
        </div>

        <p className="max-w-md mx-auto font-bold text-sm md:text-base opacity-60 mb-10 leading-relaxed">
          The Premium Streaming Archive.<br/>
          No Ads. No Buffering. Just Cinema.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
           <Link href="/login" className="btn-main">
             Masuk Member
           </Link>
           <Link href="/register" className="btn-ghost">
             Daftar Akun
           </Link>
        </div>
      </section>


      {/* =========================================
          2. THE ARCHIVE DECK (Grid System)
         ========================================= */}
      <section className="neo-container pb-24">
        
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-10 opacity-50">
            <div className="h-[3px] w-8 bg-black rounded-full"></div>
            <h2 className="text-xs font-black uppercase tracking-widest">Koleksi Arsip</h2>
            <div className="h-[3px] flex-grow bg-black rounded-full opacity-20"></div>
        </div>

        {/* GRID LAYOUT: 1 Col Mobile -> 2 Col Tablet -> 3 Col Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

            {/* --- MASTER CARD (DRACIN) --- 
                Spans 2 columns on Desktop for Emphasis */}
            <div className="deck-card lg:col-span-2 p-8 md:p-10 flex flex-col md:flex-row items-start gap-8 bg-white group">
                
                {/* Visual Identity */}
                <div className="shrink-0 w-24 h-24 bg-[#FFD23F] border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_#18181B] group-hover:rotate-6 transition-transform">
                    <span className="text-black"><IconPlay /></span>
                </div>

                <div className="flex flex-col h-full justify-between w-full">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                                Dracin
                            </h3>
                            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Master Hub</span>
                        </div>
                        <p className="font-medium text-sm opacity-60 leading-relaxed max-w-lg">
                            Rumah utama hiburan Asia. Koleksi drama premium, update harian, player brutal tanpa gangguan iklan.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t-[2px] border-dashed border-gray-200 flex justify-between items-center w-full">
                        <span className="text-xs font-bold opacity-40 uppercase">Status: Online</span>
                        <Link href="/login" className="font-black text-sm uppercase border-b-2 border-black hover:bg-[#FFD23F] transition-colors">
                            Buka Hub &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- UTILITY CARD: DOWNLOADER --- */}
            <Link href="/downloader" className="deck-card p-6 bg-[#FF9A9E] flex flex-col justify-between group h-full min-h-[220px]">
                <div className="flex justify-between items-start">
                    <div className="bg-white border-[3px] border-black p-2 rounded-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <span className="bg-black text-white px-2 py-1 rounded-md text-[9px] font-bold uppercase">TOOL</span>
                </div>
                <div>
                    <h4 className="text-3xl font-black uppercase leading-none mb-2 text-white text-shadow-sm">Downloader</h4>
                    <p className="text-xs font-bold text-white opacity-90">TikTok • Instagram • YouTube</p>
                </div>
            </Link>

            {/* --- SUB-CHANNELS LOOP --- */}
            {SUB_CHANNELS.map((ch) => (
                <Link href={ch.link} key={ch.id} className="deck-card p-6 flex flex-col justify-between min-h-[200px] group bg-white hover:bg-[#FAFAFA]">
                    
                    <div className="flex justify-between items-start">
                        <div className="text-black opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all">
                            {ch.icon}
                        </div>
                        {ch.status === 'LOCKED' ? (
                            <span className="text-gray-400"><IconLock /></span>
                        ) : (
                             <span className="w-3 h-3 bg-[#96E6B3] border-[2px] border-black rounded-full"></span>
                        )}
                    </div>

                    <div>
                        <h4 className="text-2xl font-black uppercase mb-1">{ch.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                             <span className="text-[10px] font-bold border border-black px-1.5 py-0.5 rounded-md uppercase bg-gray-50">
                                {ch.tag}
                             </span>
                             <span className="text-[10px] font-black uppercase">
                                {ch.status === 'ACTIVE' ? 'OPEN' : 'LOCKED'}
                             </span>
                        </div>
                    </div>
                </Link>
            ))}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center border-t-[3px] border-black bg-white mt-auto">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-40">
            ButterHub OS v2.0 • Secure Gateway
        </p>
      </footer>
    </main>
  );
}
