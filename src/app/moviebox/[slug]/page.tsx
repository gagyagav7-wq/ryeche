import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// --- DECODER & DB SEARCH ---
function decodeSafeId(encoded: string) {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch (e) {
    return null;
  }
}

async function getMovie(targetUrl: string) {
  // Cari Exact Match atau Tanpa Slash
  const urlClean = targetUrl.replace(/\/$/, "");
  return await prisma.movies.findFirst({
    where: {
      OR: [
        { url: targetUrl },
        { url: urlClean },
        { url: urlClean + "/" }
      ]
    }
  });
}

export default async function MoviePlayerPage({ params }: { params: { slug: string } }) {
  // Decode ID dari URL
  const originalUrl = decodeSafeId(params.slug);
  
  if (!originalUrl) return notFound();

  // Cari di Database Lu
  const movie = await getMovie(originalUrl);

  if (!movie) return notFound();

  // --- RENDER PLAYER ---
  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#FFFDF7]/95 backdrop-blur border-b-[3px] border-[#0F172A] px-6 py-4 flex items-center gap-4">
         <Link href="/moviebox" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-lg flex items-center justify-center text-white font-black hover:scale-105 transition-transform">
            ←
         </Link>
         <h1 className="text-lg font-black italic uppercase truncate w-full">
            {movie.title}
         </h1>
      </header>

      {/* PLAYER AREA */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video bg-black border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF9F1C] rounded-[20px] overflow-hidden">
               <iframe 
                 src={movie.video || ""} 
                 className="w-full h-full"
                 allowFullScreen
                 scrolling="no"
                 frameBorder="0"
               ></iframe>
            </div>
            <div className="bg-white border-[3px] border-[#0F172A] p-6 rounded-[20px] shadow-[6px_6px_0px_#0F172A]">
              <h1 className="text-2xl font-black uppercase italic mb-4">{movie.title}</h1>
              <p className="text-sm font-medium opacity-80 italic border-l-4 border-[#CBEF43] pl-4">
                {movie.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
             <div className="aspect-[2/3] relative border-[4px] border-[#0F172A] rounded-[20px] overflow-hidden bg-[#0F172A]">
                <Image 
                  src={movie.poster || "https://via.placeholder.com/300x450"} 
                  alt={movie.title || "Poster"} 
                  fill className="object-cover" unoptimized
                />
             </div>
             <a href={movie.video || "#"} target="_blank" className="block w-full py-4 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-xl font-black uppercase text-center shadow-[4px_4px_0px_#0F172A] hover:translate-y-1 hover:shadow-none transition-all">
                Download / Source
             </a>
          </div>
        </div>
      </div>
    </main>
  );
}
