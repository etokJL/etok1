'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  CubeIcon, 
  SparklesIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import { WalletConnection } from '@/components/wallet-connection'

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Shop', href: '/shop', icon: ShoppingCartIcon },
  { name: 'Collection', href: '/collection', icon: CubeIcon },
  { name: 'Plants', href: '/plants', icon: SparklesIcon },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <div className="text-2xl font-bold text-blue-600">Booster</div>
                <div className="ml-1 text-sm text-gray-500">Energy</div>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Auth & Wallet Connection */}
          <div className="flex items-center space-x-4">
            {/* Login/Register Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <UserIcon className="h-4 w-4 mr-2" />
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Register
              </Link>
            </div>

            <WalletConnection />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-gray-200 bg-white"
        >
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Mobile Auth Links */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <UserIcon className="h-5 w-5 mr-3" />
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-2"
              >
                <UserPlusIcon className="h-5 w-5 mr-3" />
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
