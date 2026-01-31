import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client-movie";

const prisma = new PrismaClient();

// Fungsi Fetch Data (ROBUST: Cek dengan & tanpa garis miring belakang)
async function getMovie(targetUrl: string) {
  // Buat versi tanpa slash belakang
  const urlNoSlash = targetUrl.replace(/\/$/, "");

  const movie = await prisma.movies.findFirst({
    where: {
      OR: [
        { url: targetUrl },       // Cek persis
        { url: urlNoSlash },      // Cek tanpa slash
        { url: urlNoSlash + "/" } // Cek pakai slash
      ]
    }
  });
  return movie;
}

// Perhatikan tipe params: slug sekarang string[] (Array)
export default async function MoviePlayerPage({ params }: { params: { slug: string[] } }) {
  let cleanUrl = "";

  // LOGIC REKONSTRUKSI URL
  // Jika Next.js memecah URL jadi array (karena ada slash), kita gabung balik.
  if (Array.isArray(params.slug)) {
    // Contoh: ['http:', '', '178.62...', 'judul'] -> join jadi "http://178.62.../judul"
    cleanUrl = params.slug.join('/');
    
    // Kadang decodeURIComponent masih dibutuhkan kalau ada karakter spesial lain
    cleanUrl = decodeURIComponent(cleanUrl);
  } else {
    // Jaga-jaga kalau cuma 1 segmen
    cleanUrl = decodeURIComponent(params.slug);
  }

  // Cari di DB
  const movie = await getMovie(cleanUrl);

  if (!movie) {
    return notFound();
  }

  // --- RENDERING PAGE (Sama kayak sebelumnya) ---
  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans pb-24">
      
      <header className="sticky top-0 z-50 bg-[#FFFDF7]/95 backdrop-blur border-b-[3px] border-[#0F172A] px-6 py-4 flex items-center gap-4">
         <Link href="/movie-hub" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-lg flex items-center justify-center text-white font-black hover:scale-105 transition-transform">
            ←
         </Link>
         <h1 className="text-lg font-black italic uppercase truncate w-full">
            {movie.title}
         </h1>
      </header>

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
              <h1 className="text-2xl md:text-3xl font-black uppercase italic mb-4">
                {movie.title}
              </h1>
              <p className="text-sm font-medium opacity-80 leading-relaxed border-l-4 border-[#CBEF43] pl-4 italic">
                {movie.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
             <div className="aspect-[2/3] relative border-[4px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[8px_8px_0px_#2EC4B6] bg-[#0F172A]">
                <Image 
                  src={movie.poster || "https://via.placeholder.com/300x450"} 
                  alt={movie.title || "Poster"} 
                  fill 
                  className="object-cover"
                  unoptimized
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
