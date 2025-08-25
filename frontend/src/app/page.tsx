'use client'

import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo, useCallback } from 'react'

import { ResponsiveGridWithDetail } from '@/components/collection/responsive-grid-with-detail'

import { AppNavigation } from '@/components/navigation/app-navigation'
import { TradingInterface } from '@/components/trading/trading-interface'
import { useContracts } from '@/hooks/useContracts'
import { useBlockchainNFTData, useBlockchainPlantData } from '@/hooks/useBlockchainData'




import { PlantCreationPanel } from '@/components/plants/plant-creation-panel'
import { PurchaseSuccessModal } from '@/components/shop/purchase-success-modal'
import { NFT_TYPES } from '@/lib/constants'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
// import type { UserNFT } from '@/types/nft'



export default function SimplePage() {
  const { address, isConnected } = useAccount()
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

  // EXACT same wallet check as Shop page
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingCartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the shop</p>
        </div>
      </div>
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
      {/* Main App Content */}
      <div className="flex flex-col min-h-screen">{/* Main App Content starts here */}
        {/* App Navigation */}
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