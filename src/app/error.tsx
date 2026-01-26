'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg p-6 text-center gap-4">
      <h2 className="text-3xl md:text-4xl font-black uppercase text-danger">
        System Error 💀
      </h2>

      <p className="font-bold opacity-70 max-w-md">
        Gagal ngambil data dari server. Coba lagi ya.
      </p>

      {/* Optional: tampilkan pesan error saat dev */}
      {process.env.NODE_ENV === "development" ? (
        <pre className="max-w-xl overflow-auto border-brut border-main bg-surface p-4 text-left text-xs font-bold shadow-brut">
          {error.message}
        </pre>
      ) : null}

      <button
        onClick={() => reset()}
        className="border-brut border-main bg-accent px-6 py-3 font-black shadow-brut transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        type="button"
      >
        COBA LAGI
      </button>
    </div>
  );
}
