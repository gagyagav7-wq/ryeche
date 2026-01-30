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
   
  // Konfigurasi Server dengan Badge & Warna
  const servers = [
    { id: "flickreels", label: "Flickreels", badge: "FR", color: "bg-[#FF9F1C]" }, 
    { id: "dramabox", label: "Dramabox", badge: "DB", color: "bg-[#FF708D]" },    
    { id: "netshort", label: "Netshort", badge: "NS", color: "bg-[#CBEF43]" },    
    { id: "melolo", label: "Melolo", badge: "ML", color: "bg-[#2EC4B6]" },       
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
      {/* HEADER AREA */}
      <header className="mb-8 border-b-4 border-[#0F172A] pb-6">
        
        {/* 1. TOP BAR: TITLE & INFO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              DRAMA<span className="text-[#FF708D]">BOX</span>
            </h1>
            <span className="bg-[#0F172A] text-white px-3 py-1 text-[10px] font-black uppercase rounded shadow-[3px_3px_0px_#CBEF43]">
              Official API v2.0
            </span>
          </div>

          {/* 2. SERVER SWITCHER (IMPLEMENTASI FINAL) */}
          <div className="flex items-center gap-2 bg-white border-[3px] border-[#0F172A] rounded-full p-1.5 shadow-[5px_5px_0px_#0F172A]">
            {servers.map((srv) => {
              const isActive = pathname.includes(srv.id);
              return (
                <Link
                  key={srv.id}
                  href={`/${srv.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-[2px] border-[#0F172A] font-black uppercase text-[10px] tracking-widest transition-all ${
                    isActive
                      ? "bg-[#0F172A] text-white shadow-[2px_2px_0px_#CBEF43] -translate-y-[1px]"
                      : "bg-[#FFFDF7] text-[#0F172A] hover:bg-gray-100 border-transparent hover:border-[#0F172A]"
                  }`}
                >
                  {/* Badge Kotak Kecil */}
                  <span className={`w-5 h-5 grid place-items-center rounded border border-[#0F172A] text-[8px] font-black ${srv.color} text-[#0F172A]`}>
                    {srv.badge}
                  </span>
                  {srv.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. TAB NAVIGATION */}
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

      {/* GRID CONTENT (Sama seperti sebelumnya) */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
             <div key={i} className="aspect-[3/4] bg-gray-200 border-2 border-[#0F172A] rounded-xl animate-pulse shadow-[4px_4px_0px_#0F172A]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((m: any) => (
            <Link key={m.bookId} href={`/dramabox/${m.bookId}`} className="group relative block bg-white border-[3px] border-[#0F172A] rounded-xl overflow-hidden shadow-[5px_5px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FF708D] transition-all">
              <div className="aspect-[3/4] relative bg-[#0F172A]">
                <Image src={m.cover} alt={m.title} fill className="object-cover" unoptimized />
                <div className="absolute top-2 right-2 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-0.5 text-[8px] font-black uppercase rounded-md shadow-sm">
                  {m.episodes} EP
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-black text-xs uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D] transition-colors">
                  {m.title}
                </h3>
                {m.tags?.[0] && (
                  <span className="inline-block mt-3 px-2 py-1 bg-[#0F172A] text-white text-[8px] font-bold uppercase rounded-md border border-[#0F172A]">
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
