/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript errors block builds ✅
  // ESLint warnings allowed (errors still block)
  eslint: {
    ignoreDuringBuilds: false, // Errors block, warnings allowed
  },
  typescript: {
    ignoreBuildErrors: false, // Type errors block builds
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
