// src/app/dramabox/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { dramaboxApi } from "@/lib/providers/dramabox"; // Panggil Provider Baru

export default function DramaboxPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest"); // Tab default

  // Tab Menu khusus Dramabox (Sesuai API lu)
  const tabs = [
    { id: "latest", label: "Fresh Drops" },
    { id: "trending", label: "Trending" },
    { id: "vip", label: "VIP Exclusive" },
    { id: "dubindo", label: "Dubbing Indo" }, // Fitur Khas Dramabox
    { id: "foryou", label: "For You" }
  ];

  useEffect(() => {
    setLoading(true);
    dramaboxApi.getHome(activeTab).then(res => {
      setMovies(res.data || []);
      setLoading(false);
    });
  }, [activeTab]);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] p-6 pb-24">
      {/* HEADER KHUSUS DRAMABOX */}
      <header className="mb-8 border-b-4 border-[#0F172A] pb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            DRAMA<span className="text-[#FF708D]">BOX</span>
          </h1>
          <span className="bg-[#0F172A] text-white px-3 py-1 text-[10px] font-black uppercase rounded">
            Official API
          </span>
        </div>
        
        {/* TAB NAVIGATION */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 border-2 border-[#0F172A] rounded-full font-black text-xs uppercase transition-all whitespace-nowrap shadow-[3px_3px_0px_#0F172A] ${
                activeTab === tab.id 
                ? "bg-[#FF708D] text-white -translate-y-1 shadow-[5px_5px_0px_#0F172A]" 
                : "bg-white hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* GRID CONTENT */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
             <div key={i} className="aspect-[3/4] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((m: any) => (
            <Link key={m.bookId} href={`/dramabox/${m.bookId}`} className="group relative block bg-white border-2 border-[#0F172A] rounded-xl overflow-hidden shadow-[4px_4px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#FF708D] transition-all">
              <div className="aspect-[3/4] relative">
                <Image src={m.cover} alt={m.title} fill className="object-cover" unoptimized />
                <div className="absolute top-2 right-2 bg-[#CBEF43] border border-[#0F172A] px-2 py-0.5 text-[8px] font-black uppercase">
                  {m.episodes} EP
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-black text-xs uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D]">
                  {m.title}
                </h3>
                {/* Tampilkan Tag Pertama jika ada */}
                {m.tags?.[0] && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-[#0F172A] text-white text-[8px] font-bold uppercase rounded-sm">
                    {typeof m.tags[0] === 'string' ? m.tags[0] : m.tags[0].tagName}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
