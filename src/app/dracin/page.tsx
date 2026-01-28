import Image from "next/image";
import Link from "next/link";
import { getLatest, getForYou, getHotRank } from "@/lib/api";
import SearchBar from "@/components/SearchBar";

export const revalidate = 60;

// --- CONSTANTS & HELPERS ---

// Fallback SVG jika cover_url kosong (Anti-Broken Image)
const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">
    <rect width="100%" height="100%" fill="#e5e5e5"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial" font-size="32" font-weight="800" fill="#171717">
      BUTTERHUB
    </text>
  </svg>`);

// --- COMPONENTS ---

const RankingBadge = ({ rank }: { rank: number }) => {
  let bgClass = "bg-white"; 
  if (rank === 1) bgClass = "bg-[#FDFFB6]"; 
  else if (rank === 2) bgClass = "bg-[#E0E0E0]"; 
  else if (rank === 3) bgClass = "bg-[#FFCCB6]"; 

  return (
    <div className={`absolute top-0 left-0 ${bgClass} border-b-[3px] border-r-[3px] border-[#171717] px-3 py-1 z-20 shadow-sm`}>
      <span className="font-black text-sm text-[#171717]">#{rank}</span>
    </div>
  );
};

const DramaGrid = ({ 
  id, 
  title, 
  subtitle, 
  items, 
  viewAllLink,
  isRanking = false 
}: { 
  id: string,
  title: string, 
  subtitle: string, 
  items: any[], 
  viewAllLink: string, 
  isRanking?: boolean 
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section id={id} className="space-y-6 scroll-mt-24 relative z-10">
      {/* Header Section: View All muncul di mobile & desktop */}
      <div className="flex justify-between items-end border-b-[3px] border-[#171717] pb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-2 bg-[#FDFFB6] border-[3px] border-[#171717]"></div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none tracking-tight">{title}</h2>
            <p className="text-[10px] md:text-sm font-bold opacity-60 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>
        
        {/* Tombol View All: Styling Neo-Brutal & Responsive */}
        <Link 
          href={viewAllLink}
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase bg-black text-white px-3 py-2 border-[3px] border-[#171717] shadow-[4px_4px_0px_#171717] transition-all active:translate-y-1 active:shadow-none md:hover:bg-[#FDFFB6] md:hover:text-[#171717]"
        >
          VIEW ALL →
        </Link>
      </div>
      
      {safeItems.length === 0 ? (
        <p className="font-bold opacity-50 py-10">Data belum tersedia, Commander.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {safeItems.slice(0, 10).map((d, index) => {
            const rank = index + 1;
            const epNum = Number(d.total_ep);
            const episodeText = Number.isFinite(epNum) && epNum > 0 ? `${epNum} EPS` : "ONGOING";

            return (
              <Link 
                key={d.id} 
                href={`/dracin/${d.id}`} 
                className="group block h-full outline-none focus-visible:ring-4 focus-visible:ring-[#FDFFB6] relative"
              >
                <div className="h-full relative overflow-hidden bg-white border-[3px] border-[#171717] shadow-[6px_6px_0px_#171717] transition-all duration-300 md:group-hover:-translate-y-1 md:group-hover:shadow-[8px_8px_0px_#171717]">
                  {isRanking && rank <= 3 && <RankingBadge rank={rank} />}
                  
                  <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden border-b-[3px] border-[#171717]">
                    <Image 
                      src={d.cover_url || FALLBACK} // Menggunakan SVG Fallback
                      alt={d.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover transition-transform duration-500 md:group-hover:scale-105"
                      unoptimized={true} 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                  </div>

                  <div className="bg-white p-3 h-full flex flex-col justify-between">
                    <h3 className="font-black text-xs md:text-sm truncate uppercase tracking-tight text-[#171717]" title={d.title}>
                      {d.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2 border-t-2 border-[#171717]/10 pt-2">
                      <span className="text-[10px] font-bold opacity-60">{episodeText}</span>
                      <span className="text-[10px] font-black text-[#171717] md:group-hover:underline uppercase">WATCH</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  );
};

// --- MAIN PAGE ---

export default async function DracinHomePage() {
  const [latest, forYou, hotRank] = await Promise.all([
    getLatest().catch(() => []), 
    getForYou().catch(() => []), 
    getHotRank().catch(() => [])
  ]);

  const chips = [
    { label: '🔥 Hot Ranking', href: '#hot' },      
    { label: '❤️ For You', href: '#foryou' },       
    { label: '🆕 Latest Drop', href: '#new' },      
    { label: '🎬 Ongoing', href: '/dracin/search?q=ongoing' },   
    { label: '✅ Completed', href: '/dracin/search?q=completed' }, 
  ];

  return (
    <main className="min-h-dvh bg-[#F4F4F0] text-[#171717] relative overflow-x-hidden">
      
      {/* Decorative Backgrounds (Pointer events disabled) */}
      <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none -z-20" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 md:w-96 md:h-96 bg-[#A8E6CF] rounded-full border-[3px] border-[#171717] opacity-20 -z-10 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-[#FDFFB6] border-[3px] border-[#171717] rotate-12 opacity-20 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-24 relative z-10">
        
        {/* --- COMMAND BAR --- */}
        <header className="space-y-6 relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717]">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="inline-block px-3 py-1 text-xs font-black border-[3px] border-[#171717] bg-white md:hover:bg-[#171717] md:hover:text-white transition-colors">
                    &larr; HUB
                </Link>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                  BUTTERHUB <span className="opacity-30">/</span> DRACIN
                </h1>
                <span className="bg-[#FDFFB6] text-[#171717] text-[10px] font-bold px-2 py-0.5 border-2 border-[#171717] shadow-sm rotate-3">PRO</span>
              </div>
              <p className="text-sm font-bold opacity-60 mt-1 pl-1">Katalog Streaming Premium.</p>
            </div>

            <form action="/dracin/search" className="w-full md:w-auto flex gap-2">
              <input 
                name="q"
                <SearchBar placeholder="Cari judul..." /> 
                className="flex-1 md:w-64 bg-white border-[3px] border-[#171717] p-3 font-bold text-sm outline-none focus:ring-4 focus:ring-[#FDFFB6]/50 transition-all"
              />
              <button type="submit" className="bg-[#171717] text-white border-[3px] border-[#171717] px-4 font-black transition-colors active:translate-y-1">
                🔍
              </button>
            </form>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide relative z-30">
            {chips.map((chip, i) => {
              const className = "whitespace-nowrap px-4 py-2 bg-white border-[3px] border-[#171717] font-black text-[10px] uppercase shadow-[4px_4px_0px_#171717] md:hover:translate-y-[-2px] md:hover:shadow-[6px_6px_0px_#171717] transition-all active:translate-y-0 active:shadow-none block cursor-pointer";
              if (chip.href.startsWith('#')) {
                return <a key={i} href={chip.href} className={className}>{chip.label}</a>;
              }
              return <Link key={i} href={chip.href} className={className}>{chip.label}</Link>;
            })}
          </div>
        </header>

        {/* --- CONTENT GRIDS --- */}
        <DramaGrid id="hot" title="Hot Ranking 🔥" subtitle="Top 10 Most Watched" items={hotRank} viewAllLink="/dracin/hotrank" isRanking={true} />
        <DramaGrid id="foryou" title="For You ❤️" subtitle="Curated picks" items={forYou} viewAllLink="/dracin/foryou" />
        <DramaGrid id="new" title="Fresh Drop 🆕" subtitle="Just uploaded" items={latest} viewAllLink="/dracin/latest" />

      </div>
    </main>
  );
}
