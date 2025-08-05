'use client'

import { WagmiConfig } from 'wagmi'
import { config } from '../wagmi'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={config}>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-600 text-white p-4">
              <h1 className="text-2xl font-bold">Booster NFT dApp - Test Environment</h1>
            </nav>
            <main className="container mx-auto p-4">
              {children}
            </main>
          </div>
        </WagmiConfig>
      </body>
    </html>
  )
}