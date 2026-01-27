import Image from "next/image";
import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";
import { getLatest, getForYou, getHotRank } from "@/lib/api";

// Force refresh data
export const dynamic = 'force-dynamic';

// --- COMPONENTS ---

// 1. Ranking Badge Component
const RankingBadge = ({ rank }: { rank: number }) => {
  let bgClass = "bg-surface";
  let textClass = "text-main";
  
  if (rank === 1) { bgClass = "bg-[#FDFFB6]"; } // Butter Gold
  else if (rank === 2) { bgClass = "bg-[#E0E0E0]"; } // Silver
  else if (rank === 3) { bgClass = "bg-[#FFCCB6]"; } // Bronze

  return (
    <div className={`absolute top-0 left-0 ${bgClass} border-b-brut border-r-brut border-main px-3 py-1 z-20 shadow-brut-sm`}>
      <span className={`font-black text-sm ${textClass}`}>#{rank}</span>
    </div>
  );
};

// 2. Drama Grid Component (The Premium Showcase)
const DramaGrid = ({ 
  title, 
  subtitle, 
  items, 
  isRanking = false 
}: { 
  title: string, 
  subtitle: string, 
  items: any[], 
  isRanking?: boolean 
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <section className="space-y-6 opacity-50 py-10">
        <div className="flex items-end gap-4 border-b-brut border-main pb-2">
          <h2 className="text-3xl font-black uppercase">{title}</h2>
        </div>
        <p className="font-bold">Belum ada data, Commander.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-brut border-main pb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-2 bg-accent border-brut border-main"></div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-none tracking-tight">{title}</h2>
            <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-bold bg-black text-white px-2 py-1">VIEW ALL &rarr;</span>
        </div>
      </div>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {safeItems.slice(0, 10).map((d, index) => {
          const rank = index + 1;
          return (
            <Link 
              key={d.id} 
              href={`/dracin/${d.id}`} 
              className="group block h-full outline-none focus-visible:ring-4 focus-visible:ring-accent rounded-none relative"
              aria-label={`Nonton ${d.title}`}
            >
              {/* Card Container */}
              <div className="h-full relative overflow-hidden bg-white border-brut border-main shadow-brut transition-all duration-300 md:group-hover:-translate-y-1 md:group-hover:shadow-[6px_6px_0px_0px_#000]">
                
                {/* Ranking Badge (Only for Hot Rank top 3) */}
                {isRanking && rank <= 3 && <RankingBadge rank={rank} />}

                {/* Poster Image (Aspect Ratio 3:4 for standard poster feel) */}
                <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                  <Image 
                    src={d.cover_url || "/placeholder.jpg"} 
                    alt={d.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 md:group-hover:scale-105"
                    unoptimized={true} 
                  />
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/10 transition-colors pointer-events-none" />
                </div>

                {/* Title Strip (Milk Overlay) */}
                <div className="absolute bottom-0 left-0 right-0 bg-surface/95 border-t-brut border-main p-3 backdrop-blur-sm">
                  <h3 className="font-bold text-xs md:text-sm truncate uppercase tracking-tight text-main">
                    {d.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] font-bold opacity-60">{d.total_ep} EPS</span>
                    <span className="text-[10px] font-black text-accent group-hover:underline">WATCH</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  );
};

// --- MAIN PAGE ---

export default async function DracinHomePage() {
  // Fetch Parallel
  const [latest, forYou, hotRank] = await Promise.all([
    getLatest().catch(() => []), 
    getForYou().catch(() => []), 
    getHotRank().catch(() => [])
  ]);

  return (
    <main className="min-h-dvh bg-bg text-main relative overflow-hidden">
      
      {/* --- DECORATIVE BACKGROUND (Subtle & Luxury) --- */}
      {/* Noise Texture (Desktop Only) */}
      <div className="hidden md:block absolute inset-0 opacity-[0.02] pointer-events-none -z-20" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
      
      {/* Static Shapes (No Blur - Clean Look) */}
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 md:w-96 md:h-96 bg-[#A8E6CF] rounded-full border-brut border-main opacity-40 -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-[#FDFFB6] border-brut border-main rotate-12 opacity-40 -z-10" />

      {/* --- CONTAINER --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 pb-24">
        
        {/* --- COMMAND BAR (HEADER) --- */}
        <header className="space-y-6">
          {/* Top Row: Brand & Nav */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-brut border-main pb-6 bg-surface/80 backdrop-blur-md p-6 border-brut shadow-brut relative z-10">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <BrutButton variant="secondary" className="px-3 py-1 text-xs">
                    &larr; HUB
                  </BrutButton>
                </Link>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                  BUTTERHUB <span className="opacity-30">/</span> DRACIN
                </h1>
                <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 border border-black shadow-sm rotate-3">BETA</span>
              </div>
              <p className="text-sm font-bold opacity-60 mt-1 pl-1">Katalog Streaming Premium.</p>
            </div>

            {/* Search Bar */}
            <form action="/dracin/search" className="w-full md:w-auto flex gap-2">
              <input 
                name="q"
                placeholder="Cari judul..." 
                className="flex-1 md:w-64 bg-bg border-brut border-main p-3 font-bold text-sm outline-none focus:ring-4 focus:ring-accent/20 transition-all placeholder:opacity-40"
              />
              <button type="submit" className="bg-accent text-white border-brut border-main px-4 font-black hover:bg-black transition-colors">
                🔍
              </button>
            </form>
          </div>

          {/* Filter Chips (Visual Only) */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {['🔥 Hot Ranking', '❤️ For You', '🆕 Latest Drop', '🎬 Ongoing', '✅ Completed'].map((chip, i) => (
              <button key={i} className="whitespace-nowrap px-4 py-2 bg-white border-brut border-main font-bold text-xs uppercase shadow-brut-sm hover:translate-y-[-2px] hover:shadow-brut transition-all active:translate-y-0 active:shadow-none">
                {chip}
              </button>
            ))}
          </div>
        </header>

        {/* --- CONTENT GRIDS --- */}
        
        {/* 1. Hot Ranking */}
        <DramaGrid 
          title="Hot Ranking 🔥" 
          subtitle="Top 10 Most Watched This Week" 
          items={hotRank} 
          isRanking={true} 
        />

        {/* 2. For You */}
        <DramaGrid 
          title="For You ❤️" 
          subtitle="Curated picks based on trend" 
          items={forYou} 
        />

        {/* 3. Latest Uploads */}
        <DramaGrid 
          title="Fresh Drop 🆕" 
          subtitle="Just uploaded to the server" 
          items={latest} 
        />

      </div>
    </main>
  );
}
