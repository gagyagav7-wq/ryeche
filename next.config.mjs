/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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
    ],
  },
};

export default nextConfig;
