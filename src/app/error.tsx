'use client';

// FIX: Signature lengkap biar bisa debug
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  // Bisa console.log(error) disini kalau mau liat errornya apa di browser console
  
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg space-y-4">
      <h2 className="text-3xl font-black text-danger uppercase">System Error 💀</h2>
      <p className="font-bold opacity-60">Gagal ngambil data dari server.</p>
      
      {/* Pake brut-hover-effect juga disini biar konsisten */}
      <button 
        onClick={() => reset()}
        className="border-brut border-main bg-accent px-6 py-3 font-black shadow-brut brut-hover-effect brut-active-effect"
      >
        COBA LAGI
      </button>
    </div>
  );
}
