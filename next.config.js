/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    OWNER_KEY: process.env.OWNER_KEY,
    ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
    ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY, 
    ALCHEMY_PROVIDER: process.env.ALCHEMY_PROVIDER,
    POLYGON_RPC_URL: process.env.POLYGON_RPC_URL
  },
};

module.exports = nextConfig;
