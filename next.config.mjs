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
};

export default nextConfig;
