"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

// --- ICONS ---
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M8 5v14l11-7z"/></svg>;
const IconFilm = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>;
const IconBolt = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconHeart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#CBEF43]">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* =======================
          1. TOP BAR (HEADER)
         ======================= */}
      <header className="relative z-20 px-6 py-6 md:px-12 border-b-[3px] border-[#0F172A] bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#FF99C8] border-[3px] border-[#0F172A] rounded-lg flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_#0F172A]">B</div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tight leading-none">
                   DAWG<span className="text-transparent" style={{ WebkitTextStroke: '1.5px #0F172A' }}>Hub</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">System Control Deck</p>
             </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#E7E5D8]/30 border border-[#0F172A] rounded-full">
                <span className="w-2 h-2 bg-[#CBEF43] rounded-full animate-pulse border border-[#0F172A]"></span>
                <span className="text-[10px] font-mono font-bold uppercase opacity-80">Session: Active</span>
             </div>
             
             {/* POLISHED LOGOUT BUTTON WRAPPER */}
             <div className="w-full md:w-auto h-11 border-[3px] border-[#0F172A] rounded-xl bg-white shadow-[4px_4px_0px_#0F172A] 
                transition-all duration-75 ease-in-out
                hover:-translate-y-[2px] hover:-translate-x-[1px] hover:shadow-[6px_6px_0px_#0F172A] 
                active:translate-y-[2px] active:translate-x-[1px] active:shadow-none
                focus-within:ring-4 focus-within:ring-[#FF99C8]/30 
                flex items-center justify-center overflow-hidden">
                <LogoutButton />
             </div>
          </div>
        </div>
      </header>

      {/* =======================
          2. MAIN DASHBOARD CONTENT
         ======================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16">
         
         {/* POLISHED WELCOME BANNER */}
         <div className="mb-14 group">
            <div className="flex items-center gap-2 mb-3">
               <span className="h-[3px] w-6 bg-[#0F172A]"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0F172A] opacity-40">System Access Granted</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-[#0F172A]">
               Welcome back, <br className="md:hidden" />
               <span className="relative inline-block">
                  <span className="relative z-10 text-[#FF9F1C]">Creamy.</span>
                  <span className="absolute bottom-2 left-0 w-full h-[20%] bg-[#FF9F1C]/20 -z-0 transition-all group-hover:h-[40%]"></span>
               </span>
            </h2>
            
            <p className="text-sm md:text-base font-bold text-[#0F172A] opacity-60 max-w-xl leading-relaxed mt-6 flex items-start gap-2">
               <span className="text-[#FF9F1C] shrink-0">●</span>
               Semua sistem berjalan optimal. Selamat menikmati sesi premium Anda hari ini.
            </p>
         </div>

         {/* --- MODULES GRID (Opsi B: Movie Hub Hero Layout) --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* 1. MOVIE HUB (HERO - SUNSET CORAL) */}
            <Link href="/movie-hub" className="md:col-span-2 group relative bg-[#FF708D] border-[3px] border-[#0F172A] rounded-[20px] p-8 md:p-12 shadow-[6px_6px_0px_#0F172A] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300 overflow-hidden text-white">
                {/* Subtle Tropical Pattern (Palm Leaves) */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                   <div className="flex items-start md:items-center gap-6">
                      <div className="w-20 h-20 bg-white border-[3px] border-[#0F172A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#0F172A] group-hover:scale-105 transition-transform text-[#FF708D]">
                         <IconFilm />
                      </div>
                      <div>
                         <span className="bg-white text-[#0F172A] border-[2px] border-[#0F172A] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#0F172A] inline-block mb-3">Main App</span>
                         <h3 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">Movie Hub</h3>
                         <p className="font-bold text-sm opacity-90 max-w-md leading-relaxed">
                            Stream & explore global cinema. Fast search, clean player, and curated picks for your island retreat.
                         </p>
                      </div>
                   </div>
                   
                   <div className="inline-flex items-center gap-2 font-black uppercase text-xs bg-white text-[#0F172A] px-6 py-4 rounded-xl border-[3px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] group-hover:translate-x-1 transition-transform self-start md:self-center">
                      Launch Movie Hub &rarr;
                   </div>
                </div>
            </Link>

            {/* 2. DRAMA CINA */}
            <Link href="/dracin" className="group relative bg-white border-[3px] border-[#0F172A] rounded-[20px] p-8 md:p-10 shadow-[6px_6px_0px_#0F172A] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_#FF9F1C] transition-all duration-300 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#FF9F1C] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="flex justify-between items-start mb-8">
                   <div className="w-16 h-16 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#0F172A] group-hover:rotate-6 transition-transform text-white">
                      <IconPlay />
                   </div>
                   <span className="bg-[#0F172A] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Main App</span>
                </div>
                <h3 className="text-2xl font-black uppercase mb-3 leading-tight group-hover:text-[#FF9F1C] transition-colors">Drama Cina</h3>
                <p className="font-medium text-sm opacity-80 mb-8 leading-relaxed">Access the Master Hub. Drama, Movies, and Variety Shows library.</p>
                <div className="inline-flex items-center gap-2 font-black uppercase text-xs border-b-[3px] border-[#0F172A] pb-1 group-hover:text-[#FF9F1C] group-hover:border-[#FF9F1C] transition-colors">Launch Application &rarr;</div>
            </Link>

            {/* 3. DOWNLOADER */}
            <Link href="/downloader" className="group relative bg-[#2EC4B6] border-[3px] border-[#0F172A] rounded-[20px] p-8 md:p-10 shadow-[6px_6px_0px_#0F172A] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300 overflow-hidden text-white">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="w-16 h-16 bg-white border-[3px] border-[#0F172A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#0F172A] group-hover:-rotate-6 transition-transform text-[#0F172A]">
                      <IconBolt />
                   </div>
                   <span className="bg-white text-[#0F172A] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#0F172A]">Utility</span>
                </div>
                <h3 className="relative z-10 text-2xl font-black uppercase mb-3 text-white leading-tight">Downloader</h3>
                <p className="relative z-10 font-medium text-sm opacity-95 mb-8 leading-relaxed">Universal tool for TikTok, IG, & YouTube. No Watermark.</p>
                <div className="relative z-10 inline-flex items-center gap-2 font-black uppercase text-xs bg-white text-[#0F172A] px-4 py-2.5 rounded-lg border-[3px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] group-hover:translate-x-1 transition-transform">Open Tool &rarr;</div>
            </Link>

         </div>

         {/* --- QUICK ACCESS --- */}
         <div>
            <div className="flex items-center gap-4 mb-6 opacity-50">
                <div className="h-[3px] w-6 bg-[#0F172A]"></div>
                <h4 className="text-xs font-black uppercase tracking-widest">System Shortcuts</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { label: "History", icon: <IconHistory />, status: "SOON" },
                  { label: "Favorites", icon: <IconHeart />, status: "SOON" },
                  { label: "Profile", icon: <IconUser />, status: "SOON" },
                  { label: "Settings", icon: <IconSettings />, status: "SOON" },
               ].map((item, idx) => (
                  <div key={idx} className="bg-white border-[2px] border-[#0F172A] rounded-xl p-4 flex items-center justify-between opacity-60 hover:opacity-80 cursor-not-allowed transition-all">
                     <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-bold text-xs uppercase">{item.label}</span>
                     </div>
                     <span className="text-[8px] font-black bg-[#E7E5D8] px-1.5 py-0.5 rounded text-[#0F172A]">{item.status}</span>
                  </div>
               ))}
            </div>
         </div>

      </div>

      {/* FOOTER */}
      <footer className="py-8 text-center border-t-[3px] border-[#0F172A] bg-white mt-12">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">
           Session Secure • DAWGHub OS v2.0
        </p>
      </footer>

    </main>
  );
}
