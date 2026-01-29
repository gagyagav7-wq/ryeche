"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { movieHubApi } from "@/lib/movie-hub-api";

export default function MovieHubPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    movieHubApi.getHome().then(res => {
      setMovies(res.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-dvh bg-[#FFFDF7] p-6">
      <h1 className="text-3xl font-black uppercase mb-8 border-b-4 border-[#0F172A] pb-2">
        Movie Hub <span className="text-[#FF708D]">Gallery</span>
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((m: any) => (
          <Link key={m.slug} href={`/movie-hub/${m.slug}`} className="trop-card group">
            <div className="aspect-[3/4] relative border-b-2 border-[#0F172A]">
              <Image src={m.thumbnail} alt={m.title} fill className="object-cover" unoptimized />
            </div>
            <div className="p-3 text-xs font-black uppercase truncate">{m.title}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
