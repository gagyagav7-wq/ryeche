"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MovieItem, FilterResponse } from "../lib/types";

// --- HELPER: Image Quality Fixer ---
const toPosterHD = (url?: string) => {
  if (!url) return "https://via.placeholder.com/300x450?text=NO+IMG";
  // Hapus suffix ukuran (contoh: -60x90.jpg)
  return url.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp)$)/i, "")
            .replace(/([?&])(w|width|h|height|resize)=\d+/gi, "$1");
};

// --- HELPER: Slugify Title for SEO URL ---
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

// --- 1. MOVIE CARD (Fixed Layout & HD Poster) ---
export const MovieCard = ({ item }: { item: MovieItem }) => {
  // ROUTING AMAN: Gunakan encodeURIComponent pada ID
  const safeId = encodeURIComponent(item.id); 
  const href = `/movie-hub/${safeId}-${slugify(item.title)}`;

  return (
    <Link 
      href={href}
      className="group block bg-white border-[3px] border-[#0F172A] rounded-[24px] overflow-hidden shadow-[5px_5px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FF708D] transition-all duration-300"
    >
      <div className="aspect-[3/4] relative bg-[#E7E5D8] border-b-[3px] border-[#0F172A]">
        {/* Poster Image */}
        <img
          src={toPosterHD(item.poster)}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        
        {/* Badges (Over Image) */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          <span className="bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-0.5 text-[10px] font-black rounded shadow-sm">
            {item.quality}
          </span>
        </div>
      </div>

      {/* Info Panel (White Background - No Gradient) */}
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
           <span className="bg-[#0F172A] text-white px-2 py-0.5 text-[8px] font-bold uppercase rounded">
              {item.type}
           </span>
           <span className="text-[10px] font-black bg-gray-100 px-1 rounded border border-gray-300">
              {item.year}
           </span>
        </div>
        <h3 className="font-black text-sm uppercase leading-tight line-clamp-2 group-hover:text-[#FF708D] transition-colors">
          {item.title}
        </h3>
        <p className="text-[9px] font-mono mt-2 opacity-60 truncate">
           {item.genres[0] || "Movies"}
        </p>
      </div>
    </Link>
  );
};

// --- 2. FILTER BAR (Interactive & Responsive) ---
export const FilterBar = ({ filters }: { filters: FilterResponse }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    // Reset ke page 1 kalau filter berubah (opsional)
    // params.delete("page"); 
    router.push(`/movie-hub?${params.toString()}`);
  };

  const currentGenre = searchParams.get("genre") || "";
  const currentYear = searchParams.get("year") || "";
  const currentType = searchParams.get("type") || "";

  return (
    <div className="space-y-4 mb-8">
      {/* Row 1: Type Buttons & Year Dropdown */}
      <div className="flex flex-wrap gap-3">
         {/* Type Selector (Pill Style) */}
         <div className="flex bg-white border-[3px] border-[#0F172A] rounded-lg p-1 gap-1 shadow-[4px_4px_0px_#0F172A]">
            {filters.types.map(t => (
               <button
                 key={t.value}
                 onClick={() => handleFilter("type", t.value)}
                 className={`px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all ${
                    currentType === t.value ? "bg-[#0F172A] text-white" : "hover:bg-gray-100"
                 }`}
               >
                 {t.label === "All Types" ? "ALL" : t.label}
               </button>
            ))}
         </div>

         {/* Year Dropdown */}
         <div className="relative">
             <select 
                onChange={(e) => handleFilter("year", e.target.value)}
                value={currentYear}
                className="appearance-none bg-white border-[3px] border-[#0F172A] pl-4 pr-8 py-2 rounded-lg text-xs font-black uppercase cursor-pointer shadow-[4px_4px_0px_#0F172A] focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all"
             >
                {filters.years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#0F172A]">
               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
             </div>
         </div>
      </div>

      {/* Row 2: Genre Chips (Horizontal Scroll) */}
      <div className="relative group">
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 px-1 no-scrollbar">
           {filters.genres.map((g) => (
             <button
               key={g.value} 
               onClick={() => handleFilter("genre", g.value)}
               className={`
                 shrink-0 whitespace-nowrap px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-wider border-[3px] border-[#0F172A] transition-all
                 ${currentGenre === g.value 
                   ? "bg-[#FF9F1C] text-white shadow-[3px_3px_0px_#0F172A] -translate-y-1" 
                   : "bg-white text-[#0F172A] hover:bg-[#CBEF43] hover:-translate-y-1 hover:shadow-[3px_3px_0px_#0F172A]"
                 }
               `}
             >
               {g.label}
             </button>
           ))}
        </div>
        {/* Fade Effect Kanan (Visual Cue) */}
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#FFFDF7] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
