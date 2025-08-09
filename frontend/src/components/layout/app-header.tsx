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
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b"
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
                <h1 className="text-xl font-bold text-gray-900">Booster</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Energy NFT Collection</p>
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
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
              className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
              animate={{ rotate: [0, 1, -1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="font-medium">Quality</span>
            </motion.div>

            {/* Account Info */}
            {isConnected && address ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-200"
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
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-gray-500 border-b">
                          Connected Account
                        </div>
                        <div className="px-3 py-2 text-sm font-mono text-gray-900">
                          {address}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            disconnect()
                            setIsMenuOpen(false)
                          }}
                          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded text-left"
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
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
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
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
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
              className="md:hidden border-t bg-white"
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
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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