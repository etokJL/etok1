import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, base } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Define local Polygon-like chain
const localhost = {
  id: 31337,
  name: 'Polygon Local',
  network: 'polygon-local',
  nativeCurrency: {
    decimals: 18,
    name: 'MATIC',
    symbol: 'MATIC',
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:8545'] },
    default: { http: ['http://127.0.0.1:8545'] },
  },
} as const

// WalletConnect Project ID - replace with your actual project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Define the chains we want to support
const chains = [localhost, polygon, mainnet, sepolia, arbitrum, base] as const

// Create connectors array conditionally
const createConnectors = () => {
  const connectors = [
    // Injected wallet connector (MetaMask, browser wallets)
    injected(),
    
    // MetaMask connector
    metaMask(),
  ]

  // Skip WalletConnect in development to avoid connection errors
  // Only add WalletConnect if we have a valid project ID (not placeholder)
  if (projectId && projectId !== 'demo-project-id' && projectId !== 'your-walletconnect-project-id' && process.env.NODE_ENV === 'production') {
    connectors.push(
      walletConnect({
        projectId,
        metadata: {
          name: 'Booster Collection Cards',
          description: 'Swiss-quality decentralized energy NFT collection platform',
          url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          icons: [`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/icon.png`]
        },
        showQrModal: true,
      })
    )
  }

  // Only add Coinbase in production or when explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_COINBASE === 'true') {
    connectors.push(
      coinbaseWallet({
        appName: 'Booster Collection Cards',
        appLogoUrl: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/icon.png`,
      })
    )
  }

  return connectors
}

export const config = createConfig({
  chains,
  connectors: createConnectors(),
  
  transports: {
    [localhost.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  
  // Enable automatic session restoration on page load
  ssr: true,
  autoConnect: true,
})

// Re-export types for convenience
export type Config = typeof config
export { chains }

// Declare the wagmi config module for better TypeScript support
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}