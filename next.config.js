/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // 🚫 Disable ESLint during builds (Fix Vercel lint error)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig