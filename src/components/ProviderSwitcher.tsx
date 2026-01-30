// src/components/ProviderSwitcher.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProviderSwitcher() {
  const pathname = usePathname();

  // Config Server (Ready: false = tombol mati/disabled)
  const servers = [
    { id: "flickreels", label: "Flickreels", badge: "FR", color: "bg-[#FF9F1C]", path: "/dracin", ready: true },
    { id: "dramabox", label: "Dramabox", badge: "DB", color: "bg-[#FF708D]", path: "/dramabox", ready: true },
    { id: "netshort", label: "Netshort", badge: "NS", color: "bg-[#CBEF43]", path: "/netshort", ready: false },
    { id: "melolo", label: "Melolo", badge: "ML", color: "bg-[#2EC4B6]", path: "/melolo", ready: false },
  ];

  // Logic Active State yang Pintar
  const getActive = (path: string) => {
    // Mapping manual: URL /dracin dianggap milik flickreels
    if (path === "/dracin" || path.startsWith("/dracin/")) return "flickreels";
    // Default logic: URL /dramabox milik dramabox
    const segment = path.split("/")[1]; 
    return segment;
  };

  const activeId = getActive(pathname);

  return (
    <div className="flex items-center gap-2 bg-white border-[3px] border-[#0F172A] rounded-full p-1.5 shadow-[5px_5px_0px_#0F172A] mb-6 w-fit">
      {servers.map((srv) => {
        const isActive = activeId === srv.id;
        
        if (!srv.ready) {
          // Render tombol mati (Disabled)
          return (
            <div key={srv.id} className="flex items-center gap-2 px-4 py-2 opacity-40 cursor-not-allowed grayscale">
              <span className="w-5 h-5 grid place-items-center rounded border border-[#0F172A] text-[8px] font-black">{srv.badge}</span>
              <span className="text-[10px] font-bold uppercase">{srv.label}</span>
            </div>
          );
        }

        // Render tombol hidup
        return (
          <Link
            key={srv.id}
            href={srv.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-[2px] border-[#0F172A] font-black uppercase text-[10px] tracking-widest transition-all ${
              isActive
                ? "bg-[#0F172A] text-white shadow-[2px_2px_0px_#CBEF43] -translate-y-[1px]"
                : "bg-[#FFFDF7] text-[#0F172A] hover:bg-gray-100 border-transparent hover:border-[#0F172A]"
            }`}
          >
            <span className={`w-5 h-5 grid place-items-center rounded border border-[#0F172A] text-[8px] font-black ${srv.color} text-[#0F172A]`}>
              {srv.badge}
            </span>
            {srv.label}
          </Link>
        );
      })}
    </div>
  );
}
