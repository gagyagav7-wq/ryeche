import Link from "next/link";
import Image from "next/image";
import { searchDrama } from "@/lib/api";

// Caching: Biar fetch API yang nentuin (no-store), page gak usah maksa SSR berat
// Hapus 'export const dynamic = "force-dynamic";'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // FIX: Normalize searchParams (Handle array/undefined)
  const qRaw = searchParams?.q;
  const query = Array.isArray(qRaw) ? qRaw[0] : (qRaw || "");
  
  const results = query ? await searchDrama(query) : [];

  return (
    <main className="min-h-dvh bg-bg text-main p-4 md:p-8 relative overflow-hidden">
      {/* Decorative BG (FIX: pointer-events-none WAJIB) */}
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 md:w-96 md:h-96 bg-[#A8E6CF] rounded-full border-[3px] border-main opacity-40 -z-10 pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-[#FDFFB6] border-[3px] border-main rotate-12 opacity-40 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link href="/dracin">
            {/* FIX: md:hover biar gak nyangkut di iOS */}
            <span className="inline-block px-3 py-1 text-xs font-black border-[3px] border-main bg-white md:hover:bg-main md:hover:text-white transition-colors cursor-pointer">
              &larr; BACK
            </span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black uppercase">
            SEARCH: <span className="text-accent">"{query}"</span>
          </h1>
        </div>
        
        <form action="/dracin/search" className="flex gap-2 w-full md:w-auto">
          <input
            name="q"
            defaultValue={query}
            placeholder="Cari lagi..."
            className="bg-white border-[3px] border-main p-2 font-bold text-sm w-full md:w-64 focus:ring-4 focus:ring-accent/20 outline-none"
          />
          <button type="submit" className="bg-accent text-white border-[3px] border-main px-4 font-black shadow-sm active:translate-y-1">
            🔍
          </button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((d: any) => (
              <Link
                key={d.id}
                href={`/dracin/${d.id}`}
                className="group block outline-none focus-visible:ring-4 focus-visible:ring-accent"
              >
                <div className="h-full bg-white border-[3px] border-main shadow-brut transition-all md:hover:-translate-y-1 md:hover:shadow-[6px_6px_0px_0px_#171717]">
                  <div className="aspect-[3/4] bg-gray-200 relative border-b-[3px] border-main">
                    <Image
                      src={d.cover_url || "/placeholder.jpg"}
                      alt={d.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-xs md:text-sm truncate uppercase text-main">
                      {d.title}
                    </h3>
                    <div className="mt-2 flex justify-between items-center border-t-2 border-main/10 pt-2">
                       <span className="text-[10px] font-bold opacity-60">{d.total_ep ? `${d.total_ep} EPS` : "ONGOING"}</span>
                       <span className="text-[10px] font-black text-accent">WATCH</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <h2 className="text-2xl font-black uppercase">Tidak Ditemukan</h2>
            <p className="font-bold">Coba kata kunci lain, Commander.</p>
          </div>
        )}
      </div>
    </main>
  );
}
