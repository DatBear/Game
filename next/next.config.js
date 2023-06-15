/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/ls2',
  swcMinify: false,//this being true (default) breaks react-tooltip in static exports
}

module.exports = nextConfig
