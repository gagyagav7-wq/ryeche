import Image from "next/image";
import Link from "next/link";
import { getDramaDetail } from "@/lib/api";

// FORCE DYNAMIC biar log server keluar terus setiap refresh
export const dynamic = "force-dynamic";

export default async function DramaDetailPage({ params }: { params: { id: string } }) {
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
      {/* HEADER */}
      <header className="bg-white border-b-[3px] border-[#171717] p-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <Link href="/dracin" className="font-black text-xs border-[3px] border-[#171717] px-3 py-1 hover:bg-[#171717] hover:text-white transition-colors">
          ← BACK
        </Link>
        <h1 className="font-black uppercase truncate max-w-[200px]">{info.title}</h1>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: PLAYER & DEBUG AREA */}
        <div className="md:col-span-2 space-y-6">
          <div className="aspect-video bg-black border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717] relative overflow-hidden flex flex-col items-center justify-center text-white">
            
            {/* KONDISI 1: EPISODE KOSONG */}
            {!firstEpisode ? (
              <div className="text-center p-4">
                <p className="font-bold text-red-500 text-xl">⚠ LIST EPISODE KOSONG</p>
                <p className="text-xs opacity-70 mt-2">Cek log server, array episodes tidak ditemukan.</p>
              </div>
            ) 
            /* KONDISI 2: ADA EPISODE TAPI VIDEO URL KOSONG */
            : !firstEpisode.hasVideo ? (
              <div className="text-center p-6 bg-gray-900 w-full h-full flex flex-col justify-center items-center">
                <p className="font-bold text-yellow-400 text-2xl mb-2">⚠ SOURCE NOT FOUND</p>
                <div className="text-left bg-black p-4 rounded border border-gray-700 font-mono text-[10px] max-w-lg overflow-auto">
                  <p className="text-green-400">$ Debug Info:</p>
                  <p>ID: {firstEpisode.id}</p>
                  <p>Name: {firstEpisode.name}</p>
                  <p className="text-red-400">VideoURL: (Empty String)</p>
                  <p className="mt-2 text-gray-500">Masalah: Mapping field di pickVideoUrl() belum cocok dengan response API.</p>
                </div>
              </div>
            ) 
            /* KONDISI 3: VIDEO ADA -> TAMPILKAN NATIVE PLAYER DULU */
            : (
              <div className="w-full h-full relative group">
                <video 
                  controls 
                  className="w-full h-full object-contain"
                  poster={info.cover_url}
                  playsInline
                  webkit-playsinline="true"
                >
                  <source src={firstEpisode.video_url} />
                  Browser lu gak support video tag.
                </video>
                
                {/* Debug Overlay (Hover to see URL) */}
                <div className="absolute top-0 left-0 bg-black/80 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none break-all max-w-full">
                  Source: {firstEpisode.video_url}
                </div>
              </div>
            )}

          </div>

          {/* INFO CARD */}
          <div className="bg-white border-[3px] border-[#171717] p-6 shadow-[4px_4px_0px_#171717]">
            <h2 className="text-2xl font-black uppercase mb-4">{info.title}</h2>
            <p className="text-sm font-bold opacity-60 leading-relaxed mb-4">
              {info.synopsis}
            </p>
            {firstEpisode?.hasVideo && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-xs font-bold">
                ℹ️ Jika video loading terus/error tapi URL ada, berarti kena blokir Hotlink (403). Kita butuh Proxy.
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: PLAYLIST */}
        <div className="bg-white border-[3px] border-[#171717] h-fit max-h-[80vh] overflow-y-auto shadow-[4px_4px_0px_#171717]">
          <div className="p-4 border-b-[3px] border-[#171717] bg-[#FDFFB6] sticky top-0 z-10">
            <h3 className="font-black uppercase">Playlist ({episodes.length})</h3>
          </div>
          <ul className="divide-y-2 divide-[#171717]/10">
            {episodes.map((ep: any, idx: number) => (
              <li key={ep.id} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-black text-white bg-[#171717] w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold truncate group-hover:text-blue-600">
                    {ep.name}
                  </span>
                </div>
                {!ep.hasVideo && (
                  <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 font-black border border-red-200 uppercase tracking-wider">
                    NO SRC
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}
