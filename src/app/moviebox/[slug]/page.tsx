import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

function decodeSafeId(encoded: string) {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

async function getMovie(targetUrl: string) {
  const urlClean = targetUrl.replace(/\/$/, "");
  return prisma.movies.findFirst({
    where: {
      OR: [{ url: targetUrl }, { url: urlClean }, { url: urlClean + "/" }],
    },
  });
}

function isHls(url: string) {
  return /\.m3u8(\?|#|$)/i.test(url);
}

export default async function MoviePlayerPage({
  params,
}: {
  params: { slug: string };
}) {
  const originalUrl = decodeSafeId(params.slug);
  if (!originalUrl) return notFound();

  const movie = await getMovie(originalUrl);
  if (!movie) return notFound();

  const iframeSrc = (movie.iframe_link ?? "").trim();
  const streamSrc = (movie.stream_link ?? "").trim();

  const poster = movie.poster || "https://via.placeholder.com/300x450";
  const title = movie.title || "Untitled";

  // tombol source: prioritas stream_link, lalu iframe_link
  const sourceLink = streamSrc || iframeSrc || "#";

  // kalau provider embed error, minimal user dapat tombol buka sumber
  const showIframe = Boolean(iframeSrc) && !streamSrc; // iframe cuma dipakai kalau stream kosong

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans pb-24">
      <header className="sticky top-0 z-50 bg-[#FFFDF7]/95 backdrop-blur border-b-[3px] border-[#0F172A] px-6 py-4 flex items-center gap-4">
        <Link
          href="/moviebox"
          className="w-10 h-10 bg-[#FF9F1C] border-[3px] border-[#0F172A] rounded-lg flex items-center justify-center text-white font-black hover:scale-105 transition-transform"
        >
          ←
        </Link>
        <h1 className="text-lg font-black italic uppercase truncate w-full">
          {title}
        </h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PLAYER */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video bg-black border-[4px] border-[#0F172A] shadow-[8px_8px_0px_#FF9F1C] rounded-[20px] overflow-hidden">
              {streamSrc ? (
                // NOTE: untuk HLS/MP4 yang beneran direct link, lebih cocok pakai <video> (client component).
                // Di sini kita kasih placeholder informasi aja.
                <div className="absolute inset-0 grid place-items-center text-white font-black p-6 text-center">
                  STREAM LINK TERSEDIA ✅<br />
                  (pake VideoPlayer HLS/MP4)
                  <div className="mt-4">
                    <a
                      href={streamSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2 bg-[#CBEF43] text-black border-[3px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] font-black uppercase text-xs"
                    >
                      Open Stream
                    </a>
                  </div>
                </div>
              ) : showIframe ? (
                <>
                  <iframe
                    src={iframeSrc}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    scrolling="no"
                    frameBorder="0"
                    referrerPolicy="origin"
                  />

                  />
                  <div className="absolute bottom-3 left-3">
                    <a
                      href={iframeSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-lg font-black text-xs shadow-[3px_3px_0px_#0F172A]"
                    >
                      OPEN PLAYER
                    </a>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white font-black p-6 text-center">
                  Tidak ada link playback di DB.<br />
                  Isi `stream_link` (mp4/m3u8) atau `iframe_link`.
                </div>
              )}
            </div>

            <div className="bg-white border-[3px] border-[#0F172A] p-6 rounded-[20px] shadow-[6px_6px_0px_#0F172A]">
              <h1 className="text-2xl font-black uppercase italic mb-4">
                {title}
              </h1>
              <p className="text-sm font-medium opacity-80 italic border-l-4 border-[#CBEF43] pl-4">
                {movie.synopsis || "No synopsis available."}
              </p>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="aspect-[2/3] relative border-[4px] border-[#0F172A] rounded-[20px] overflow-hidden bg-[#0F172A]">
              <Image src={poster} alt={title} fill className="object-cover" unoptimized />
            </div>

            <a
              href={sourceLink}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-4 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-xl font-black uppercase text-center shadow-[4px_4px_0px_#0F172A] hover:translate-y-1 hover:shadow-none transition-all"
            >
              Download / Source
            </a>

            {!streamSrc && iframeSrc ? (
              <div className="text-xs font-bold opacity-70 border-[3px] border-[#0F172A] rounded-xl p-4 bg-white shadow-[4px_4px_0px_#0F172A]">
                ⚠️ Provider embed bisa error (kayak “Server error undefined”).<br />
                Solusi paling stabil: isi <code>stream_link</code> (mp4/m3u8) dari sumber yang lu kontrol/diizinkan.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
