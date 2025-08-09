'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatAddress } from '@/lib/utils'
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react'
import Image from 'next/image'

export function WalletConnect() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      // You could add a toast notification here
    }
  }

  const handleViewOnExplorer = () => {
    if (address) {
      const explorerUrl = chainId === 1 
        ? `https://etherscan.io/address/${address}`
        : `https://sepolia.etherscan.io/address/${address}`
      window.open(explorerUrl, '_blank')
    }
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            className="flex items-center gap-3 h-12 px-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {/* Avatar */}
            <div className="relative">
              {ensAvatar ? (
                <Image
                  src={ensAvatar}
                  alt="ENS Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                  {address.slice(2, 4).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Address/ENS */}
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-900">
                {ensName || formatAddress(address)}
              </span>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  {chainId === 1 ? 'Mainnet' : 'Sepolia'}
                </Badge>
              </div>
            </div>

            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </Button>
        </motion.div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu */}
              <motion.div
                className="absolute top-full right-0 mt-2 w-80 z-50"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="shadow-xl border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      {ensAvatar ? (
                        <Image
                          src={ensAvatar}
                          alt="ENS Avatar"
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-medium">
                          {address.slice(2, 4).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          {ensName || 'Wallet Connected'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 font-mono">
                          {formatAddress(address)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Network Info */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Network</span>
                      <Badge variant={chainId === 1 ? 'success' : 'warning'}>
                        {chainId === 1 ? 'Ethereum Mainnet' : 'Sepolia Testnet'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10"
                        onClick={handleCopyAddress}
                      >
                        <Copy className="w-4 h-4 mr-3" />
                        Copy Address
                      </Button>

                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10"
                        onClick={handleViewOnExplorer}
                      >
                        <ExternalLink className="w-4 h-4 mr-3" />
                        View on Explorer
                      </Button>

                      <hr className="my-3" />

                      <Button
                        variant="ghost"
                        className="w-full justify-start h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          disconnect()
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <motion.div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl text-gray-900">
            Connect Your Wallet
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Choose your preferred wallet to access your NFT collection
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {connectors.map((connector) => (
            <motion.div
              key={connector.uid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full h-14 justify-between bg-white hover:bg-gray-50 border-gray-200"
                onClick={() => connect({ connector })}
                disabled={isPending}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    {getConnectorIcon(connector.name)}
                  </div>
                  <span className="font-medium text-gray-900">
                    {connector.name}
                  </span>
                </div>
                
                {isPending && (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                )}
              </Button>
            </motion.div>
          ))}

          {/* Swiss Quality Assurance */}
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border border-red-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg"></span>
              <span className="font-medium text-gray-900">Swiss Quality</span>
            </div>
            <p className="text-sm text-gray-600">
              Your connection is secured with Swiss-standard encryption and privacy protection.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function getConnectorIcon(name: string) {
  switch (name.toLowerCase()) {
    case 'metamask':
      return '🦊'
    case 'walletconnect':
      return '🔗'
    case 'coinbase wallet':
      return '🔵'
    case 'injected':
      return '💳'
    default:
      return '👛'
  }
}