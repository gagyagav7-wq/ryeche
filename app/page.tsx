import BrutButton from "@/components/BrutButton";
import BrutCard from "@/components/BrutCard";

export default function Home() {
  return (
    // layout-container handle min-h-dvh dan safe-area padding
    <main className="layout-container p-4 md:p-8 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
      
      {/* Decorative Blobs (Absolute) */}
      <div className="absolute top-10 left-[-20px] md:left-10 w-16 h-16 md:w-20 md:h-20 bg-accent-2 border-brut border-main rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-[-10px] md:right-10 w-24 h-24 md:w-32 md:h-32 bg-accent border-brut border-main -z-10 rotate-12" />

      {/* Hero Section */}
      <section className="max-w-2xl w-full text-center space-y-6 z-10 mt-10 md:mt-0">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] drop-shadow-sm">
          Tip Jar <br/>
          {/* Efek highlight stabilo */}
          <span className="bg-accent px-2 md:px-4 border-brut border-main -rotate-2 inline-block mt-2">
            Creamy
          </span>
        </h1>
        
        <p className="text-lg md:text-xl font-medium border-l-[3px] border-main pl-4 text-left bg-surface p-4 shadow-brut-sm mx-2 md:mx-0">
          Sawer creator favorit lu tanpa ribet. 
          Style <span className="font-black">Neo-Brutalism</span> yang 
          <span className="italic"> satisfying</span> di mata.
        </p>

        {/* Action Buttons (Sekarang pake href props) */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4 md:pt-8 w-full md:w-auto px-4 md:px-0">
          <BrutButton href="/creator/johndoe" variant="primary" fullWidth>
            Cari Creator
          </BrutButton>
          <BrutButton href="/dashboard" variant="secondary" fullWidth>
            Buat Halaman
          </BrutButton>
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-8 md:mt-12 px-2 md:px-0">
        
        <BrutCard title="Top Donors 🔥">
          <ul className="space-y-3">
            <li className="flex justify-between font-bold border-b-[3px] border-main border-dotted pb-2 items-center">
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 bg-accent rounded-full border-2 border-main block"></span>
                @crypto_king
              </span> 
              <span className="bg-main text-white px-2 py-0.5 text-sm">Top 1</span>
            </li>
            <li className="flex justify-between font-bold pb-2">
              <span className="opacity-70">@design_gurl</span> <span>$250</span>
            </li>
          </ul>
        </BrutCard>

        <BrutCard title="Goal: PC Baru 🖥️" className="bg-accent-2">
          <div className="space-y-2">
            <div className="flex justify-between font-black text-sm uppercase">
              <span>Progress</span>
              <span>75%</span>
            </div>
            {/* Custom Progress Bar Brutal */}
            <div className="w-full h-8 border-brut border-main bg-white relative">
              <div 
                className="absolute top-0 left-0 h-full bg-accent border-r-[3px] border-main transition-all duration-1000" 
                style={{ width: '75%' }}
              >
                {/* Pattern garis miring di dalam progress bar */}
                <div className="w-full h-full opacity-20" 
                     style={{backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px'}}>
                </div>
              </div>
            </div>
            <p className="text-xs font-bold text-right mt-1">$750 / $1000</p>
          </div>
        </BrutCard>

      </div>
    </main>
  );
}
