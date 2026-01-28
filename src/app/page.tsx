import Link from "next/link";

// --- DATA: COLLECTIONS (PLATFORMS) ---
const COLLECTIONS = [
  {
    id: "dracin",
    name: "Dracin",
    desc: "Koleksi Drama China premium. Ongoing & Completed.",
    tag: "MAIN LIBRARY",
    color: "bg-[#FECFEF]", // Pink
  },
  {
    id: "flickreels",
    name: "FlickReels",
    desc: "Short movies & cinematic reels eksklusif.",
    tag: "SHORT MOVIE",
    color: "bg-[#A8E6CF]", // Mint
  },
  {
    id: "netshort",
    name: "NetShort",
    desc: "Series pendek vertikal kualitas HD.",
    tag: "VERTICAL",
    color: "bg-[#FDFFB6]", // Yellow
  },
  {
    id: "dramabox",
    name: "DramaBox",
    desc: "Kotak drama pilihan editor. Curated daily.",
    tag: "CURATED",
    color: "bg-[#FFD6A5]", // Orange
  },
  {
    id: "reelshort",
    name: "ReelShort",
    desc: "Snack-sized drama untuk jeda istirahat.",
    tag: "QUICK WATCH",
    color: "bg-[#CAFFBF]", // Green
  },
];

