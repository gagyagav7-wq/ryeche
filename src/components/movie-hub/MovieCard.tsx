import Image from "next/image";
import Link from "next/link";

export default function MovieCard({ movie }: { movie: any }) {
  return (
    <Link href={`/movie-hub/${movie.id}`} className="group relative bg-white border-[3px] border-[#0F172A] rounded-[16px] overflow-hidden shadow-[4px_4px_0px_#0F172A] hover:-translate-y-[4px] hover:shadow-[8px_8px_0px_#0F172A] transition-all duration-300">
      <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden border-b-[3px] border-[#0F172A]">
        <Image 
          src={movie.poster} 
          alt={movie.title} 
          fill 
          className="object-cover"
          unoptimized 
        />
        {/* Rating Badge ala Dracin */}
        <div className="absolute top-3 right-3 bg-[#CBEF43] border-[2px] border-[#0F172A] px-2 py-1 rounded-md text-[10px] font-black text-[#0F172A] shadow-sm">
          {movie.rating} ★
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[8px] font-bold uppercase bg-[#E7E5D8] px-1.5 py-0.5 rounded text-[#0F172A] border border-[#0F172A]/20">
            {movie.year}
          </span>
        </div>
        <h3 className="font-black text-sm leading-tight uppercase line-clamp-2 group-hover:text-[#FF9F1C] transition-colors">
          {movie.title}
        </h3>
      </div>
    </Link>
  );
}
