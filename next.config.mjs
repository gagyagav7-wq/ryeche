/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Izinkan domain ini
        pathname: '/**',
      },
      // Kalau nanti lu pake gambar dari hosting sendiri/cloudinary, tambah disini juga
    ],
  },
};

export default nextConfig;
