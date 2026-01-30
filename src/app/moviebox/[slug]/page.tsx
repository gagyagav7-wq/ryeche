import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client-movie";

// --- ICONS ---
const IconBack = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>;
const IconDownload = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

// Inisialisasi Prisma
const prisma = new PrismaClient();

// Fungsi Fetch Data
async function getMovie(slug: string) {
  const movie = await prisma.movies.findFirst({
    where: {
      url: { contains: slug }
    }
  });
  return movie;
}

export default async function MoviePlayerPage({ params }: { params: { slug: string } }) {
  const cleanSlug = decodeURIComponent(params.slug);
  const movie = await getMovie(cleanSlug);

  if (!movie) return notFound();

  // --- BAGIAN INI YANG TADI ERROR ---
  // Kita hardcode aja karena kolom tags gak ada di DB
  const tags = ["MOVIE", "HD"]; 

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans selection:bg-[#FF9F1C] pb-24">
      
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.6%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* HEADER NAV */}
      <header className="sticky top-0 z-50 bg-[#FFFDF7]/90 backdrop-blur-md border-b-[3px] border-[#0F172A] py-3 px-4 lg:px-8 shadow-sm">
         <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Link href="/movie-hub" className="group flex items-center gap-2 font-black uppercase text-xs border-[2px] border-[#0F172A] px-4 py-2 rounded-lg bg-white hover:bg-[#FF9F1C] hover:text-white hover:shadow-[3px_3px_0px_#0F172A] hover:-translate-y-[2px] transition-all">
                 <IconBack />
                 <span className="hidden md:inline">Back to Hub</span>
            </Link>
            <div className="flex-grow overflow-hidden">
                 <h1 className="font-black uppercase text-lg md:text-xl whitespace-nowrap overflow-hidden text-ellipsis text-[#0F172A]">
                    {movie.title}
                 </h1>
                 <p className="text-[10px] font-bold text-[#FF9F1C] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Now Playing: Full Movie
                 </p>
            </div>
         </div>
      </header>

      {/* VIDEO PLAYER AREA */}
      <section className="relative z-10 max-w-5xl mx-auto mt-6 lg:mt-10 px-4">
        <div className="w-full aspect-video bg-[#000] relative rounded-xl overflow-hidden border-[3px] border-[#0F172A] shadow-[8px_8px_0px_#0F172A]">
           <iframe 
             src={movie.video || ""} 
             className="w-full h-full"
             allowFullScreen
             scrolling="no"
             frameBorder="0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           ></iframe>
        </div>
      </section>

      {/* INFO & CONTROL CONTAINER */}
      <section className="relative z-10 max-w-5xl mx-auto p-4 lg:px-0 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* KIRI: Detail Movie */}
        <div className="lg:col-span-2 bg-white border-[3px] border-[#0F172A] rounded-2xl p-6 shadow-[4px_4px_0px_#0F172A]">
            <h2 className="text-3xl font-black uppercase text-[#0F172A] leading-none mb-4">
                {movie.title}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
               {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-[#FF9F1C] text-white border-[2px] border-[#0F172A] rounded-md text-[10px] font-black uppercase shadow-[2px_2px_0px_#0F172A]">
                    {tag}
                  </span>
               ))}
            </div>
            
            <div className="bg-[#FFFDF7] p-4 rounded-xl border-[2px] border-[#0F172A]/10">
                <h3 className="text-xs font-black uppercase mb-2 opacity-50 tracking-widest">Plot Summary</h3>
                <p className="text-sm opacity-80 leading-relaxed font-medium">
                {movie.synopsis || "No synopsis available for this title."}
                </p>
            </div>
        </div>

        {/* KANAN: Cinema Control */}
        <div className="bg-[#0F172A] p-4 rounded-2xl border-[3px] border-[#0F172A] shadow-[4px_4px_0px_#0F172A] lg:sticky lg:top-24 space-y-4">
           <div className="flex justify-between items-center pb-2 border-b-2 border-white/10">
                <h3 className="font-black uppercase text-xs text-white tracking-widest">
                    Cinema Deck
                </h3>
           </div>
           
           <div className="aspect-[2/3] relative rounded-lg overflow-hidden border-2 border-white/20">
               <Image 
                 src={movie.poster || "https://via.placeholder.com/300x450"} 
                 alt="Poster" 
                 fill 
                 className="object-cover"
                 unoptimized
               />
           </div>

           <a 
             href={movie.video || "#"} 
             target="_blank"
             className="flex items-center justify-center gap-3 w-full py-3 bg-[#CBEF43] border-[2px] border-white/20 rounded-lg text-[#0F172A] font-black uppercase text-xs shadow-[4px_4px_0px_#FF9F1C] hover:translate-y-1 hover:shadow-none transition-all"
           >
              <IconDownload />
              Original Source
           </a>

           <div className="text-[10px] text-white/40 text-center font-mono">
             ID: {movie.url}
           </div>
        </div>

      </section>
    </main>
  );
}
