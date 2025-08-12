'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useDisconnect } from 'wagmi'

interface AppNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  totalNFTs: number
  uniqueTypes: number
  plantsCreated: number
}

export function AppNavigation({ 
  activeTab, 
  onTabChange, 
  totalNFTs, 
  uniqueTypes, 
  plantsCreated 
}: AppNavigationProps) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'collection', label: 'Collection', icon: '🎴', count: totalNFTs },
    { id: 'trading', label: 'Trading', icon: '💱', count: null },
    { id: 'plants', label: 'Plants', icon: '🌱', count: plantsCreated },
    { id: 'quests', label: 'Quests', icon: '⚡', count: null },
  ]

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🇨🇭</div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Booster Collection</h1>
                <p className="text-xs text-muted-foreground">Energy NFTs</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  type="button"
                >
                  <div className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className="bg-accent text-muted-foreground px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </div>
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeTab"
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              {address && (
                <div className="flex items-center space-x-2 bg-accent px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Connected</div>
                    <div className="font-mono font-medium text-foreground">{formatAddress(address)}</div>
                  </div>
                </div>
              )}
              <button
                onClick={() => disconnect()}
                className="btn btn-outline text-sm"
                type="button"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-card border-b border-border shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Header */}
            <div className="flex items-center space-x-3">
              <div className="text-xl">🇨🇭</div>
              <div>
                <h1 className="text-base font-bold text-foreground">Booster Collection</h1>
                <p className="text-xs text-muted-foreground">Energy NFTs</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-accent"
              type="button"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className={`w-5 h-0.5 bg-gray-600 transition-all ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`} />
                <div className={`w-5 h-0.5 bg-gray-600 transition-all ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <div className={`w-5 h-0.5 bg-gray-600 transition-all ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                 className="mt-4 space-y-2"
              >
                {/* Mobile Navigation Tabs */}
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {tab.count !== null && (
                      <span className="bg-accent text-muted-foreground px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}

                {/* Mobile User Info */}
                <div className="border-t pt-3 mt-3">
                  {address && (
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Connected Wallet</div>
                        <div className="font-mono text-sm font-medium text-gray-900">{formatAddress(address)}</div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => disconnect()}
                    className="w-full btn btn-outline text-sm"
                    type="button"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Bar (Mobile) */}
       <div className="md:hidden bg-secondary border-b border-border">
        <div className="px-4 py-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
               <div className="text-lg font-bold text-primary">{totalNFTs}</div>
               <div className="text-xs text-muted-foreground">Total NFTs</div>
            </div>
            <div className="text-center">
               <div className="text-lg font-bold text-primary">{uniqueTypes}</div>
               <div className="text-xs text-muted-foreground">Unique Types</div>
            </div>
            <div className="text-center">
               <div className="text-lg font-bold text-primary">{plantsCreated}</div>
               <div className="text-xs text-muted-foreground">Plants</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
