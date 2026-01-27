import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";
import { searchDrama } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  // Kita paksa tipe-nya jadi any[] biar aman
  const results: any[] = await searchDrama(query);

  return (
    <main className="layout-container p-4 md:p-8 space-y-8">
      <header className="flex items-center justify-between border-b-brut border-main pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase">
            HASIL: <span className="bg-black text-white px-2">{query}</span>
          </h1>
          <p className="font-bold opacity-70 mt-1">
            Ditemukan {results.length} drama
          </p>
        </div>
        <Link href="/">
          <BrutButton variant="secondary">KEMBALI</BrutButton>
        </Link>
      </header>

      {results.length === 0 ? (
        <div className="text-center py-20 opacity-50 font-bold text-xl">
          Zonk. Gak nemu apa-apa.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* FIX: Kasih tipe 'any' ke si 'd' biar TS diem */}
          {results.map((d: any) => (
            <Link key={d.id} href={`/drama/${d.id}`}>
              <BrutCard className="h-full hover:translate-y-[-4px] transition-transform group" noPadding>
                {/* Image Placeholder Sederhana kalau cover gak ada */}
                <div className="aspect-[2/3] bg-gray-300 border-b-brut border-main relative overflow-hidden">
                   {d.cover_url ? (
                      <img 
                        src={d.cover_url} 
                        alt={d.title} 
                        className="w-full h-full object-cover"
                      />
                   ) : (
                      <div className="flex items-center justify-center h-full font-black text-4xl opacity-20">?</div>
                   )}
                </div>
                <div className="p-3">
                  <div className="font-bold truncate text-sm md:text-base group-hover:text-accent transition-colors">
                    {d.title}
                  </div>
                </div>
              </BrutCard>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
