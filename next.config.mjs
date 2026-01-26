/** @type {import('next').NextConfig} */
const nextConfig = {
  // Kita kosongin remotePatterns buat keamanan.
  // Nanti di <Image> kita pake prop unoptimized={true}
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
