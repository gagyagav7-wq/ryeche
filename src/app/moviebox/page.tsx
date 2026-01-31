import Link from "next/link";
import { getFilters, getMovies } from "@/moviebox/lib/api";
import { SearchParams } from "@/moviebox/lib/types";
import { MovieCard, FilterBar, SearchForm } from "@/moviebox/components/NeoComponents";

// Tambahkan no-scrollbar utility secara inline atau di global.css
// .no-scrollbar::-webkit-scrollbar { display: none; }
// .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function MovieHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Fetch Data Parallel (Cepat)
  
  const [filtersData, moviesData] = await Promise.all([
    getFilters(),
    getMovies(searchParams),
  ]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans pb-24 selection:bg-[#FF9F1C] selection:text-white">
      
      {/* 1. HEADER (Sticky & Responsive) */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[4px] border-[#0F172A] py-4 shadow-sm transition-all">
         <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
               
               {/* Brand & Nav Wrapper */}
               <div className="flex items-center w-full md:w-auto">
                   
                   {/* TOMBOL BACK DRACIN STYLE (Kiri) */}
                   <Link 
                      href="/dashboard" 
                      className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white shadow-[3px_3px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#0F172A] active:translate-y-0 active:shadow-none transition-all mr-4"
                   >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-5 h-5 md:w-6 md:h-6">
                        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                   </Link>

                   {/* Brand Logo (Kanan Tombol Back) */}
                   <div className="flex flex-col">
                      <Link href="/moviebox" className="group">
                        <h1 className="text-3xl md:text-4xl font-black italic uppercase leading-none tracking-tighter group-hover:skew-x-2 transition-transform">
                           BUTTER<span className="text-[#FF9F1C]">HUB</span>
                        </h1>
                      </Link>
                      <div className="flex gap-2 mt-1">
                         <span className="bg-[#0F172A] text-white px-1.5 py-0.5 text-[9px] font-bold uppercase rounded">
                            v2.0
                         </span>
                         <span className="bg-[#CBEF43] border-[2px] border-[#0F172A] px-1.5 py-0.5 text-[9px] font-bold uppercase rounded">
                            LOCAL DB
                         </span>
                      </div>
                   </div>
               </div>

               {/* Search Bar (Sekarang Client Component) */}
               <div className="w-full md:max-w-md">
                  <SearchForm />
               </div>

            </div>
         </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-10">
         
         {/* Filter Bar System */}
         <FilterBar filters={filtersData} />

         {/* Section Title */}
         <div className="flex items-end justify-between mb-6 md:mb-8 border-b-[4px] border-[#0F172A] pb-4">
            <div className="flex flex-col gap-1">
               <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
                  {searchParams.q ? `Search: "${searchParams.q}"` : "Fresh Drops"}
               </h2>
               <p className="text-xs md:text-sm font-bold opacity-60 uppercase tracking-widest">
                  Updated Daily • Curated for You
               </p>
            </div>
            <span className="bg-[#0F172A] text-white px-3 py-1 md:px-4 md:py-2 text-[10px] md:text-xs font-black rounded-lg shadow-[3px_3px_0px_#FF9F1C]">
               {moviesData.length} TITLES
            </span>
         </div>

         {/* GRID DISPLAY */}
         {moviesData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-8 pb-10">
               {moviesData.map((movie) => (
                  <MovieCard key={movie.id} item={movie} />
               ))}
            </div>
         ) : (
            // EMPTY STATE (Neo-Brutal)
            <div className="py-24 text-center border-[4px] border-[#0F172A] rounded-[32px] bg-white shadow-[8px_8px_0px_#CBEF43] mx-4 md:mx-auto max-w-2xl">
               <div className="text-6xl mb-4">🌵</div>
               <h3 className="text-2xl md:text-3xl font-black uppercase">No Results Found</h3>
               <p className="text-xs md:text-sm font-bold opacity-50 uppercase mt-2 max-w-xs mx-auto">
                  We couldn't find what you're looking for. Try adjusting your filters.
               </p>
               <Link 
                  href="/moviebox" 
                  className="inline-block mt-8 px-8 py-4 bg-[#0F172A] text-white font-black uppercase rounded-xl hover:bg-[#FF9F1C] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F172A] transition-all"
               >
                  Reset All Filters
               </Link>
            </div>
         )}
      </div>

    </main>
  );
}
