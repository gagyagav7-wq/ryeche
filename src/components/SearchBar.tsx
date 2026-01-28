"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // Kita pake native timeout aja biar gak perlu install lib

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // Debounce manual biar gak nambah library berat
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`/dracin/search?${params.toString()}`);
  };

  // Timer buat debounce
  let timeoutId: NodeJS.Timeout;
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);
    const val = e.target.value;
    timeoutId = setTimeout(() => handleSearch(val), 500); // Tunggu 500ms
  };

  return (
    <div className="flex gap-2 w-full md:w-auto">
      <input
        type="text"
        placeholder={placeholder}
        onChange={onInputChange}
        defaultValue={searchParams.get("q")?.toString()}
        className="flex-1 md:w-64 bg-white border-[3px] border-[#171717] p-3 font-bold text-sm outline-none focus:ring-4 focus:ring-[#FDFFB6]/50 transition-all placeholder:opacity-40 shadow-sm"
      />
      <button 
        className="bg-[#171717] text-white border-[3px] border-[#171717] px-4 font-black transition-colors active:translate-y-1"
        onClick={() => {}} // Tombol cuma hiasan visual karena input udah otomatis
      >
        🔍
      </button>
    </div>
  );
}
