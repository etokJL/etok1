const path = require('path')

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Make environment variables available to the frontend
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_HARDHAT_URL: process.env.HARDHAT_URL,
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    NEXT_PUBLIC_CHAIN_ID: process.env.CHAIN_ID,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID,
  },
  experimental: {
    // Remove deprecated turbo config if it exists
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Webpack configuration for Web3 libraries
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }
    
    return config
  },
}

module.exports = nextConfig