"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrutButton from "@/components/BrutButton"; 

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Pastikan route ini sesuai dengan folder api lu
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <BrutButton
      onClick={handleLogout}
      disabled={isLoggingOut}
      variant="secondary"
      className="text-sm py-2 px-6 bg-white border-2 border-black font-bold uppercase hover:bg-red-100 transition-colors"
    >
      {isLoggingOut ? "Keluar..." : "Logout 🚪"}
    </BrutButton>
  );
}