// --- DATA: FEATURES ---
const FEATURES = [
  { 
    title: "Universal Downloader", 
    desc: "Simpan video favorit ke device. Tanpa watermark.", 
    icon: "⬇️" 
  },
  { 
    title: "Smart Search", 
    desc: "Cari judul, aktor, atau genre dalam hitungan detik.", 
    icon: "🔍" 
  },
  { 
    title: "Auto Playlist", 
    desc: "Nonton maraton tanpa putus. Next episode otomatis.", 
    icon: "▶️" 
  },
  { 
    title: "Watch History", 
    desc: "Lanjutkan tontonan dari detik terakhir. (Coming Soon)", 
    icon: "🕒" 
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col relative overflow-x-hidden">
      
      {/* DECORATION: Background gradient blob (Subtle) */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#FECFEF] rounded-full blur-[120px] opacity-40 pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FDFFB6] rounded-full blur-[100px] opacity-40 pointer-events-none -z-10" />

      {/* =======================
          1. HERO SECTION
         ======================= */}
      <section className="relative pt-20 pb-20 px-6 md:px-12 border-b-[3px] border-[#121212] bg-[#F2F0E9]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#121212] text-white border-[2px] border-[#121212] shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
              <span className="w-2 h-2 bg-[#FF9A9E] rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Private Access Only</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-[#121212]">
                BUTTER<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF]" style={{ WebkitTextStroke: '3px #121212' }}>HUB</span>
              </h1>
              <p className="text-lg md:text-xl font-bold opacity-60 max-w-lg leading-relaxed pt-4">
                Platform streaming drama asia paling brutal. Tanpa iklan. Kualitas premium. Akses eksklusif.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login" className="neo-btn-primary text-center">
                Masuk Sekarang
              </Link>
              <Link href="/register" className="neo-btn-secondary text-center">
                Daftar Akun
              </Link>
            </div>
          </div>

          {/* Hero Visual / Decoration (Abstract) */}
          <div className="relative hidden lg:block h-full min-h-[400px]">
             {/* Simple brutalist composition using divs */}
             <div className="absolute top-10 right-10 w-64 h-80 bg-white border-[3px] border-[#121212] shadow-[12px_12px_0px_#121212] z-10 flex items-center justify-center p-8 rotate-3">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍿</div>
                    <h3 className="font-black uppercase text-2xl">Premium<br/>Cinema</h3>
                </div>
             </div>
             <div className="absolute top-20 right-40 w-64 h-80 bg-[#FDFFB6] border-[3px] border-[#121212] shadow-[12px_12px_0px_#121212] -z-0 -rotate-6 flex items-center justify-center">
                <div className="text-center opacity-50">
                    <h3 className="font-black uppercase text-4xl rotate-90">NO ADS</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =======================
          2. COLLECTIONS (THE VAULT)
         ======================= */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 border-b-[3px] border-[#121212] pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Koleksi Arsip
            </h2>
            <p className="text-sm font-bold opacity-50 uppercase tracking-widest mt-2">
              Platform yang tersedia di dalam Hub
            </p>
          </div>
          <div className="font-mono text-xs border border-[#121212] px-2 py-1 bg-white">
            TOTAL: {COLLECTIONS.length} PLATFORMS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {COLLECTIONS.map((item) => (
            <div key={item.id} className="neo-card flex flex-col h-full relative overflow-hidden group">
              {/* Header Color Strip */}
              <div className={`h-24 ${item.color} border-b-[3px] border-[#121212] flex items-center justify-center`}>
                <span className="text-4xl opacity-80 mix-blend-multiply font-black">
                    {item.name[0]}
                </span>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <span className="neo-badge">{item.tag}</span>
                </div>
                <h3 className="text-xl font-black uppercase mb-2">{item.name}</h3>
                <p className="text-xs font-bold opacity-60 leading-relaxed mb-6 flex-grow">
                  {item.desc}
                </p>
                
                {/* Fake Button (Visual Only) */}
                <div className="mt-auto pt-4 border-t-2 border-dashed border-[#121212]/20">
                    <span className="text-[10px] font-black uppercase flex items-center gap-2 group-hover:gap-4 transition-all">
                        Locked Access 🔒
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =======================
          3. FEATURES (UTILITIES)
         ======================= */}
      <section className="py-20 px-6 bg-[#121212] text-[#F2F0E9] border-y-[3px] border-[#F2F0E9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase text-[#F2F0E9]">
              Fitur & Utilitas
            </h2>
            <div className="w-24 h-2 bg-[#FDFFB6] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, idx) => (
              <div key={idx} className="bg-[#121212] border-[3px] border-[#F2F0E9] p-6 shadow-[8px_8px_0px_#F2F0E9] hover:shadow-[4px_4px_0px_#F2F0E9] hover:translate-x-1 hover:translate-y-1 transition-all">
                <div className="text-4xl mb-4 grayscale">{feat.icon}</div>
                <h4 className="text-lg font-black uppercase mb-2 text-[#FDFFB6]">{feat.title}</h4>
                <p className="text-sm opacity-70 font-mono leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =======================
          4. WHY US (MANIFESTO)
         ======================= */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-black uppercase tracking-widest mb-12 opacity-40">
          THE MANIFESTO
        </h2>
        
        <div className="space-y-8 text-xl md:text-3xl font-black uppercase leading-tight">
          <p>
            <span className="bg-[#FDFFB6] px-2 text-[#121212]">0% IKLAN.</span> Murni Konten.
          </p>
          <p>
            Desain Brutal. <span className="bg-[#FECFEF] px-2 text-[#121212]">Navigasi Cepat.</span>
          </p>
          <p>
            Server Pribadi. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A8E6CF] to-[#FDFFB6]" style={{ WebkitTextStroke: '1px #121212' }}>Koneksi Stabil.</span>
          </p>
        </div>
      </section>

      {/* =======================
          5. LOGIN GATE (FINAL CTA)
         ======================= */}
      <section id="gate" className="py-20 px-4 md:px-12 bg-white border-t-[3px] border-[#121212]">
        <div className="max-w-xl mx-auto neo-card p-8 md:p-12 text-center transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="text-6xl mb-6">🚪</div>
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">
              Siap Masuk?
            </h2>
            <p className="font-bold opacity-60 mb-8 max-w-md mx-auto">
              Pintu ButterHub tertutup untuk umum. Pastikan kamu memiliki kredensial yang valid untuk mengakses arsip.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full neo-btn-primary text-center py-4 text-lg">
                BUKA PINTU (LOGIN)
              </Link>
              <div className="text-xs font-bold opacity-40 uppercase pt-2">
                Belum punya kunci? <Link href="/register" className="underline hover:text-[#FF9A9E]">Daftar di sini</Link>
              </div>
            </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="py-8 text-center text-[10px] font-black uppercase tracking-widest opacity-30 border-t-[3px] border-[#121212] bg-[#F2F0E9]">
        &copy; 2026 ButterHub Ecosystem. All Systems Operational.
      </footer>

    </main>
  );
}
