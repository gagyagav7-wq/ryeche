import BrutButton from "@/components/BrutButton";
import BrutCard from "@/components/BrutCard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-accent-2 border-brut border-main rounded-full -z-10" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent border-brut border-main -z-10 rotate-12" />

      <section className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
          Tip Jar <br/>
          <span className="bg-accent px-4 border-brut border-main rotate-2 inline-block">Creamy</span>
        </h1>
        
        <p className="text-xl font-medium border-l-4 border-main pl-4 text-left bg-white p-4 shadow-brut-sm">
          Platform donasi simpel dengan gaya <span className="font-bold">Neo-Brutalism</span>. 
          Tanpa ribet, langsung cair, estetik parah.
        </p>

        <div className="flex gap-4 justify-center pt-8">
          <Link href="/creator/johndoe">
            <BrutButton variant="primary">Cari Creator</BrutButton>
          </Link>
          <Link href="/dashboard">
            <BrutButton variant="secondary">Buat Halaman</BrutButton>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-12">
        <BrutCard title="Top Donors">
          <ul className="space-y-3">
            <li className="flex justify-between font-bold border-b-2 border-main border-dotted pb-2">
              <span>@crypto_king</span> <span>$500</span>
            </li>
            <li className="flex justify-between font-bold border-b-2 border-main border-dotted pb-2">
              <span>@design_gurl</span> <span>$250</span>
            </li>
            <li className="flex justify-between font-bold">
              <span>@anon_123</span> <span>$100</span>
            </li>
          </ul>
        </BrutCard>

        <BrutCard title="Goal: PC Baru" className="bg-accent-2">
          <div className="w-full h-8 border-brut border-main bg-white mb-2 relative">
            <div className="absolute top-0 left-0 h-full bg-accent w-[75%] border-r-brut border-main"></div>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span>$750 terkumpul</span>
            <span>Target $1000</span>
          </div>
        </BrutCard>
      </div>
    </main>
  );
}
