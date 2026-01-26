import Link from "next/link";
import BrutButton from "@/components/BrutButton";
import BrutCard from "@/components/BrutCard";

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-6 bg-bg text-text space-y-8 text-center">
      <div className="space-y-2 animate-in slide-in-from-bottom duration-700">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
          Flick<span className="text-accent">Reels</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold bg-white border-2 border-black p-2 inline-block shadow-brut -rotate-1">
          Hub Hiburan Brutal.
        </p>
      </div>

      <BrutCard className="max-w-md w-full bg-surface space-y-6 p-8">
        <p className="font-bold text-lg opacity-80">
          Akses ribuan Drama China, Download Sosmed, dan Tools eksklusif dalam satu dashboard.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link href="/login" className="w-full">
            <BrutButton fullWidth variant="primary" className="text-lg py-4">
              LOGIN SEKARANG
            </BrutButton>
          </Link>
          <Link href="/register" className="w-full">
            <BrutButton fullWidth variant="secondary" className="text-lg py-4">
              DAFTAR AKUN BARU
            </BrutButton>
          </Link>
        </div>
      </BrutCard>

      <footer className="fixed bottom-4 text-sm font-bold opacity-50">
        © 2026 FLICKREELS CORP.
      </footer>
    </main>
  );
}
