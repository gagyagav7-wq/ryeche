import Image from "next/image";
import Link from "next/link";
import { getDramaDetail } from "@/lib/api";

// Matikan cache halaman detail biar selalu fetch fresh data saat development
export const dynamic = "force-dynamic"; 

export default async function DramaDetailPage({ params }: { params: { id: string } }) {
  const data = await getDramaDetail(params.id);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F0] text-[#171717]">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">404</h1>
          <p className="font-bold">Drama data not found.</p>
          <Link href="/dracin" className="mt-4 inline-block underline font-black">← BACK HOME</Link>
        </div>
      </div>
    );
  }

  const { info, episodes } = data;
  const firstEpisode = episodes[0]; // Kita ambil episode 1 buat tes player

  return (
    <main className="min-h-dvh bg-[#F4F4F0] text-[#171717] pb-20">
      {/* HEADER */}
      <header className="bg-white border-b-[3px] border-[#171717] p-4 sticky top-0 z-50 flex items-center justify-between">
        <Link href="/dracin" className="font-black text-xs border-[3px] border-[#171717] px-3 py-1 hover:bg-[#171717] hover:text-white transition-colors">
          ← BACK
        </Link>
        <h1 className="font-black uppercase truncate max-w-[200px]">{info.title}</h1>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: PLAYER (atau Debug Message) */}
        <div className="md:col-span-2 space-y-6">
          <div className="aspect-video bg-black border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717] relative overflow-hidden flex items-center justify-center text-white">
            
            {episodes.length === 0 ? (
              <div className="text-center p-4">
                <p className="font-bold text-red-500">⚠ LIST EPISODE KOSONG</p>
                <p className="text-xs opacity-70 mt-2">API tidak mengembalikan data episode.</p>
              </div>
            ) : !firstEpisode?.hasVideo ? (
              <div className="text-center p-4">
                <p className="font-bold text-yellow-400">⚠ VIDEO URL MISSING</p>
                <p className="text-xs mt-2">Episode ID: {firstEpisode?.id}</p>
                <p className="text-xs">Name: {firstEpisode?.name}</p>
                <p className="text-[10px] opacity-50 mt-4 font-mono break-all bg-gray-800 p-2 rounded">
                  Debug: URL field kosong di API response.
                </p>
              </div>
            ) : (
              <video 
                controls 
                className="w-full h-full object-contain"
                poster={info.cover_url}
              >
                <source src={firstEpisode.video_url} type="application/x-mpegURL" />
                <source src={firstEpisode.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

          </div>

          <div className="bg-white border-[3px] border-[#171717] p-4 shadow-[4px_4px_0px_#171717]">
            <h2 className="text-2xl font-black uppercase mb-2">{info.title}</h2>
            <p className="text-sm font-bold opacity-60 leading-relaxed">
              {info.synopsis}
            </p>
          </div>
        </div>

        {/* KOLOM KANAN: PLAYLIST */}
        <div className="bg-white border-[3px] border-[#171717] h-fit max-h-[80vh] overflow-y-auto shadow-[4px_4px_0px_#171717]">
          <div className="p-4 border-b-[3px] border-[#171717] bg-[#FDFFB6] sticky top-0">
            <h3 className="font-black uppercase">Playlist ({episodes.length})</h3>
          </div>
          <ul className="divide-y-2 divide-[#171717]/10">
            {episodes.map((ep: any, idx: number) => (
              <li key={ep.id} className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group">
                <div>
                  <span className="text-xs font-black text-[#171717]/50 mr-2">#{idx + 1}</span>
                  <span className="text-sm font-bold group-hover:underline">{ep.name}</span>
                </div>
                {!ep.hasVideo && (
                  <span className="text-[9px] bg-red-100 text-red-600 px-1 font-bold border border-red-200">NO SRC</span>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}
