import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// PENTING: Kita import dari client KHUSUS MOVIE yang baru lu generate
import { PrismaClient } from "@prisma/client-movie";

const prisma = new PrismaClient();

// Fungsi ambil data dari DB Movie
async function getMovie(slug: string) {
  // Kita cari yang URL-nya mengandung slug tersebut
  // Contoh: slug "they-were-witches" akan match dengan "http://.../they-were-witches-2025/"
  const movie = await prisma.movies.findFirst({
    where: {
      url: {
        contains: slug 
      }
    }
  });
  return movie;
}

export default async function MoviePlayerPage({ params }: { params: { slug: string } }) {
  const cleanSlug = decodeURIComponent(params.slug);
  const movie = await getMovie(cleanSlug);

  if (!movie) {
    return notFound();
  }

  // Bersihin Tags (misal "Country-Mexico" jadi "Mexico")
  const tags = movie.tags 
    ? movie.tags.split(',').map(t => t.replace('Country-', '').trim()).filter(t => t !== "")
    : ["Movie"];

  return (
    <main className="min-h-screen bg-[#FFFDF7] text-[#0F172A] font-sans pb-24">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#FFFDF7]/95 backdrop-blur border-b-[3px] border-[#0F172A] px-4 py-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Link href="/movie-hub" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-lg flex items-center justify-center text-white font-black hover:-translate-y-1 hover:shadow-[3px_3px_0px_#0F172A] transition-all">
               ←
            </Link>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">
                BUTTER<span className="text-[#FF708D]">HUB</span> MOVIE
            </h1>
         </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PLAYER SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video bg-black border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF9F1C] rounded-[20px] overflow-hidden">
               {/* IFRAME MASKING: Vidhide jalan di domain lu */}
               <iframe 
                 src={movie.video || ""} 
                 className="w-full h-full"
                 allowFullScreen
                 scrolling="no"
                 frameBorder="0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               ></iframe>
            </div>

            {/* JUDUL & INFO */}
            <div className="bg-white border-[3px] border-[#0F172A] p-6 rounded-[20px] shadow-[6px_6px_0px_#0F172A]">
              <h1 className="text-2xl md:text-3xl font-black uppercase italic leading-none mb-4">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                 {tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-[#0F172A] text-white text-[10px] font-bold uppercase rounded-md">
                      {tag}
                    </span>
                 ))}
              </div>
              <p className="text-sm font-medium opacity-80 leading-relaxed border-l-4 border-[#CBEF43] pl-4 italic">
                {movie.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>

          {/* SIDEBAR: POSTER */}
          <div className="space-y-6">
             <div className="aspect-[2/3] relative border-[4px] border-[#0F172A] rounded-[20px] overflow-hidden shadow-[8px_8px_0px_#2EC4B6]">
                <Image 
                  src={movie.poster || "https://via.placeholder.com/300x450"} 
                  alt="Poster" 
                  fill 
                  className="object-cover"
                  unoptimized // Wajib on biar gambar luar muncul
                />
             </div>
             
             {/* CONTOH TOMBOL DOWNLOAD (Hiasan/Link Asli) */}
             <a href={movie.video} target="_blank" className="block w-full py-3 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-xl font-black uppercase text-center shadow-[4px_4px_0px_#0F172A] hover:translate-y-1 hover:shadow-none transition-all">
                Source Link 🔗
             </a>
          </div>

        </div>
      </div>
    </main>
  );
}
