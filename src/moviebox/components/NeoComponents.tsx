"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MovieItem, FilterResponse } from "../lib/types";

// --- HELPERS ---

const toPosterHD = (url?: string) => {
  if (!url) return "https://via.placeholder.com/300x450?text=NO+IMG";
  return url.replace(/-\d+x\d+(?=\.(jpg|jpeg|png|webp)$)/i, "")
            .replace(/([?&])(w|width|h|height|resize)=\d+/gi, "$1");
};

// URL Builder Helper
const buildQuery = (currentParams: URLSearchParams, key: string, value: string | null) => {
  const newParams = new URLSearchParams(currentParams.toString());
  if (value) {
    newParams.set(key, value);
  } else {
    newParams.delete(key);
  }
  return newParams.toString();
};

// --- 1. SEARCH FORM COMPONENT (Fixed Type Error) ---
export const SearchForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Tambahkan .toString() agar Tipe Datanya cocok
    const queryString = buildQuery(new URLSearchParams(searchParams.toString()), "q", query);
    router.push(`/moviebox?${queryString}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="FIND MOVIES, SERIES..." 
        aria-label="Search movies"
        className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-white border-[3px] border-[#0F172A] rounded-xl md:rounded-2xl font-black text-sm md:text-base uppercase placeholder:text-gray-400 focus:outline-none focus:border-[#FF9F1C] focus:shadow-[4px_4px_0px_#FF9F1C] transition-all"
      />
      <button 
        type="submit"
        aria-label="Submit Search"
        className="absolute right-2 top-2 bottom-2 aspect-square bg-[#0F172A] text-white rounded-lg flex items-center justify-center md:hidden active:scale-95 transition-transform"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </form>
  );
};

// --- 2. FILTER BAR (Fixed Type Error) ---
export const FilterBar = ({ filters }: { filters: FilterResponse }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    // FIX: Tambahkan .toString() disini juga
    const queryString = buildQuery(new URLSearchParams(searchParams.toString()), key, value);
    router.push(`/moviebox?${queryString}`);
  };

  const currentGenre = searchParams.get("genre") || "";
  const currentYear = searchParams.get("year") || "";
  const currentType = searchParams.get("type") || "";
  const currentTab = searchParams.get("sort") || "latest"; 
  const currentCountry = searchParams.get("country") || "";

  return (
    <div className="space-y-4 md:space-y-6 mb-8 select-none">
      
      {/* LAYER 1 */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* TABS */}
        <div className="flex bg-white border-[3px] border-[#0F172A] rounded-xl p-1 gap-1 shadow-[4px_4px_0px_#0F172A] w-full md:w-auto overflow-x-auto no-scrollbar">
           {[
              { id: "latest", label: "LATEST 🕒" },
              { id: "hot", label: "HOT 🔥" },
              { id: "foryou", label: "FOR YOU ✨" }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => handleFilter("sort", tab.id)}
               className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase whitespace-nowrap transition-all ${
                 currentTab === tab.id 
                 ? "bg-[#FF9F1C] text-white border-2 border-[#0F172A]" 
                 : "hover:bg-gray-100 text-[#0F172A]"
               }`}
             >
               {tab.label}
             </button>
           ))}
        </div>

        {/* DROPDOWNS */}
        <div className="flex gap-3 w-full md:w-auto">
           {/* Type */}
           <div className="flex bg-white border-[3px] border-[#0F172A] rounded-xl p-1 shadow-[4px_4px_0px_#0F172A] flex-1 md:flex-none">
              {filters.types.map(t => (
                 <button
                   key={t.value}
                   onClick={() => handleFilter("type", t.value)}
                   className={`flex-1 px-3 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase transition-all ${
                      currentType === t.value ? "bg-[#0F172A] text-white" : "hover:bg-gray-100"
                   }`}
                 >
                   {t.label === "All Types" ? "ALL" : t.label}
                 </button>
              ))}
           </div>

           {/* Year */}
           <div className="relative flex-1 md:flex-none min-w-[100px]">
             <select 
                onChange={(e) => handleFilter("year", e.target.value)}
                value={currentYear}
                className="w-full appearance-none bg-[#CBEF43] border-[3px] border-[#0F172A] pl-4 pr-8 py-2.5 md:py-3 rounded-xl text-xs font-black uppercase cursor-pointer shadow-[4px_4px_0px_#0F172A] focus:outline-none focus:translate-y-[2px] focus:shadow-none transition-all"
                aria-label="Filter by Year"
             >
                {filters.years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#0F172A]">
               <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7 7"></path></svg>
             </div>
           </div>
        </div>
      </div>

      {/* LAYER 2: CHIPS */}
      <div className="relative group">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#FFFDF7] to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 px-1 no-scrollbar mask-scroll">
           <button
              onClick={() => router.push('/moviebox')}
              className="shrink-0 px-4 py-2 bg-[#0F172A] text-white border-[3px] border-[#0F172A] rounded-full text-[10px] font-black uppercase hover:bg-gray-800 transition-all shadow-sm"
           >
             ✖ RESET
           </button>

           {filters.genres.map((g) => {
             if (!g.value) return null;
             return (
               <button
                 key={g.value} 
                 onClick={() => handleFilter("genre", g.value)}
                 className={`
                   shrink-0 whitespace-nowrap px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-wider border-[3px] border-[#0F172A] transition-all
                   ${currentGenre === g.value 
                     ? "bg-[#FF9F1C] text-white shadow-[2px_2px_0px_#0F172A] translate-y-[1px]" 
                     : "bg-white text-[#0F172A] hover:bg-[#CBEF43] hover:-translate-y-1 hover:shadow-[3px_3px_0px_#0F172A]"
                   }
                 `}
               >
                 {g.label}
               </button>
             );
           })}

           {filters.countries.map((c) => {
             if(!c.value) return null;
             return (
               <button
                key={c.value}
                onClick={() => handleFilter("country", c.value)}
                className={`
                  shrink-0 whitespace-nowrap px-5 py-2 rounded-full font-black uppercase text-[10px] tracking-wider border-[3px] border-[#0F172A] transition-all
                  ${currentCountry === c.value
                    ? "bg-[#FF9F1C] text-white shadow-[2px_2px_0px_#0F172A] translate-y-[1px]"
                    : "bg-gray-100 text-[#0F172A] hover:bg-[#CBEF43] hover:-translate-y-1 hover:shadow-[3px_3px_0px_#0F172A]"
                  }
                `}
               >
                 🏳️ {c.label}
               </button>
             )
           })}
        </div>

        <div className="absolute right-0 top-0 bottom-4 w-8 md:w-16 bg-gradient-to-l from-[#FFFDF7] to-transparent z-10 pointer-events-none" />
      </div>

    </div>
  );
};

