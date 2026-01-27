import Image from "next/image";
import Link from "next/link";
import { getLatest } from "@/lib/api";

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#e5e5e5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" font-weight="800" fill="#171717">BUTTERHUB</text></svg>`);

const BTN_STYLE = "inline-flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase bg-black text-white px-3 py-2 border-[3px] border-[#171717] shadow-[3px_3px_0px_#171717] md:hover:bg-[#FDFFB6] md:hover:text-[#171717] transition-all active:translate-y-1 active:shadow-none";

export default async function LatestPage() {
  const data = await getLatest().catch(() => []);

  return (
    <main className="min-h-dvh bg-[#F4F4F0] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 border-[3px] border-[#171717] shadow-[6px_6px_0px_#171717]">
          <div className="flex items-center gap-4">
            <Link href="/dracin" className="font-black text-sm border-2 border-[#171717] px-2 py-1 bg-white hover:bg-[#171717] hover:text-white transition-all">← BACK</Link>
            <h1 className="text-xl md:text-3xl font-black uppercase italic">🆕 Latest Drops</h1>
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Link href="/dracin/latest" className={BTN_STYLE}>VIEW ALL →</Link>
            <Link href="/dracin/search" className={BTN_STYLE}>SEARCH</Link>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {data.map((d: any) => (
            <Link key={d.id} href={`/dracin/${d.id}`} className="group block">
              <div className="bg-white border-[3px] border-[#171717] shadow-[5px_5px_0px_#171717] group-hover:-translate-y-1 transition-all overflow-hidden">
                <div className="aspect-[3/4] relative border-b-2 border-[#171717]">
                  <div className="absolute bottom-2 left-2 bg-[#171717] text-white px-2 py-0.5 font-black text-[9px] uppercase z-10 shadow-sm">NEW</div>
                  <Image src={d.cover_url || FALLBACK} alt={d.title} fill className="object-cover" unoptimized />
                </div>
                <div className="p-3">
                  <h3 className="font-black text-xs truncate uppercase">{d.title}</h3>
                  <p className="text-[10px] font-bold opacity-50 mt-1 uppercase">Just Added</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
