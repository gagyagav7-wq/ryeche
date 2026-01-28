import Link from "next/link";
import BrutButton from "@/components/BrutButton"; // Pastikan path ini bener

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#F4F4F0] text-[#171717] relative overflow-hidden">
      
      {/* --- BACKGROUND DECORATION (Biar gak sepi amat) --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-20" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* Shapes Abstrak */}
      <div className="absolute top-[-10%] left-[-5%] w-80 h-80 bg-[#FDFFB6] rounded-full border-[3px] border-[#171717] opacity-100 -z-10 blur-sm md:blur-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#A8E6CF] border-[3px] border-[#171717] rotate-12 -z-10 blur-sm md:blur-0" />

      {/* --- HERO CONTENT (Pintu Gerbang) --- */}
      <div className="max-w-2xl w-full text-center space-y-8 relative z-10">
        
        {/* Brand */}
        <div className="space-y-2">
          <div className="inline-block bg-[#171717] text-white px-4 py-1 font-bold text-xs uppercase tracking-widest mb-4">
            Private Access Only
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
            BUTTER<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF]" style={{ WebkitTextStroke: '3px #171717' }}>HUB</span>
          </h1>
          <p className="text-lg md:text-xl font-bold opacity-70 max-w-lg mx-auto mt-4">
            Platform streaming drama asia paling brutal, tanpa iklan, kualitas premium.
          </p>
        </div>

        {/* Kotak Larangan / CTA */}
        <div className="bg-white border-[4px] border-[#171717] shadow-[12px_12px_0px_#171717] p-8 md:p-12 transform hover:-translate-y-1 transition-transform duration-300">
          <div className="space-y-6">
            <div className="text-6xl animate-bounce">🔒</div>
            <h2 className="text-2xl md:text-3xl font-black uppercase">
              STOP! Kamu Belum Login.
            </h2>
            <p className="font-bold opacity-60">
              Konten di dalam rumah ini eksklusif buat member. Silakan masuk atau daftar dulu untuk mulai nonton.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
              <Link href="/login" className="w-full md:w-auto">
                <div className="w-full bg-[#171717] text-white py-4 px-8 font-black uppercase text-lg border-2 border-transparent hover:bg-white hover:text-[#171717] hover:border-[#171717] transition-all cursor-pointer">
                  MASUK SEKARANG 🚀
                </div>
              </Link>
              
              <Link href="/register" className="w-full md:w-auto">
                 <div className="w-full bg-[#FDFFB6] text-[#171717] py-4 px-8 font-black uppercase text-lg border-[3px] border-[#171717] hover:shadow-[4px_4px_0px_#171717] hover:-translate-y-1 transition-all cursor-pointer">
                  DAFTAR AKUN 📝
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8">
            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                System v2.0 • Secure Gateway
            </p>
        </div>

      </div>
    </main>
  );
}
