import React, { useState, useEffect } from "react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const Header = ({ searchTerm, onSearchChange }: HeaderProps) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Sync prop changes
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Top Bar: Logo & Badge */}
      <div className="flex items-center gap-3">
        <div className="bg-[#FFC94A] w-12 h-12 flex items-center justify-center rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
           {/* Arrow Icon mock */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-black uppercase leading-none tracking-tight">
            BUTTER <span className="text-[#FFC94A]">HUB</span>
          </h1>
          <div className="flex gap-2 mt-1">
             <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">MOVIE</span>
             <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase border border-gray-400">LOCAL DB</span>
          </div>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="relative w-full">
        <input
          type="text"
          value={localSearch}
          onChange={handleChange}
          placeholder="Cari judul film..."
          className="w-full h-14 pl-12 pr-6 rounded-full border-2 border-black bg-white text-lg font-bold placeholder:text-gray-400 shadow-[4px_4px_0px_0px_#000] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>
    </div>
  );
};
