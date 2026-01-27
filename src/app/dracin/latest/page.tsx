import Link from "next/link";
import Image from "next/image";
import { getLatest } from "@/lib/api";

export const revalidate = 60;

export default async function LatestPage() {
  const items = await getLatest().catch(() => []);

  return (
    <main className="min-h-dvh bg-bg text-main p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
        <Link href="/dracin">
           <span className="px-3 py-1 text-xs font-black bg-white border-[3px] border-main cursor-pointer hover:bg-surface">&larr; BACK</span>
        </Link>
        <h1 className="text-3xl font-black uppercase">🆕 FRESH DROP</h1>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((d: any) => (
           <Link key={d.id} href={`/dracin/${d.id}`} className="group block">
             <div className="bg-white border-[3px] border-main shadow-brut transition-all md:hover:-translate-y-1">
               <div className="aspect-[3/4] bg-gray-200 relative border-b-[3px] border-main">
                  <Image src={d.cover_url || "/placeholder.jpg"} alt={d.title} fill className="object-cover" unoptimized />
               </div>
               <div className="p-3"><h3 className="font-bold text-sm truncate uppercase">{d.title}</h3></div>
             </div>
           </Link>
        ))}
      </div>
    </main>
  );
}
