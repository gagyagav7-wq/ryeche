"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // <-- Tambah state error ini

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Cek callbackUrl, kalau gak ada ke dashboard
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.replace(callbackUrl);
        router.refresh();
      } else {
        let msg = "Login gagal, coba lagi.";
        try {
          const json = await res.json();
          msg = json.error || msg;
        } catch {
          // Fallback
        }
        setError(msg);
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
      
      {/* Shapes */}
      <div className="absolute top-[-5%] left-[-10%] w-64 h-64 md:w-96 md:h-96 bg-[#A8E6CF] rounded-full border-brut border-main opacity-100 -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-[#FDFFB6] border-brut border-main rotate-45 -z-10" />

      {/* --- CONTENT --- */}
      <div className="w-full max-w-sm relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transition-transform md:hover:scale-105">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-main">
              BUTTER<span className="text-accent">HUB</span>
            </h1>
          </Link>
          <p className="text-sm font-bold opacity-70 mt-1">Portal Masuk Commander</p>
        </div>

        {/* Login Card */}
        <BrutCard className="bg-surface border-brut shadow-brut" title="LOGIN">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-[#FFB5C2] border-brut border-main p-3 text-sm font-bold flex items-center gap-2 text-black animate-in slide-in-from-top-2">
                <span>🚫</span> {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="font-black uppercase text-xs tracking-wider opacity-80 block">Username</label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                disabled={loading} // Disable pas loading
                required
                className="w-full bg-bg border-brut border-main p-3 font-bold text-main outline-none focus:ring-4 focus:ring-accent/30 transition-all placeholder:opacity-40 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ex: jagoan_neon"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-black uppercase text-xs tracking-wider opacity-80 block">Password</label>
              </div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                disabled={loading} // Disable pas loading
                required
                className="w-full bg-bg border-brut border-main p-3 font-bold text-main outline-none focus:ring-4 focus:ring-accent/30 transition-all placeholder:opacity-40 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <BrutButton type="submit" fullWidth disabled={loading} variant="primary" className="py-3 text-lg">
                {loading ? "MEMUAT..." : "MASUK HUB 🚀"}
              </BrutButton>
            </div>

            <div className="text-center border-t-2 border-main/10 pt-4 mt-2">
              <p className="text-sm font-bold opacity-80">
                Belum punya akses?{" "}
                <Link href="/register" className="text-accent underline decoration-2 underline-offset-2 hover:bg-main hover:text-white transition-colors">
                  Daftar dulu sini
                </Link>
              </p>
            </div>
          </form>
        </BrutCard>
      </div>
    </main>
  );
}
