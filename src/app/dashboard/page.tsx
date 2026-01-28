"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

// --- ICONS ---
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M8 5v14l11-7z"/></svg>;
const IconBolt = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconSettings = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconHeart = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

export default function DashboardPage() {
  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#CBEF43]">
      
      {/* BACKGROUND TEXTURE (Polished: Opacity reduced to 0.02 for cleaner look) */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* =======================
          1. TOP BAR (HEADER)
         ======================= */}
      <header className="relative z-10 px-6 py-6 md:px-12 border-b-[3px] border-[#0F172A] bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#FF99C8] border-[3px] border-[#0F172A] rounded-lg flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_#0F172A]">
                B
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tight leading-none">
                   Butter<span className="text-transparent" style={{ WebkitTextStroke: '1.5px #0F172A' }}>Hub</span>
                </h1>
                {/* Polished: Increased opacity for better readability on mobile */}
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">System Control Deck</p>
             </div>
          </div>

          {/* User Session & Logout */}
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#E7E5D8]/30 border border-[#0F172A] rounded-full">
                <span className="w-2 h-2 bg-[#CBEF43] rounded-full animate-pulse border border-[#0F172A]"></span>
                <span className="text-[10px] font-mono font-bold uppercase opacity-80">Session: Active</span>
             </div>
             
             {/* LOGOUT BUTTON CONTAINER */}
             {/* Polished: Reduced shadow to 2px to make it less aggressive than the brand logo */}
             <div className="w-full md:w-auto h-10 border-[3px] border-[#0F172A] rounded-lg bg-white shadow-[2px_2px_0px_#0F172A] hover:translate-y-[1px] hover:shadow-none transition-all active:translate-y-[2px]">
                <LogoutButton />
             </div>
          </div>
        </div>
      </header>

      {/* =======================
          2. MAIN DASHBOARD CONTENT
         ======================= */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-16">
         
         {/* WELCOME BANNER */}
         <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black uppercase mb-2">
               Welcome back, 
               {/* Polished: Changed to Mango Orange to avoid confusion with Teal Downloader */}
               <span className="text-[#FF9F1C] ml-2">Operator.</span>
            </h2>
            {/* Polished: Bumped opacity from 60 to 70 for readability */}
            <p className="text-sm font-bold opacity-70 max-w-xl leading-relaxed">
               Select a module to launch. All systems are running optimally. Enjoy your premium session.
            </p>
         </div>

         {/* --- MODULES GRID --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* 1. DRACIN (Entertainment Module) */}
            <Link href="/dracin" className="group relative bg-white border-[3px] border-[#0F172A] rounded-[20px] p-8 md:p-10 shadow-[6px_6px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300 overflow-hidden">
                {/* Decorative Blob */}
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#FF9F1C] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-8">
                   <div className="w-16 h-16 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#0F172A] group-hover:rotate-6 transition-transform">
                      <span className="text-white"><IconPlay /></span>
                   </div>
                   {/* Badge Logic: Dark Badge on Light Card */}
                   <span className="bg-[#0F172A] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Main App</span>
                </div>

                <h3 className="text-3xl font-black uppercase mb-3 group-hover:underline decoration-4 decoration-[#FF9F1C] underline-offset-4 leading-tight">Dracin Stream</h3>
                <p className="font-medium text-sm opacity-60 mb-8 leading-relaxed">
                   Access the Master Hub. Drama, Movies, and Variety Shows library.
                </p>

                <div className="inline-flex items-center gap-2 font-black uppercase text-xs border-b-[3px] border-[#0F172A] pb-1 group-hover:text-[#FF9F1C] group-hover:border-[#FF9F1C] transition-colors">
                   Launch Application &rarr;
                </div>
            </Link>

            {/* 2. DOWNLOADER (Utility Module) */}
            <Link href="/downloader" className="group relative bg-[#2EC4B6] border-[3px] border-[#0F172A] rounded-[20px] p-8 md:p-10 shadow-[6px_6px_0px_#0F172A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300 overflow-hidden text-white">
                {/* Polished: Reduced texture opacity from 10% to 5% to reduce visual noise */}
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="w-16 h-16 bg-white border-[3px] border-[#0F172A] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_#0F172A] group-hover:-rotate-6 transition-transform">
                      <span className="text-[#0F172A]"><IconBolt /></span>
                   </div>
                   {/* Polished: Toned down badge contrast. Using slightly transparent white bg */}
                   <span className="bg-white/90 text-[#0F172A] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#0F172A]">Utility</span>
                </div>

                <h3 className="relative z-10 text-3xl font-black uppercase mb-3 text-white drop-shadow-md leading-tight">Downloader</h3>
                <p className="relative z-10 font-medium text-sm opacity-90 mb-8 leading-relaxed">
                   Universal tool for TikTok, IG, & YouTube. No Watermark.
                </p>

                <div className="relative z-10 inline-flex items-center gap-2 font-black uppercase text-xs bg-white text-[#0F172A] px-4 py-3 rounded-lg border-[3px] border-[#0F172A] shadow-[3px_3px_0px_#0F172A] group-hover:translate-x-1 transition-transform">
                   Open Tool &rarr;
                </div>
            </Link>

         </div>

         {/* --- QUICK ACCESS (SYSTEM KEYS) --- */}
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
                  <div key={idx} className="bg-white border-[2px] border-[#0F172A] rounded-xl p-4 flex items-center justify-between opacity-60 hover:opacity-100 cursor-not-allowed transition-all">
                     {/* Polished: Removed hover border color change to avoid misleading "clickable" affordance */}
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
        {/* Polished: Increased opacity for footer text */}
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">
           Session Secure • ButterHub OS v2.0
        </p>
      </footer>

    </main>
  );
}
