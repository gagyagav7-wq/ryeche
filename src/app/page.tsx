"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // WAJIB PAKE INI
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. AMBIL CALLBACK URL DARI URL BROWSER
  // Kalau ada ?callbackUrl=/downloader, kita pake itu.
  // Kalau gak ada, default-nya ke /dashboard.
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Ganti ini dengan endpoint API login lu yang asli
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Login gagal, cek email/password");
      }

      // 2. JIKA SUKSES -> REDIRECT SESUAI CALLBACK
      // Di sini kuncinya! Jangan hardcode ke '/dashboard'
      router.push(callbackUrl);
      
      // Force refresh biar middleware sadar cookie baru masuk
      router.refresh(); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... JSX Tampilan Login Lu (Tropical Brutalism) ...
    // Pastikan form onSubmit={handleSubmit}
    <main className="min-h-dvh flex items-center justify-center bg-[#FDFBF7]">
        {/* Contoh Form Singkat */}
        <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000]">
            <h1 className="text-4xl font-black mb-6">LOGIN AREA</h1>
            
            {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
            
            <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-2 border-black p-3 mb-4 font-bold"
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-2 border-black p-3 mb-6 font-bold"
            />
            
            <button disabled={loading} className="w-full bg-[#FFD23F] border-2 border-black p-3 font-black uppercase hover:shadow-[4px_4px_0px_#000] transition-all">
                {loading ? "Loading..." : "Masuk"}
            </button>
        </form>
    </main>
  );
}
