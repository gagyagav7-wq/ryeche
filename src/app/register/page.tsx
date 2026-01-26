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

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error || "Gagal daftar");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-4 bg-bg">
      <BrutCard title="DAFTAR BARU" className="w-full max-w-sm bg-accent-2">
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-red-500 text-white font-bold p-2 border-2 border-black text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="font-black uppercase text-sm">Username</label>
            <input
              name="username"
              type="text"
              required
              className="w-full bg-surface border-2 border-black p-3 font-bold outline-none focus:ring-4 focus:ring-black/20 transition-all text-base"
            />
          </div>

          <div className="space-y-1">
            <label className="font-black uppercase text-sm">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-surface border-2 border-black p-3 font-bold outline-none focus:ring-4 focus:ring-black/20 transition-all text-base"
            />
          </div>

          <BrutButton type="submit" fullWidth disabled={loading} variant="secondary">
            {loading ? "PROSES..." : "BUAT AKUN"}
          </BrutButton>

          <p className="text-center text-sm font-bold mt-4">
            Sudah punya akun?{" "}
            <Link href="/login" className="underline hover:bg-black hover:text-white transition-colors">
              Login aja
            </Link>
          </p>
        </form>
      </BrutCard>
    </main>
  );
}
