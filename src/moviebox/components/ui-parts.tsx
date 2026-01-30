import React from "react";
import Image from "next/image";
import Link from "next/link";

// --- 1. TAB PILL (Tombol Filter Atas) ---
export const TabPill = ({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-3 rounded-full border-2 border-black font-bold text-sm uppercase transition-all
      ${
        active
          ? "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px]"
          : "bg-transparent text-gray-700 hover:bg-gray-100"
      }
    `}
  >
    {icon}
    {label}
  </button>
);

// --- 2. GENRE CHIP (Tombol Kategori Horizontal) ---
export const GenreChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      whitespace-nowrap px-4 py-2 rounded-xl border-2 border-black font-bold text-xs uppercase transition-all
      ${
        active
          ? "bg-[#FFC94A] text-black shadow-[3px_3px_0px_0px_#000]"
          : "bg-white text-gray-800 shadow-[2px_2px_0px_0px_#ccc] hover:shadow-[3px_3px_0px_0px_#000]"
      }
    `}
  >
    {label}
  </button>
);

// --- 3. MOVIE CARD (Kartu Film) ---
export const MovieCard = ({
  id,
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
