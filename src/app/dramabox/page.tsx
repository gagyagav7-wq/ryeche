"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { dramaboxApi } from "@/lib/providers/dramabox"; 
import { usePathname } from "next/navigation";

export default function DramaboxPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest"); 
  const pathname = usePathname();

  const tabs = [
    { id: "latest", label: "Fresh Drops" },
    { id: "trending", label: "Trending" },
    { id: "vip", label: "VIP Exclusive" },
    { id: "dubindo", label: "Dubbing Indo" }, 
    { id: "foryou", label: "For You" }
  ];
   
  const servers = [
    { id: "flickreels", label: "Flickreels", color: "bg-[#FF9F1C]" }, 
    { id: "dramabox", label: "Dramabox", color: "bg-[#FF708D]" },    
    { id: "netshort", label: "Netshort", color: "bg-[#CBEF43]" },    
    { id: "melolo", label: "Melolo", color: "bg-[#2EC4B6]" },       
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
      {/* HEADER UTAMA */}
      <header className="mb-8 border-b-4 border-[#0F172A] pb-6">
        
        {/* 1. JUDUL & TAG */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            DRAMA<span className="text-[#FF708D]">BOX</span>
          </h1>
          <span className="bg-[#0F172A] text-white px-3 py-1 text-[10px] font-black uppercase rounded">
            Official API
          </span>
        </div>

        {/* 2. SERVER SWITCHER (INI YANG TADI HILANG) */}
        <div className="flex flex-wrap gap-2 mb-6">
           {servers.map((srv) => (
             <Link
               key={srv.id}
               href={`/${srv.id}`} 
               className={`px-4 py-2 border-[3px] border-[#0F172A] rounded-lg font-black text-[10px] uppercase transition-all shadow-[3px_3px_0px_#0F172A] flex items-center gap-2 ${
                 pathname.includes(srv.id) 
                 ? `${srv.color} text-white -translate-y-1 shadow-[5px_5px_0px_#0F172A]` 
                 : "bg-white text-[#0F172A] hover:bg-gray-50"
               }`}
             >
               {/* Indikator Aktif (Titik Kedip) */}
               {pathname.includes(srv.id) && (
                 <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
               )}
               {srv.label}
             </Link>
           ))}
        </div>
        
        {/* 3. TAB NAVIGATION (Kategori Dramabox) */}
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