// --- 3. MOVIE CARD ---
export const MovieCard = ({ item }: { item: MovieItem }) => {
  const base64Id = typeof window !== 'undefined' ? btoa(item.id).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : '';
  const href = `/moviebox/${base64Id}`;

  return (
    <Link 
      href={href}
      className="group block bg-white border-[3px] border-[#0F172A] rounded-[24px] overflow-hidden shadow-[5px_5px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FF708D] transition-all duration-300 active:scale-[0.98]"
    >
      <div className="aspect-[3/4] relative bg-[#E7E5D8] border-b-[3px] border-[#0F172A]">
        <img
          src={toPosterHD(item.poster)}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-0.5 text-[10px] font-black rounded-md shadow-[2px_2px_0px_#0F172A]">
            {item.quality}
          </span>
        </div>
      </div>

      <div className="p-4 bg-white relative">
        <div className="flex items-center gap-2 mb-2">
           <span className="bg-[#0F172A] text-white px-2 py-0.5 text-[9px] font-bold uppercase rounded-md">
              {item.type}
           </span>
           <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded-md border-2 border-gray-200 text-[#0F172A]">
              {item.year}
           </span>
        </div>
        <h3 className="font-black text-sm md:text-base uppercase leading-tight line-clamp-2 group-hover:text-[#FF9F1C] transition-colors">
          {item.title}
        </h3>
        <p className="mt-2 text-[9px] font-bold uppercase text-gray-400 tracking-wider truncate">
          {(item.genres ?? []).slice(0, 2).join(", ") || "Movie"}
        </p>
      </div>
    </Link>
  );
};
