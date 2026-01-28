import Image from "next/image";
import Link from "next/link";
import { searchDrama } from "@/lib/api";
import SearchBar from "@/components/SearchBar"; // Import komponen baru

export const dynamic = 'force-dynamic'; // WAJIB biar search selalu fresh

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#e5e5e5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" font-weight="800" fill="#171717">BUTTERHUB</text></svg>`);

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q || "";
  const results = query ? await searchDrama(query) : [];

  return (
    <main className="min-h-dvh bg-[#F4F4F0] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header dengan Search Bar Aktif */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border-[3px] border-[#171717] shadow-[6px_6px_0px_#171717]">
          <div className="flex items-center gap-4">
            <Link href="/dracin" className="font-black text-sm border-2 border-[#171717] px-2 py-1 bg-white hover:bg-[#171717] hover:text-white transition-all">← BACK</Link>
            <h1 className="text-xl md:text-3xl font-black uppercase italic">
              {query ? `Search: "${query}"` : "Search Drama"}
            </h1>
          </div>
          
          {/* Komponen Client Side Search */}
          <SearchBar placeholder="Ketik judul drama..." />
        </header>

        {/* Hasil Pencarian */}
        {query && results.length === 0 ? (
          <div className="text-center py-20 opacity-50 font-bold text-xl uppercase">
            NO RESULTS FOUND FOR "{query}" 💀
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((d: any) => (
              <Link key={d.id} href={`/dracin/${d.id}`} className="group block">
                <div className="bg-white border-[3px] border-[#171717] shadow-[5px_5px_0px_#171717] group-hover:-translate-y-1 transition-all overflow-hidden">
                  <div className="aspect-[3/4] relative border-b-2 border-[#171717]">
                    <Image src={d.cover_url || FALLBACK} alt={d.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="p-3">
                    <h3 className="font-black text-xs truncate uppercase">{d.title}</h3>
                    <div className="flex justify-between items-center mt-2 border-t-2 border-[#171717]/10 pt-2">
                        <span className="text-[10px] font-bold opacity-60">{d.total_ep} EP</span>
                        <span className="text-[10px] font-black text-[#171717] uppercase">WATCH</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
