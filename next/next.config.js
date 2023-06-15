/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,//this being true (default) breaks react-tooltip in static exports
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
  }
}

module.exports = nextConfig
