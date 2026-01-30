import Link from "next/link";
import Image from "next/image";
import { PrismaClient } from "@prisma/client-movie";
import ProviderSwitcher from "@/components/ProviderSwitcher";

// --- ICONS ---
const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconFire = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF9F1C]"><path d="M8.5,14.5c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4S8.5,16.7,8.5,14.5z M12.5,3c-3,2.5-5,6-5,9.5c0,3.6,2.2,6.5,5,7.5 c2.8-1,5-3.9,5-7.5C17.5,9,15.5,5.5,12.5,3z"/></svg>;
const IconClock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconStar = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#FF99C8]"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M5 3l14 9-14 9V3z"/></svg>;

const prisma = new PrismaClient();

// Helper Slug
function getSlug(url: string) {
  try {
    const parts = url.split('/').filter(p => p !== "");
    return parts[parts.length - 1] || "#";
  } catch (e) {
    return "#";
  }
}

// Fetch Data dari DB
async function getMovies(query?: string) {
  const whereClause = query ? {
    title: { contains: query }
  } : {};

  return await prisma.movies.findMany({
    where: whereClause,
    take: 24,
    orderBy: { title: 'asc' } 
  });
}

export default async function MovieHubPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const movies = await getMovies(query);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#FF9F1C] pb-24">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* HEADER */}
      <header className="relative z-20 sticky top-0 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-4 md:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* LOGO */}
            <div className="flex items-center gap-4 w-full md:w-auto">
                <Link href="/dashboard" className="w-12 h-12 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shadow-[3px_3px_0px_#0F172A]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-black uppercase leading-none tracking-tight flex items-end gap-1">
                        BUTTER<span className="text-[#FF9F1C]">HUB</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="bg-[#0F172A] text-white text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">MOVIE</span>
                        <span className="w-[2px] h-3 bg-[#0F172A]/20"></span>
                        <span className="text-[9px] font-bold text-[#0F172A] opacity-60 uppercase tracking-widest leading-none">Local DB</span>
                    </div>
                </div>
            </div>

            {/* SWITCHER */}
            <div className="flex justify-center w-full md:w-auto">
              <ProviderSwitcher />
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#0F172A]/40">
                    <IconSearch />
                </div>
                <form action="/movie-hub" method="get">
                    <input 
                        type="text" 
                        name="q"
                        defaultValue={query}
                        placeholder="Cari judul film..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border-[3px] border-[#0F172A] rounded-full font-bold text-sm focus:outline-none focus:border-[#FF9F1C] focus:shadow-[4px_4px_0px_#FF9F1C] transition-all placeholder:text-gray-300"
                    />
                </form>
            </div>
        </div>
      </header>

      {/* TABS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-4">
        <div className="flex flex-wrap gap-3">
            {[
                { id: "latest", label: "Latest Drop", icon: <IconClock />, color: "bg-[#2EC4B6] text-white" },
                { id: "trending", label: "Hot Ranking", icon: <IconFire />, color: "bg-[#FF9F1C] text-white" },
                { id: "foryou", label: "For You", icon: <IconStar />, color: "bg-[#FF99C8] text-[#0F172A]" },
            ].map((tab) => (
                <Link 
                    key={tab.id}
                    href="/movie-hub"
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-xs tracking-wide transition-all bg-white text-[#0F172A] hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F172A]`}
                >
                    {tab.icon}
                    {tab.label}
                </Link>
            ))}
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end gap-3 mb-6 border-b-[3px] border-[#0F172A] pb-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                {query ? `Search: "${query}"` : "Fresh Drops 🕒"}
            </h2>
            <p className="text-xs font-bold opacity-50 mb-1 uppercase tracking-widest">
                {movies.length} TITLES
            </p>
        </div>

        {movies.length === 0 ? (
           <div className="mt-10 bg-white border-[3px] border-[#0F172A] rounded-[20px] p-12 shadow-[10px_10px_0px_#FF99C8] text-center max-w-lg mx-auto">
                <div className="text-4xl mb-4">🏝️</div>
                <h3 className="text-2xl font-black uppercase mb-2">The beach is empty</h3>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                    Gak nemu filmnya, Bre.
                </p>
            </div>
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {movies.map((movie) => {
                const slug = getSlug(movie.url);
                
                // --- PERBAIKAN DI SINI ---
                // Ganti nama variabel jadi 'tag' (tunggal) biar match sama JSX di bawah
                const tag = "MOVIE"; 

                return (
                <div key={movie.url} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[6px_6px_0px_#0F172A] hover:-translate-y-[4px] hover:shadow-[10px_10px_0px_#FF9F1C] transition-all duration-300">
                    <div className="aspect-[3/4] bg-[#E7E5D8] relative overflow-hidden border-b-[3px] border-[#0F172A]">
                        <Image 
                            src={movie.poster || "https://via.placeholder.com/300x450"}
                            alt={movie.title || "Movie"}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <Link 
                                href={`/movie-hub/${slug}`} 
                                className="w-full py-3 bg-[#FF9F1C] border-[2px] border-[#0F172A] rounded-lg font-black uppercase text-white text-[10px] shadow-[3px_3px_0px_#0F172A] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 focus-visible:outline-none text-center"
                            >
                                <IconPlay /> Watch Now
                            </Link>
                        </div>
                        <div className="absolute top-3 right-3 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-1 rounded-md text-[9px] font-black text-[#0F172A] shadow-sm">
                            HD
                        </div>
                    </div>
                    <div className="p-4 bg-white">
                        <span className="text-[8px] font-black uppercase bg-[#0F172A] text-white px-2 py-0.5 rounded-sm mb-2 inline-block tracking-tighter">
                            {tag}
                        </span>
                        <h3 className="font-black text-sm md:text-base leading-tight uppercase line-clamp-2 group-hover:text-[#FF9F1C] transition-colors tracking-tight">
                            {movie.title}
                        </h3>
                    </div>
                </div>
                );
            })}
           </div>
        )}
      </section>
    </main>
  );
}
