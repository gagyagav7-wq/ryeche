"use client";

import React, { useState, useEffect, useRef } from "react";
import { MovieAPI, MovieTitle, FilterData, FilterPayload } from "@/moviebox/lib/api";
import { TabPill, GenreChip, MovieCard } from "@/moviebox/components/ui-parts";
import { Header } from "@/moviebox/components/header";

// Icons for tabs
const FireIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500"><path d="M12 2c0 0-8 5.5-8 12.5C4 19.5 7.5 22 12 22s8-2.5 8-7.5C20 7.5 12 2 12 2z"/></svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

export default function MovieBoxPage() {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [titles, setTitles] = useState<MovieTitle[]>([]);
  const [filterOpts, setFilterOpts] = useState<FilterData>({ genres: [], years: [], types: [] });
  
  // Active Filters
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"latest" | "hot" | "forYou">("latest");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null); // movie/series

  const abortControllerRef = useRef<AbortController | null>(null);

  // --- 1. INITIAL LOAD (Fetch Filters) ---
  useEffect(() => {
    const loadFilters = async () => {
      const data = await MovieAPI.getFilters();
      setFilterOpts(data);
    };
    loadFilters();
  }, []);

  // --- 2. FETCH TITLES (Reactive to all filters) ---
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const payload: FilterPayload = {
          q: search,
          sort: activeTab,
          genre: activeGenre || undefined,
          year: activeYear || undefined,
          type: activeType || undefined,
        };

        const data = await MovieAPI.getTitles(payload, controller.signal);
        setTitles(data);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Fetch failed", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Debounce khusus untuk search text, tapi immediate untuk filter click
    const timer = setTimeout(() => {
      fetchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, activeTab, activeGenre, activeYear, activeType]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black font-sans pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        
        {/* HEADER & SEARCH */}
        <Header searchTerm={search} onSearchChange={setSearch} />

        {/* MAIN TABS */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-2">
          <TabPill 
            active={activeTab === "latest"} 
            label="Latest Drop" 
            icon={<ClockIcon />} 
            onClick={() => setActiveTab("latest")} 
          />
          <TabPill 
            active={activeTab === "hot"} 
            label="Hot Ranking" 
            icon={<FireIcon />} 
            onClick={() => setActiveTab("hot")} 
          />
          <TabPill 
            active={activeTab === "forYou"} 
            label="For You" 
            icon={<StarIcon />} 
            onClick={() => setActiveTab("forYou")} 
          />
        </div>

        {/* SECTION HEADER: FRESH DROPS */}
        <div className="flex items-end gap-2 mb-4 mt-4">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">
            {activeTab === 'latest' ? 'Fresh Drops' : activeTab === 'hot' ? 'Trending' : 'Your Picks'}
          </h2>
          <span className="text-gray-500 font-bold mb-1.5 text-sm">{titles.length} TITLES</span>
        </div>

        {/* DYNAMIC FILTERS ROW (Genres) */}
        <div className="relative w-full mb-6 group">
          {/* Fade Edges for Scroll Indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FFFDF5] to-transparent z-10 pointer-events-none"/>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFFDF5] to-transparent z-10 pointer-events-none"/>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 py-2">
            <GenreChip 
               label="ALL" 
               active={activeGenre === null} 
               onClick={() => setActiveGenre(null)} 
            />
            {filterOpts.genres.map((g) => (
              <GenreChip
                key={g.id}
                label={g.label}
                active={activeGenre === g.value}
                onClick={() => setActiveGenre(activeGenre === g.value ? null : g.value)}
              />
            ))}
          </div>
        </div>

        {/* SECONDARY FILTERS (Year, Type) - Minimalist Bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar px-1">
          {/* Type Selector */}
          <select 
            className="appearance-none bg-white border-2 border-black rounded-lg px-3 py-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            value={activeType || ""}
            onChange={(e) => setActiveType(e.target.value || null)}
          >
            <option value="">All Types</option>
            {filterOpts.types.map(t => <option key={t.id} value={t.value}>{t.label}</option>)}
          </select>

          {/* Year Selector */}
          <select 
            className="appearance-none bg-white border-2 border-black rounded-lg px-3 py-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            value={activeYear || ""}
            onChange={(e) => setActiveYear(e.target.value || null)}
          >
            <option value="">Any Year</option>
            {filterOpts.years.map(y => <option key={y.id} value={y.value}>{y.label}</option>)}
          </select>
        </div>

        {/* MOVIE GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-black border-t-[#FFC94A] rounded-full"></div>
          </div>
        ) : titles.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {titles.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                poster={movie.poster}
                year={movie.year}
                type={movie.type}
                quality={movie.quality}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-400 font-bold text-lg">No movies found.</p>
            <button 
                onClick={() => {setSearch(''); setActiveGenre(null); setActiveYear(null); setActiveType(null);}}
                className="mt-2 text-[#FFC94A] font-black underline"
            >
                Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
