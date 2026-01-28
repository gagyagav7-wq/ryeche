const homePath = path.join(__dirname, 'src/app/dracin/page.tsx');
const homeCode = `import Image from "next/image";
import Link from "next/link";
import { getLatest, getForYou, getHotRank } from "@/lib/api";
import SearchBar from "@/components/SearchBar";

export const revalidate = 60;

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="100%" height="100%" fill="#e5e5e5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="32" font-weight="800" fill="#171717">BUTTERHUB</text></svg>');

const VIEW_ALL_STYLE = "inline-flex items-center gap-2 text-[11px] font-black uppercase bg-black text-white px-3 py-2 border-[3px] border-[#171717] shadow-[4px_4px_0px_#171717] md:hover:bg-[#FDFFB6] md:hover:text-[#171717] transition-all active:translate-y-1 active:shadow-none cursor-pointer";

const DramaSection = ({ title, subtitle, items, href }) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="space-y-6 scroll-mt-24 relative z-10">
      <div className="flex justify-between items-end border-b-[3px] border-[#171717] pb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-2 bg-[#FDFFB6] border-[3px] border-[#171717]"></div>
          <div>
            <h2 className="text-2xl md:text-4xl font-black uppercase leading-none tracking-tight">{title}</h2>
            <p className="text-[10px] md:text-sm font-bold opacity-60 uppercase tracking-widest mt-1">{subtitle}</p>
          </div>
        </div>
        <Link href={href} className={VIEW_ALL_STYLE}>VIEW ALL →</Link>
      </div>
      
      {safeItems.length === 0 ? (
        <div className="py-10 text-center opacity-50 font-bold">Belum ada data.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {safeItems.slice(0, 10).map((d) => (
            <Link key={d.id} href={'/dracin/' + d.id} className="group block h-full outline-none">
              <div className="h-full relative overflow-hidden bg-white border-[3px] border-[#171717] shadow-[6px_6px_0px_#171717] transition-all duration-300 md:group-hover:-translate-y-1 md:group-hover:shadow-[8px_8px_0px_#171717]">
                <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden border-b-[3px] border-[#171717]">
                  <Image 
                    src={d.cover_url || FALLBACK} 
                    alt={d.title} 
                    fill 
                    className="object-cover transition-transform duration-500 md:group-hover:scale-105" 
                    unoptimized 
                  />
                  <div className="absolute top-2 right-2 bg-[#171717] text-white text-[9px] font-black px-1.5 py-0.5 border border-white">
                    {d.total_ep ? d.total_ep + ' EP' : 'ONGOING'}
                  </div>
                </div>
                <div className="bg-white p-3">
                  <h3 className="font-black text-xs md:text-sm truncate uppercase text-[#171717]" title={d.title}>{d.title}</h3>
                  <div className="flex justify-between items-center mt-2 border-t-2 border-[#171717]/10 pt-2">
                    <span className="text-[10px] font-bold opacity-60">DRAMA</span>
                    <span className="text-[10px] font-black text-[#171717] uppercase md:group-hover:underline">WATCH</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default async function DracinHomePage() {
  const [latest, forYou, hotRank] = await Promise.all([
    getLatest().catch(() => []), 
    getForYou().catch(() => []), 
    getHotRank().catch(() => [])
  ]);

  const chips = [
    { label: '🔥 Hot Ranking', href: '/dracin/hotrank' },      
    { label: '❤️ For You', href: '/dracin/foryou' },       
    { label: '🆕 Latest Drop', href: '/dracin/latest' },
  ];

  return (
    <main className="min-h-dvh bg-[#F4F4F0] text-[#171717] relative overflow-x-hidden pb-24">
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none -z-20" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 relative z-10">
        <header className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717]">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="px-3 py-1 text-xs font-black border-[3px] border-[#171717] bg-white md:hover:bg-[#171717] md:hover:text-white transition-all">HUB</Link>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">BUTTERHUB / DRACIN</h1>
              </div>
              <p className="text-xs font-bold opacity-50 mt-1 pl-1 hidden md:block">Premium Asian Drama Collection</p>
            </div>
            <SearchBar placeholder="Cari judul drama..." />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
            {chips.map((chip, i) => (
              <Link key={i} href={chip.href} className="whitespace-nowrap px-4 py-2 bg-white border-[3px] border-[#171717] font-black text-[10px] uppercase shadow-[3px_3px_0px_#171717] md:hover:translate-y-[-2px] md:hover:shadow-[5px_5px_0px_#171717] transition-all active:translate-y-0 active:shadow-none">
                {chip.label}
              </Link>
            ))}
          </div>
        </header>

        <DramaSection title="Hot Ranking 🔥" subtitle="Top 10 Most Watched" items={hotRank} href="/dracin/hotrank" />
        <DramaSection title="For You ❤️" subtitle="Curated picks just for you" items={forYou} href="/dracin/foryou" />
        <DramaSection title="Fresh Drop 🆕" subtitle="Just uploaded this week" items={latest} href="/dracin/latest" />
      </div>
    </main>
  );
};`;

