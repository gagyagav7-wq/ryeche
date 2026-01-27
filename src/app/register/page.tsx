"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const json = await res.json();
        setError(json.error || "Gagal daftar, coba username lain.");
      }
    } catch (err) {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 bg-bg text-main relative overflow-hidden">
      
      {/* --- DECORATIVE LAYERS --- */}
      <div className="hidden md:block absolute inset-0 opacity-[0.03] pointer-events-none -z-20" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>
      
      {/* Shapes: Posisi beda dari Login */}
      <div className="absolute top-[10%] right-[-5%] w-56 h-56 bg-accent rounded-full border-brut border-main opacity-80 -z-10" />
      <div className="absolute bottom-[5%] left-[-5%] w-64 h-64 bg-[#A8E6CF] border-brut border-main -rotate-12 -z-10" />

      {/* --- CONTENT --- */}
      <div className="w-full max-w-sm relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-main">
              BUTTER<span className="text-accent">HUB</span>
            </h1>
          </Link>
          <p className="text-sm font-bold opacity-70 mt-1">Join Revolusi Brutal</p>
        </div>

        {/* Register Card (Yellow Accent) */}
        <BrutCard className="bg-[#FDFFB6] border-brut shadow-brut" title="DAFTAR BARU">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-surface border-brut border-main p-3 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 text-red-600">
                <span>⚠️</span> {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="font-black uppercase text-xs tracking-wider opacity-80 block">Username Baru</label>
              <input
                name="username"
                type="text"
                required
                className="w-full bg-white border-brut border-main p-3 font-bold text-main outline-none focus:ring-4 focus:ring-black/20 transition-all placeholder:opacity-40"
                placeholder="Pilih nama keren"
              />
            </div>

            <div className="space-y-2">
              <label className="font-black uppercase text-xs tracking-wider opacity-80 block">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-white border-brut border-main p-3 font-bold text-main outline-none focus:ring-4 focus:ring-black/20 transition-all placeholder:opacity-40"
                placeholder="Rahasia negara"
              />
            </div>

            <div className="pt-2">
              {/* Variant secondary (Putih/Hitam) biar kontras di background kuning */}
              <BrutButton type="submit" fullWidth disabled={loading} variant="secondary" className="py-3 text-lg bg-white">
                {loading ? "PROSES..." : "BUAT AKUN"}
              </BrutButton>
            </div>

            <div className="text-center border-t-2 border-main/10 pt-4 mt-2">
              <p className="text-sm font-bold opacity-80">
                Udah punya akun?{" "}
                <Link href="/login" className="underline decoration-2 underline-offset-2 hover:bg-main hover:text-white transition-colors">
                  Login aja
                </Link>
              </p>
            </div>
          </form>
        </BrutCard>
      </div>
    </main>
  );
}
