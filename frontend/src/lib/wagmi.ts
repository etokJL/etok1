import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum, base } from 'wagmi/chains'
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// WalletConnect Project ID - replace with your actual project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

// Define the chains we want to support
const chains = [mainnet, sepolia, polygon, arbitrum, base] as const

export const config = createConfig({
  chains,
  connectors: [
    // Injected wallet connector (MetaMask, browser wallets)
    injected(),
    
    // MetaMask connector
    metaMask(),
    
    // WalletConnect v2 connector
    walletConnect({
      projectId,
      metadata: {
        name: 'Booster Collection Cards',
        description: 'Swiss-quality decentralized energy NFT collection platform',
        url: 'https://booster-cards.swiss',
        icons: ['https://booster-cards.swiss/icon.png']
      },
      showQrModal: true,
    }),
    
    // Coinbase Wallet connector
    coinbaseWallet({
      appName: 'Booster Collection Cards',
      appLogoUrl: 'https://booster-cards.swiss/icon.png',
    }),
  ],
  
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  
  // Enable automatic connection on page load
  ssr: true,
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