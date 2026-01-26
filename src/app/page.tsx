import Image from "next/image";
import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";
import { getLatest, getForYou, getHotRank } from "@/lib/api";

// Komponen Grid dipisah biar rapi
const DramaGrid = ({ title, items }: { title: string, items: any[] }) => {
  // --- SAFETY CHECK (AIRBAG) ---
  // Kalau items null/error/bukan array, paksa jadi array kosong biar gak crash
  const safeItems = Array.isArray(items) ? items : [];

  // Opsional: Kalau kosong, gak usah render section ini (biar rapi)
  if (safeItems.length === 0) {
    return (
      <section className="space-y-4 opacity-50">
        <h2 className="text-2xl font-black uppercase">{title} (No Data)</h2>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-4 bg-accent border-brut border-main"></div>
        <h2 className="text-2xl md:text-3xl font-black uppercase">{title}</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* PAKE safeItems, BUKAN items */}
        {safeItems.slice(0, 10).map((d) => (
          <Link 
            key={d.id} 
            href={`/drama/${d.id}`} 
            className="block h-full outline-none focus-visible:ring-4 focus-visible:ring-main/30 rounded-none group"
            aria-label={`Nonton ${d.title}`}
          >
            <BrutCard className="h-full p-0 overflow-hidden relative brut-hover-effect" noPadding>
              <div className="aspect-[2/3] bg-gray-200 relative">
                <Image 
                  src={d.cover_url || "/placeholder.jpg"} 
                  alt={d.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                  unoptimized={true} 
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-surface/90 border-t-brut border-main p-2">
                <h3 className="font-bold text-xs md:text-sm truncate">{d.title}</h3>
              </div>
            </BrutCard>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default async function HomePage() {
  // Fetch paralel biar ngebut
  // KITA TAMBAH CATCH BIAR KALAU SATU ERROR, YANG LAIN TETEP JALAN
  const [latest, forYou, hotRank] = await Promise.all([
    getLatest().catch(() => []), 
    getForYou().catch(() => []), 
    getHotRank().catch(() => [])
  ]);

  return (
    <main className="layout-container p-4 md:p-8 space-y-12">
      {/* Hero / Header */}
      <header className="mb-8">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Flick<span className="text-accent">Reels</span>
        </h1>
        <p className="font-bold text-lg opacity-70">Nonton Drama Gaya Brutal.</p>
        
        {/* Search Bar Simple */}
        <form action="/search" className="mt-6 flex gap-2 max-w-md">
          <input 
            name="q"
            placeholder="Cari drama..." 
            className="flex-1 bg-surface border-brut border-main p-3 font-bold outline-none focus:shadow-brut focus:-translate-y-1 transition-transform"
          />
          <BrutButton type="submit">CARI</BrutButton>
        </form>
      </header>

      {/* Grid Content */}
      <DramaGrid title="Hot Ranking 🔥" items={hotRank} />
      <DramaGrid title="For You ❤️" items={forYou} />
      <DramaGrid title="Latest Uploads 🆕" items={latest} />
    </main>
  );
}
