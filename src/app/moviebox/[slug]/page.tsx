import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// --- DECODER ---
function decodeSafeId(encoded: string) {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

// --- DB SEARCH ---
async function getMovie(targetUrl: string) {
  const urlClean = targetUrl.replace(/\/$/, "");
  return prisma.movies.findFirst({
    where: {
      OR: [{ url: targetUrl }, { url: urlClean }, { url: urlClean + "/" }],
    },
  });
}

// --- UTIL ---
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

  const poster = (movie.poster ?? "").trim() || "https://via.placeholder.com/300x450";
  const title = (movie.title ?? "").trim() || "Untitled";

  // tombol source: prioritas stream_link, lalu iframe_link
  const sourceLink = streamSrc || iframeSrc || "#";

  // iframe dipakai cuma kalau stream kosong
  const showIframe = Boolean(iframeSrc) && !streamSrc;

  const streamType: "hls" | "mp4" | null = streamSrc
    ? isHls(streamSrc)
      ? "hls"
      : "mp4"
    : null;

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] font-sans pb-24">
      {/* HEADER */}
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
                // NOTE:
                // Untuk stream direct mp4/m3u8: paling bener pakai <video> di Client Component.
                // Di sini kita kasih placeholder + tombol open stream dulu biar gak blank.
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-black p-6 text-center">
                  <div className="text-lg">STREAM LINK TERSEDIA ✅</div>
                  <div className="mt-2 text-xs opacity-80">
                    Tipe: {streamType?.toUpperCase()}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a
                      href={streamSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2 bg-[#CBEF43] text-black border-[3px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] font-black uppercase text-xs hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      Open Stream
                    </a>
                    <a
                      href={sourceLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2 bg-white text-black border-[3px] border-[#0F172A] rounded-xl shadow-[4px_4px_0px_#0F172A] font-black uppercase text-xs hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      Source
                    </a>
                  </div>

                  <div className="mt-4 text-[11px] font-bold opacity-70 max-w-lg">
                    Next step: bikin MovieboxPlayer client component buat play HLS/MP4 langsung
                    (biar gak tergantung iframe provider).
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

                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <a
                      href={iframeSrc}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-[#CBEF43] border-[3px] border-[#0F172A] rounded-lg font-black text-xs shadow-[3px_3px_0px_#0F172A] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      OPEN PLAYER
                    </a>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-3 py-2 bg-white border-[3px] border-[#0F172A] rounded-lg font-black text-xs shadow-[3px_3px_0px_#0F172A] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      RELOAD
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white font-black p-6 text-center">
                  Tidak ada link playback di DB.<br />
                  Isi <code>stream_link</code> (mp4/m3u8) atau <code>iframe_link</code>.
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
              <Image
                src={poster}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
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
              <div className="text-xs font-bold opacity-80 border-[3px] border-[#0F172A] rounded-xl p-4 bg-white shadow-[4px_4px_0px_#0F172A]">
                ⚠️ Provider embed bisa error (contoh “Server error undefined”).<br />
                Solusi paling stabil: isi <code>stream_link</code> (mp4/m3u8) dari sumber yang lu kontrol/diizinkan.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
