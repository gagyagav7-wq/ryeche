console.log("[NEXT BUILD] DATABASE_URL =", process.env.DATABASE_URL)
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 1. Domain Mock Data (PENTING: Buat gambar dummy yang sekarang error)
      {
        protocol: 'https',
        hostname: 'image.tmdb.org', 
      },
      // 2. Domain Bawaan Kamu (Tetap dipertahankan)
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', 
      },
      {
        protocol: 'https',
        hostname: 'zshipubcdn.farsunpteltd.com', // Domain Cover API
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zshipricf.farsunpteltd.com', // Domain Episode Cover
        pathname: '/**',
      },
      // 3. Opsi "Sapu Jagat" (Opsional: Aktifkan kalau malas nambahin domain satu-satu saat dev)
      /*
      {
        protocol: 'https',
        hostname: '**',
      },
      */
    ],
  },
};

export default nextConfig;