fs.writeFileSync(homePath, homeCode, { encoding: 'utf8' });
console.log("SUCCESS! Restored Home Page at: " + homePath);


// --- 2. FIX DETAIL PAGE (Player) ---
const detailDir = path.join(__dirname, 'src/app/dracin/[id]');
if (!fs.existsSync(detailDir)){
    fs.mkdirSync(detailDir, { recursive: true });
}
const detailPath = path.join(detailDir, 'page.tsx');
const detailCode = `import Image from "next/image";
import Link from "next/link";
import { getDramaDetail } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DramaDetailPage({ params }) {
  const data = await getDramaDetail(params.id);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F4F0] text-[#171717]">
        <h1 className="text-4xl font-black mb-2">404</h1>
        <p className="font-bold">Data drama tidak ditemukan atau API Error.</p>
        <Link href="/dracin" className="mt-4 px-4 py-2 bg-black text-white font-bold">← KEMBALI</Link>
      </div>
    );
  }

  const { info, episodes } = data;
  const firstEpisode = episodes.length > 0 ? episodes[0] : null;

  return (
    <main className="min-h-dvh bg-[#F4F4F0] text-[#171717] pb-24">
      <header className="bg-white border-b-[3px] border-[#171717] p-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <Link href="/dracin" className="font-black text-xs border-[3px] border-[#171717] px-3 py-1 hover:bg-[#171717] hover:text-white transition-colors">← BACK</Link>
        <h1 className="font-black uppercase truncate max-w-[200px]">{info.title}</h1>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="aspect-video bg-black border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717] relative overflow-hidden flex flex-col items-center justify-center text-white">
            {!firstEpisode ? (
              <div className="text-center p-4">
                <p className="font-bold text-red-500 text-xl">⚠ LIST EPISODE KOSONG</p>
                <p className="text-xs opacity-70 mt-2">Cek log server, array episodes tidak ditemukan.</p>
              </div>
            ) : !firstEpisode.hasVideo ? (
              <div className="text-center p-6 bg-gray-900 w-full h-full flex flex-col justify-center items-center">
                <p className="font-bold text-yellow-400 text-2xl mb-2">⚠ SOURCE NOT FOUND</p>
                <div className="text-left bg-black p-4 rounded border border-gray-700 font-mono text-[10px] max-w-lg overflow-auto">
                  <p className="text-green-400">$ Debug Info:</p>
                  <p>ID: {firstEpisode.id}</p>
                  <p>Name: {firstEpisode.name}</p>
                  <p className="text-red-400">VideoURL: (Empty String)</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative group">
                <video controls className="w-full h-full object-contain" poster={info.cover_url} playsInline webkit-playsinline="true">
                  <source src={firstEpisode.video_url} />
                  Browser lu gak support video tag.
                </video>
                <div className="absolute top-0 left-0 bg-black/80 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none break-all max-w-full">
                  Source: {firstEpisode.video_url}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border-[3px] border-[#171717] p-6 shadow-[4px_4px_0px_#171717]">
            <h2 className="text-2xl font-black uppercase mb-4">{info.title}</h2>
            <p className="text-sm font-bold opacity-60 leading-relaxed mb-4">{info.synopsis}</p>
          </div>
        </div>

        <div className="bg-white border-[3px] border-[#171717] h-fit max-h-[80vh] overflow-y-auto shadow-[4px_4px_0px_#171717]">
          <div className="p-4 border-b-[3px] border-[#171717] bg-[#FDFFB6] sticky top-0 z-10">
            <h3 className="font-black uppercase">Playlist ({episodes.length})</h3>
          </div>
          <ul className="divide-y-2 divide-[#171717]/10">
            {episodes.map((ep, idx) => (
              <li key={ep.id} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-black text-white bg-[#171717] w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">{idx + 1}</span>
                  <span className="text-sm font-bold truncate group-hover:text-blue-600">{ep.name}</span>
                </div>
                {!ep.hasVideo && <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 font-black border border-red-200 uppercase tracking-wider">NO SRC</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};`;
