import Link from "next/link";
import { getFilters, getMovies } from "@/moviebox/lib/api";
import { SearchParams } from "@/moviebox/lib/types";
import { MovieCard, FilterBar } from "@/moviebox/components/NeoComponents";

export default async function MovieHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 1. Fetch Parallel (Data + Filters)
  const [filtersData, moviesData] = await Promise.all([
    getFilters(),
    getMovies(searchParams),
  ]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans pb-24">
      
      {/* 1. HEADER (Sticky & Wide) */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[4px] border-[#0F172A] py-4">
         <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-4">
            {/* Top Row */}
            <div className="flex justify-between items-center gap-4">
               <div className="flex flex-col">
                  <h1 className="text-3xl font-black italic uppercase leading-none tracking-tighter">
                     BUTTER<span className="text-[#FF9F1C]">HUB</span>
                  </h1>
                  <span className="text-[10px] font-bold opacity-60 tracking-widest uppercase">
                    MovieBox • Local DB
                  </span>
               </div>

               {/* Search Bar (Besar & Bold) */}
               <form action="/moviebox" method="get" className="flex-1 max-w-md hidden md:block">
                  <input 
                    type="text" 
                    name="q"
                    defaultValue={searchParams.q}
                    placeholder="FIND MOVIES..." 
                    className="w-full px-4 py-2 bg-white border-[3px] border-[#0F172A] rounded-lg font-bold text-sm uppercase focus:outline-none focus:shadow-[4px_4px_0px_#FF9F1C] transition-all"
                  />
               </form>
            </div>
         </div>
      </header>

      {/* 2. MAIN CONTENT CONTAINER (Lebar max-w-7xl biar gak HP raksasa) */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-8">
         
         {/* Filter Bar Component */}
         <FilterBar filters={filtersData} />

         {/* Title & Count */}
         <div className="flex items-end justify-between mb-6 border-b-[3px] border-[#0F172A] pb-2">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
               {searchParams.q ? `Results: "${searchParams.q}"` : "Fresh Drops"}
            </h2>
            <span className="bg-[#0F172A] text-white px-3 py-1 text-xs font-bold rounded mb-1">
               {moviesData.length} TITLES
            </span>
         </div>

         {/* GRID RESPONSIVE (Up to 6 columns on XL) */}
         {moviesData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
               {moviesData.map((movie) => (
                  <MovieCard key={movie.id} item={movie} />
               ))}
            </div>
         ) : (
            <div className="py-24 text-center border-[4px] border-[#0F172A] rounded-[32px] bg-white shadow-[8px_8px_0px_#CBEF43]">
               <h3 className="text-2xl font-black uppercase">No Movies Found</h3>
               <p className="text-sm font-bold opacity-50 uppercase mt-2">Try searching something else, Bre.</p>
               <Link href="/moviebox" className="inline-block mt-6 px-6 py-3 bg-[#0F172A] text-white font-black uppercase rounded-lg hover:bg-[#FF9F1C] transition-colors">
                  Reset All
               </Link>
            </div>
         )}
      </div>

    </main>
  );
}
