import Link from "next/link";
import Image from "next/image";
import { PrismaClient } from "@prisma/client-movie";

// Inisialisasi Prisma Client Khusus Movie
const prisma = new PrismaClient();

// Fungsi Helper: Bikin Slug dari URL Database
// Contoh: "http://.../judul-film-2025/" -> "judul-film-2025"
function getSlug(url: string) {
  try {
    const parts = url.split('/').filter(p => p !== "");
    return parts[parts.length - 1] || "#";
  } catch (e) {
    return "#";
  }
}

// Fungsi Fetch Data dari DB Lokal (Server Side)
async function getMovies(query?: string) {
  // Config pencarian
  const whereClause = query ? {
    title: {
      contains: query // Cari judul yang mengandung query
    }
  } : {};

  return await prisma.movies.findMany({
    where: whereClause,
    take: 25, // Limit 25 film biar enteng
    orderBy: {
      // Karena ga ada kolom created_at, kita sort default aja
      // Kalau mau random bisa pake raw query, tapi ini cukup buat sekarang
      title: 'asc' 
    }
  });
}

// Helper Extract Tags
function parseTags(tagString: string | null) {
  if (!tagString) return ["MOVIE"];
  return tagString.split(',').map(t => t.replace('Country-', '').trim()).slice(0, 2);
}

export default async function MovieHubPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const movies = await getMovies(query);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] pb-24 font-sans">
      
      {/* 1. STICKY TOPBAR DENGAN SEARCH (SERVER FORM) */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b-[3px] border-[#0F172A] py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/dashboard" className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-xl flex items-center justify-center text-white shadow-[3px_3px_0px_#0F172A] hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic uppercase leading-none tracking-tighter">
              MOVIE <span className="text-[#FF708D]">HUB</span>
            </h1>
            <span className="text-[8px] font-black uppercase opacity-40 tracking-widest mt-1">Lokal Database v1.0</span>
          </div>
        </div>

        {/* Search Bar Brutal (Form Submit) */}
        <div className="relative w-full md:w-[400px]">
          <form action="/movie-hub" method="get">
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="Cari judul film... (Enter)" 
              className="w-full pl-6 pr-4 py-2.5 bg-white border-[3px] border-[#0F172A] rounded-full font-bold text-sm focus:outline-none focus:border-[#FF708D] focus:shadow-[4px_4px_0px_#FF708D] transition-all placeholder:text-gray-300"
            />
          </form>
        </div>
      </header>

      {/* 2. TAB NAVIGATION (Static Links for Style) */}
      <nav className="max-w-7xl mx-auto px-6 mt-10 flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'home', label: 'Latest Drop', color: 'bg-[#2EC4B6]' },
          { id: 'trending', label: 'Hot Ranking', color: 'bg-[#FF9F1C]' },
          { id: 'vip', label: 'VIP Access', color: 'bg-[#FF99C8]' },
        ].map((t) => (
          <Link 
            key={t.id} 
            href="/movie-hub"
            className={`px-6 py-2.5 rounded-full border-[3px] border-[#0F172A] font-black uppercase text-[10px] tracking-wider transition-all shadow-[4px_4px_0px_#0F172A] whitespace-nowrap bg-white hover:bg-gray-50`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {/* 3. SECTION HEADER */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-end gap-3 mb-10 border-b-[3px] border-[#0F172A] pb-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            {query ? `Searching: "${query}"` : 'Fresh Drops 🕒'}
          </h2>
          <span className="text-[10px] font-bold opacity-30 mb-1 uppercase tracking-tighter">{movies.length} TITLES FOUND</span>
        </div>

        {/* 4. GRID CONTENT */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
            {movies.map((m) => {
              const slug = getSlug(m.url);
              const tags = parseTags(m.tags);
              
              return (
                <Link key={m.url} href={`/movie/${slug}`} className="trop-card group bg-white border-[4px] border-[#0F172A] rounded-[28px] overflow-hidden shadow-[8px_8px_0px_#0F172A] hover:-translate-y-1.5 hover:shadow-[12px_12px_0px_#FF708D] transition-all duration-300">
                  <div className="aspect-[3/4] relative border-b-[4px] border-[#0F172A] bg-[#E7E5D8]">
                    <Image 
                      src={m.poster || "https://via.placeholder.com/300x450"} 
                      alt={m.title || "Movie"} 
                      fill 
                      className="object-cover" 
                      unoptimized // Penting buat bypass domain check
                    />
                    <div className="absolute top-4 right-4 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-0.5 text-[10px] font-black shadow-sm rounded-md">
                      HD
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="font-black text-sm uppercase line-clamp-2 leading-tight group-hover:text-[#FF708D] transition-colors">
                      {m.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[8px] font-black uppercase bg-[#0F172A] text-white px-2 py-0.5 rounded-sm">
                        {tags[0]}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center bg-white border-[4px] border-[#0F172A] rounded-[32px] shadow-[12px_12px_0px_#FF708D]">
            <p className="text-3xl font-black uppercase italic opacity-20">No Movies found.</p>
            {query && (
              <Link href="/movie-hub" className="inline-block mt-4 text-xs font-bold underline">
                Reset Search
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
