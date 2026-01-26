"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const apps = [
    { title: "Dracin", desc: "Nonton Drama China Brutal", href: "/dracin", bg: "bg-accent", icon: "🎬" },
    { title: "Downloader", desc: "TikTok/IG Video Saver", href: "/downloader", bg: "bg-accent-2", icon: "⬇️" },
    { title: "Tools", desc: "Utility & Helpers", href: "#", bg: "bg-gray-300", icon: "🛠️" },
    { title: "Settings", desc: "Atur Akun", href: "#", bg: "bg-surface", icon: "⚙️" },
  ];

  return (
    <main className="min-h-dvh p-4 md:p-8 bg-bg max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center border-b-4 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase">Dashboard</h1>
          <p className="font-bold opacity-60">Selamat datang kembali, Commander.</p>
        </div>
        <BrutButton onClick={handleLogout} variant="secondary" className="hidden md:block">
          LOGOUT
        </BrutButton>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {apps.map((app) => (
          <Link key={app.title} href={app.href} className="group outline-none focus-visible:ring-4 focus-visible:ring-black">
            <BrutCard 
              className={`h-full flex flex-col justify-between transition-transform hover:-translate-y-2 ${app.bg}`}
            >
              <div>
                <div className="text-4xl mb-4">{app.icon}</div>
                <h2 className="text-2xl font-black uppercase border-b-2 border-black pb-2 mb-2">{app.title}</h2>
                <p className="font-bold text-sm">{app.desc}</p>
              </div>
              <div className="mt-4 text-right">
                <span className="inline-block bg-black text-white px-2 py-1 text-xs font-bold group-hover:bg-white group-hover:text-black transition-colors">
                  OPEN APP &rarr;
                </span>
              </div>
            </BrutCard>
          </Link>
        ))}
      </div>

      <div className="md:hidden mt-8">
        <BrutButton onClick={handleLogout} fullWidth variant="secondary">
          LOGOUT KELUAR
        </BrutButton>
      </div>
    </main>
  );
}
