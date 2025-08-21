'use client'

import { useAccount, useConnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useMemo } from 'react'

import { ResponsiveGridWithDetail } from '@/components/collection/responsive-grid-with-detail'

import { AppNavigation } from '@/components/navigation/app-navigation'
import { TradingInterface } from '@/components/trading/trading-interface'
import { useContracts } from '@/hooks/useContracts'
import { useBlockchainNFTData, useBlockchainPlantData, useCanCreatePlant } from '@/hooks/useBlockchainData'
import { useAutoConnect } from '@/hooks/useAutoConnect'

import { PageTemplate } from '@/components/layout/page-template'
import { PageHeader } from '@/components/layout/page-header'

import { PlantCreationPanel } from '@/components/plants/plant-creation-panel'
import { PurchaseSuccessModal } from '@/components/shop/purchase-success-modal'
import { NFT_TYPES } from '@/lib/constants'
// import type { UserNFT } from '@/types/nft'



export default function SimplePage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { isAutoConnecting, hasAttempted } = useAutoConnect()
  const { questNFT, plantToken } = useContracts()
  
  const [activeTab, setActiveTab] = useState('collection')
  // On-Chain Daten Hooks
  const blockchainNFTData = useBlockchainNFTData()
  const blockchainPlantData = useBlockchainPlantData()
  // canCreatePlant wird in PlantCreationPanel direkt abgefragt
  
  // Pure On-Chain Daten - keine Legacy States
  const totalNFTs = blockchainNFTData.totalNFTs
  const uniqueTypes = blockchainNFTData.uniqueTypes  
  const plantsCreated = blockchainPlantData.plantsCreated

  // Debug: Log when plantsCreated changes
  useEffect(() => {
    console.log('🌱 Navigation plantsCreated value changed:', plantsCreated, 'Key will be: nav-' + plantsCreated)
  }, [plantsCreated])



  // Pure blockchain data transformation to UserNFT format
  const transformedNFTs = useMemo(() => {
    return blockchainNFTData.nfts.map((nft) => {
      // Get the correct NFT type data from constants
      const nftTypeData = NFT_TYPES.find(type => type.id === nft.nftType)
      
      return {
        tokenId: BigInt(nft.tokenId.replace(/[^0-9]/g, '') || '1'),
        nftType: {
          id: nft.nftType,
          name: nftTypeData?.name || nft.name,
          description: `Swiss Energy NFT - ${nftTypeData?.displayName || nft.name}`,
          energyType: 'Solar' as const,
          rarity: 'Rare' as const,
          image: nftTypeData?.image || 'placeholder.png' // Use correct image from constants
        },
        quantity: 1,
        lastUpdated: new Date(),
        originalTokenId: nft.tokenId,
        uniqueId: `blockchain-${nft.tokenId}-${nft.nftType}`
      }
    })
  }, [blockchainNFTData.nfts])



  

  // Backend-Fetch entfernt - verwende nur On-Chain Daten
  const refreshData = useCallback(async () => {
    console.log('🔄 Refreshing on-chain data...')
    blockchainNFTData.refresh()
    blockchainPlantData.refresh()
  }, [blockchainNFTData.refresh, blockchainPlantData.refresh])

  // Auto-refresh plant data when plant is created
  const handlePlantCreated = useCallback(async () => {
    console.log('🌱 Plant created, refreshing data...')
    
    // Small delay to allow blockchain to propagate
    setTimeout(async () => {
      console.log('🔄 Starting data refresh after plant creation...')
      blockchainNFTData.refresh() // Refresh NFTs (they should be burned)
      await blockchainPlantData.forceRefresh() // Force refresh plant data
      
      // Force a small delay and re-render trigger to ensure navigation updates
      setTimeout(() => {
        console.log('🔄 Final refresh trigger for navigation update...')
        blockchainPlantData.refresh() // Additional refresh to trigger React re-render
        console.log('✅ All data refresh completed after plant creation')
      }, 1000) // Additional 1 second delay
    }, 2000) // 2 second delay
  }, [blockchainNFTData.refresh, blockchainPlantData.forceRefresh, blockchainPlantData.refresh])





  useEffect(() => {
    if (isConnected && address) {
      console.log('🔗 Wallet connected, refreshing blockchain data...')
      refreshData()
    }
  }, [isConnected, address, refreshData])

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  if (!isConnected && hasAttempted) {
    return (
      <PageTemplate
        header={<PageHeader title="Connect Your Wallet" description="Choose your preferred wallet to access your NFT collection" />}
      >
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="w-full max-w-md mx-auto"
        >
          <div className="card">
            <div className="card-content">
              <div className="space-y-4">
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    disabled={isPending}
                    className="btn btn-outline w-full"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {connector.name === 'MetaMask' ? '🦊' : 
                         connector.name === 'WalletConnect' ? '🔗' : 
                         connector.name === 'Coinbase Wallet' ? '🔵' : '💳'}
                      </div>
                      <span className="font-semibold text-foreground">{connector.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </PageTemplate>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 overflow-y-auto"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
    >
      {/* Show loading during auto-connect attempt */}
      {(isAutoConnecting || isPending || (!hasAttempted && !isConnected)) ? (
        <div className="flex items-center justify-center min-h-screen bg-secondary">
          <div className="text-center max-w-md mx-auto">
            <motion.div
              className="text-8xl mb-6"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              🇨🇭
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-foreground mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Booster Collection
            </motion.h1>
            <motion.p 
              className="text-muted-foreground text-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isAutoConnecting || isPending ? 'Connecting to your wallet...' : 'Initializing Swiss Energy NFTs...'}
            </motion.p>
            
            {/* Loading Animation */}
            <motion.div
              className="flex justify-center space-x-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            <motion.div 
              className="text-sm text-muted-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Powered by Swiss Technology ⚡
            </motion.div>

            {/* Skip Button after 2 seconds */}
            <motion.button
              className="text-primary hover:text-foreground text-sm font-medium transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={() => {
                // Force stop auto-connect and show manual connection
                if (typeof window !== 'undefined') {
                  localStorage.setItem('skipAutoConnect', 'true')
                }
                window.location.reload()
              }}
            >
              Connect manually instead →
            </motion.button>
          </div>
        </div>
      ) : !isConnected ? (
        /* Fallback manual connection if auto-connect fails */
        <div className="flex items-center justify-center min-h-screen bg-secondary">
          <div className="text-center max-w-md mx-auto">
            <motion.div
              className="text-6xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              🔐
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Connect Your Wallet</h1>
            <p className="text-muted-foreground mb-8">Choose your preferred wallet to access your Swiss Energy NFT Collection</p>
            
            <div className="space-y-3">
              {connectors.slice(0, 3).map((connector) => (
                <motion.button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  disabled={isPending}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-2xl">
                      {connector.name === 'MetaMask' ? '🦊' : 
                       connector.name === 'WalletConnect' ? '🔗' : 
                       connector.name === 'Coinbase Wallet' ? '🔵' : '💳'}
                    </div>
                  <span className="font-semibold text-foreground">{connector.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <AppNavigation
            key={`nav-${plantsCreated}`} // Force re-render when plantsCreated changes
            activeTab={activeTab}
            onTabChange={setActiveTab}
            totalNFTs={totalNFTs}
            uniqueTypes={uniqueTypes}
            plantsCreated={plantsCreated}
          />
          <main className="flex-1 bg-background py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {activeTab === 'collection' && (
                <motion.div
                  key="collection"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ResponsiveGridWithDetail
                    nfts={transformedNFTs}
                    onNFTSelect={(nft) => {
                      console.log('NFT selected:', nft.nftType.name)
                      // Pure blockchain NFT selection - no legacy token conversion needed
                    }}
                  />
                </motion.div>
              )}
              {activeTab === 'trading' && (
                <motion.div
                  key="trading"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <TradingInterface
                    userTokens={[]} // Trading disabled - pure blockchain approach
                    onTradeComplete={refreshData}
                  />
                </motion.div>
              )}
              {activeTab === 'plants' && (
                <motion.div
                  key="plants"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4"
                >
                  <PlantCreationPanel
                    questNFTs={transformedNFTs}
                    isCreating={plantToken.isLoading}
                    onCreate={async (plantName) => {
                      console.log('📱 App.tsx onCreate called with:', plantName)
                      console.log('plantToken.isLoading:', plantToken.isLoading)
                      console.log('plantToken.error:', plantToken.error)
                      
                      try {
                        console.log('🚀 Calling plantToken.createPlant...')
                        await plantToken.createPlant(plantName)
                        console.log('✅ createPlant completed, triggering refresh...')
                        handlePlantCreated() // Auto-refresh after creation
                        console.log('✅ Data refresh triggered')
                      } catch (error) {
                        console.error('❌ Error in onCreate:', error)
                      }
                    }}
                  />
                </motion.div>
              )}
              {activeTab === 'quests' && (
                <motion.div
                  key="quests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4"
                >
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">⚡</div>
                    <h2 className="text-xl font-semibold mb-2">Energy Quests</h2>
                    <p className="text-gray-600">Complete quests to earn more NFTs</p>
                    <button 
                      className="btn btn-primary mt-4"
                      onClick={() => questNFT.purchasePackage()}
                      disabled={questNFT.isLoading}
                      type="button"
                    >
                      {questNFT.isLoading ? 'Purchasing...' : 'Purchase Weekly Package'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </main>
        </div>
      )}

      
      {/* Plant Creation Success Modal */}
      <PurchaseSuccessModal
        isOpen={plantToken.showSuccessModal}
        onClose={plantToken.closeSuccessModal}
        purchaseType="plant"
        purchasedItems={{
          plantName: plantToken.lastCreatedPlant?.name,
          tokenId: plantToken.lastCreatedPlant?.tokenId
        }}
      />

      {/* Animation system removed - NFTs no longer animate on mint/burn */}

      {/* Pure blockchain error handling is done in individual components */}
    </motion.div>
  )
}