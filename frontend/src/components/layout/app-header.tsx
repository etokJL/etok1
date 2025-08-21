'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useDisconnect } from 'wagmi'
import Link from 'next/link'

interface AppHeaderProps {
  currentPage?: string
}

export function AppHeader({ currentPage = 'collection' }: AppHeaderProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Collection', href: '/collection', icon: '📦', active: currentPage === 'collection' },
    { name: 'Trading', href: '/trading', icon: '💱', active: currentPage === 'trading' },
    { name: 'Plants', href: '/plants', icon: '🌱', active: currentPage === 'plants' },
    { name: 'Market', href: '/market', icon: '🏪', active: currentPage === 'market' },
    { name: 'Analytics', href: '/analytics', icon: '📊', active: currentPage === 'analytics' }
  ]

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-md border-b bg-card/90"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <Link href="/" className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-foreground">Booster</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Energy NFT Collection</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </motion.div>
              </Link>
            ))}
            <Link href="/disclaimer">
              <motion.div
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">📋</span>
                Disclaimer
              </motion.div>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Quality Badge */}
            <motion.div
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm border text-primary border-primary/30 bg-primary/10"
              animate={{ rotate: [0, 1, -1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
            >
              <span className="font-medium">Quality</span>
            </motion.div>

            {/* Account Info */}
            {isConnected && address ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border text-primary border-primary/30 bg-primary/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="hidden sm:inline">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <span className="sm:hidden">Connected</span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border z-50 border-border"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
                          Connected Account
                        </div>
                        <div className="px-3 py-2 text-sm font-mono text-foreground">
                          {address}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            disconnect()
                            setIsMenuOpen(false)
                          }}
                          className="w-full px-3 py-2 text-sm text-destructive hover:bg-accent rounded text-left"
                        >
                          Disconnect
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                className="px-3 py-2 bg-accent text-muted-foreground rounded-lg text-sm"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Not Connected
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t bg-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-2 py-3 space-y-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        item.active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}