"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    
    try {
      // 1. Panggil API Penghancur Token
      await fetch("/api/auth/logout", { 
        method: "POST" 
      });

      // 2. Refresh router biar Next.js sadar cookie udah ilang
      router.refresh();

      // 3. Kabur ke halaman Login
      router.push("/login");
      
    } catch (error) {
      console.error("Gagal logout:", error);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className="w-full h-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 transition-colors"
    >
      {loading ? (
        <span className="text-xs font-black uppercase">EXITING...</span>
      ) : (
        <>
          <span className="font-black uppercase text-xs tracking-wider">LOGOUT</span>
          <span className="text-sm">🚪</span>
        </>
      )}
    </button>
  );
}
