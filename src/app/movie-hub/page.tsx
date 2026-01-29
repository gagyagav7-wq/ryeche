import { movieApi } from "@/lib/movie-hub-api";
import MovieCard from "@/components/movie-hub/MovieCard";

export default async function MovieHubPage() {
  const movies = await movieApi.getTrending();

  return (
    <main className="min-h-dvh bg-[#FFFDF7] text-[#0F172A] pb-24">
      {/* Replikasi Header ButterHub/DAWGHub */}
      <header className="sticky top-0 z-30 bg-[#FFFDF7]/90 backdrop-blur-md border-b-[3px] border-[#0F172A] py-6 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Movie <span className="text-[#FF708D]">Hub</span>
          </h1>
          {/* Search bar placeholder */}
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-12 mt-12">
        <div className="flex items-end gap-3 mb-8 border-b-[3px] border-[#0F172A] pb-4">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Trending Global 🔥</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      </section>
    </main>
  );
}
