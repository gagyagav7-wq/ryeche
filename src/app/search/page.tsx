import BrutCard from "@/components/BrutCard";
import Link from "next/link";
import { searchDrama } from "@/lib/api";

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q;
  const results = await searchDrama(query);

  return (
    <main className="layout-container p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-black uppercase">
        Hasil: <span className="text-accent bg-main text-white px-2">{query}</span>
      </h1>

      {results.length === 0 ? (
        <div className="text-center font-bold py-10 opacity-50">Zonk. Gak nemu apa-apa.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((d) => (
            <Link key={d.id} href={`/drama/${d.id}`}>
              <BrutCard className="h-full hover:translate-y-[-4px] transition-transform">
                <div className="font-bold truncate">{d.title}</div>
              </BrutCard>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
