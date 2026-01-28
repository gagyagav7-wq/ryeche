"use client";
import Link from "next/link";
import { useState } from "react";

// ICONS
const IconBolt = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconPaste = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const IconDownload = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

export default function DownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if(!url) return;
    setLoading(true);
    // Simulasi loading
    setTimeout(() => {
        setLoading(false);
        alert("Fitur Download Backend belum disambung, Bre! Tapi UI udah ganteng.");
    }, 1500);
  };

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2EC4B6] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF9F1C] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      {/* HEADER & NAV */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
         <Link href="/dashboard" className="inline-flex items-center gap-2 font-black uppercase text-xs border-[3px] border-[#0F172A] px-4 py-2 rounded-full bg-white hover:bg-[#0F172A] hover:text-white transition-colors">
            &larr; Back to Hub
         </Link>
      </div>

      {/* MAIN CARD: TROPICAL ISLAND STYLE */}
      <div className="w-full max-w-2xl bg-white border-[3px] border-[#0F172A] rounded-[24px] shadow-[8px_8px_0px_#0F172A] overflow-hidden relative z-10">
         
         {/* Card Header */}
         <div className="bg-[#2EC4B6] p-8 md:p-10 text-center border-b-[3px] border-[#0F172A] relative">
            <div className="inline-block bg-white border-[3px] border-[#0F172A] p-4 rounded-full shadow-[4px_4px_0px_#0F172A] mb-4">
                <span className="text-[#0F172A]"><IconBolt /></span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-white drop-shadow-md mb-2">
                Universal Downloader
            </h1>
            <p className="text-white font-bold opacity-90 text-sm md:text-base max-w-md mx-auto">
                Paste link TikTok, Instagram, atau YouTube kamu di bawah ini.
            </p>
         </div>

         {/* Card Body: The Form */}
         <div className="p-8 md:p-12 bg-white">
            <form onSubmit={handleDownload} className="flex flex-col gap-6">
                
                {/* Input Field */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-40">
                        <IconPaste />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Tempel link video di sini..." 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-5 bg-[#F4F1EA] border-[3px] border-[#0F172A] rounded-xl font-bold text-[#0F172A] placeholder:opacity-40 focus:outline-none focus:bg-[#FFF] focus:shadow-[4px_4px_0px_#2EC4B6] transition-all"
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading || !url}
                    className="w-full py-5 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl font-black uppercase text-white shadow-[4px_4px_0px_#0F172A] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#0F172A] active:translate-y-[2px] active:shadow-[0px_0px_0px_#0F172A] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>
                           <span>Download Now</span>
                           <IconDownload />
                        </>
                    )}
                </button>

            </form>

            {/* Supported Platform Badges */}
            <div className="mt-8 pt-8 border-t-[2px] border-dashed border-gray-200 text-center">
                <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest">Supported Platforms</p>
                <div className="flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                    {['TikTok', 'Instagram', 'YouTube', 'Facebook'].map(p => (
                        <span key={p} className="px-3 py-1 bg-[#F4F1EA] rounded-md text-[10px] font-bold border border-[#0F172A]">{p}</span>
                    ))}
                </div>
            </div>

         </div>

      </div>

      <footer className="mt-12 text-center opacity-40">
         <p className="font-mono text-[10px] font-bold uppercase tracking-widest">
            ButterHub Tools v1.0 • No Watermark
         </p>
      </footer>

    </main>
  );
}
