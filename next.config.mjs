/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Hati-hati, idealnya lu spesifikin domainnya (misal: 'i.ytimg.com')
      },
    ],
  },
};

export default nextConfig;
