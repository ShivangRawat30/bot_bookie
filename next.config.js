/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OWNER_KEY: process.env.OWNER_KEY,
  },
};

module.exports = nextConfig;
