import React from "react";
import Image from "next/image";
// Hapus Link import dari sini kalau Link-nya di handle di parent (page.tsx), 
// ATAU pasang Link di sini tapi arahkan ke /moviebox
import Link from "next/link"; 

export const MovieCard = ({
  id, // Butuh ID buat Link
  title,
  poster,
  year,
  type,
  quality,
}: {
  id: string | number;
  title: string;
  poster: string;
  year: string;
  type: string;
  quality: string;
}) => (
  <Link href={`/moviebox/${id}`} className="group relative flex flex-col gap-2 cursor-pointer no-underline">
    {/* Image Container */}
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 border-black bg-gray-200 shadow-[4px_4px_0px_0px_#000] transition-all group-hover:shadow-[6px_6px_0px_0px_#000] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
      <Image
        src={poster}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      
      {/* Badges Overlay */}
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-[#FFC94A] border-2 border-black text-black text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
          {quality}
        </span>
      </div>
      <div className="absolute bottom-2 left-2 z-10">
         <span className={`border-2 border-black text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase ${type === 'series' ? 'bg-blue-500' : 'bg-red-500'}`}>
          {type}
        </span>
      </div>
    </div>

    {/* Info */}
    <div className="flex flex-col px-1">
      <h3 className="font-black text-lg leading-tight text-black line-clamp-1 group-hover:underline decoration-2">
        {title}
      </h3>
      <span className="text-xs font-bold text-gray-500 bg-gray-200 w-fit px-2 py-0.5 rounded-md mt-1 border border-black">
        {year}
      </span>
    </div>
  </Link>
);
