'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-bg space-y-4">
      <h2 className="text-3xl font-black text-danger uppercase">System Error 💀</h2>
      <p className="font-bold opacity-60">Gagal ngambil data dari server.</p>
      <button 
        onClick={() => reset()}
        className="border-brut border-main bg-accent px-6 py-3 font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-brut transition-all"
      >
        COBA LAGI
      </button>
    </div>
  );
}
