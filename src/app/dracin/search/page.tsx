import Link from "next/link";
import Image from "next/image";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";
import { searchDrama } from "@/lib/api";

// Search gak boleh dicache (Realtime)
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || "";
  const results = query ? await searchDrama(query) : [];

  return (
    <main className="min-h-dvh bg-bg text-main p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dracin">
            <BrutButton variant="secondary" className="px-3 py-1 text-xs">
              &larr; BACK
            </BrutButton>
          </Link>
          <h1 className="text-2xl md:text-3xl font-black uppercase">
            SEARCH: <span className="text-accent">"{query}"</span>
          </h1>
        </div>
        
        {/* Search Bar Ulang */}
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

      {/* RESULTS GRID */}
      <div className="max-w-7xl mx-auto">
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
            <div className="text-6xl mb-4">🕵️‍♂️</div>
            <h2 className="text-2xl font-black uppercase">Tidak Ditemukan</h2>
            <p className="font-bold">Coba kata kunci lain, Commander.</p>
          </div>
        )}
      </div>
    </main>
  );
}
