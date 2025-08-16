'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { WalletIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletConnection() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors"
        >
          <WalletIcon className="h-5 w-5" />
          <span>{formatAddress(address)}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </motion.button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-2">Connected Wallet</div>
              <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                {address}
              </div>
              <button
                onClick={() => {
                  disconnect()
                  setIsOpen(false)
                }}
                className="w-full mt-3 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <WalletIcon className="h-5 w-5" />
        <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-3">Choose a wallet to connect</div>
            <div className="space-y-2">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => {
                    connect({ connector })
                    setIsOpen(false)
                  }}
                  disabled={isPending}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <span className="font-medium">{connector.name}</span>
                  <span className="text-sm text-gray-500">
                    {connector.id === 'io.metamask' && '🦊'}
                    {connector.id === 'walletConnect' && '🔗'}
                    {connector.id === 'coinbase' && '🔵'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

