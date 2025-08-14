'use client'

import { useAccount, useConnect } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { BackendToken } from '@/types'
import { ResponsiveGridWithDetail } from '@/components/collection/responsive-grid-with-detail'
import { TokenDetailModal } from '@/components/cards/token-detail-modal'
import { AppNavigation } from '@/components/navigation/app-navigation'
import { TradingInterface } from '@/components/trading/trading-interface'
import { useContracts } from '@/hooks/useContracts'
import { useBlockchainNFTData, useBlockchainPlantData, useCanCreatePlant } from '@/hooks/useBlockchainData'
import { useAutoConnect } from '@/hooks/useAutoConnect'
import { AnimationQueueManager } from '@/components/animations/animation-queue-manager'
import { PageTemplate } from '@/components/layout/page-template'
import { PageHeader } from '@/components/layout/page-header'
import { clientSessionAPI } from '@/lib/clientSessionAPI'
import { PlantCreationPanel } from '@/components/plants/plant-creation-panel'
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
  
  // Legacy state für Kompatibilität mit bestehenden Components
  const [tokens, setTokens] = useState<BackendToken[]>([])
  
  // On-Chain Daten als primäre Quelle
  const totalNFTs = blockchainNFTData.totalNFTs
  const uniqueTypes = blockchainNFTData.uniqueTypes  
  const plantsCreated = blockchainPlantData.plantsCreated
  const [selectedToken, setSelectedToken] = useState<BackendToken | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // const [isLoadingTokens, setIsLoadingTokens] = useState(false)
  const hasFetchedOnceRef = useRef(false)



  const getRarityForNFT = useCallback((): string => {
    // Simplified rarity calculation for now
    return 'Rare'
  }, [])

  const getEnergyTypeFromName = useCallback((name: string): string => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('solar') || lowerName.includes('panel')) return 'Solar'
    if (lowerName.includes('wind') || lowerName.includes('turbine')) return 'Wind'
    if (lowerName.includes('hydro') || lowerName.includes('water')) return 'Hydro'
    if (lowerName.includes('battery') || lowerName.includes('storage')) return 'Storage'
    if (lowerName.includes('smart') || lowerName.includes('home') || lowerName.includes('meter')) return 'Smart'
    if (lowerName.includes('car') || lowerName.includes('bike') || lowerName.includes('transport')) return 'Transport'
    return 'Solar' // Default
  }, [])

  const getImageForToken = useCallback((name: string, id: number): string => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('solar') || lowerName.includes('panel')) return 'solar-panel.png'
    if (lowerName.includes('wind') || lowerName.includes('turbine')) return 'smart-home.png'
    if (lowerName.includes('battery') || lowerName.includes('home')) return 'home-battery.png'
    if (lowerName.includes('smart') && lowerName.includes('home')) return 'smart-home.png'
    if (lowerName.includes('smart') && lowerName.includes('meter')) return 'smart-meter.png'
    if (lowerName.includes('smartphone')) return 'smartphone.png'
    if (lowerName.includes('power') && lowerName.includes('bank')) return 'power-bank.png'
    if (lowerName.includes('car') || lowerName.includes('e-car')) return 'e-car.png'
    if (lowerName.includes('bike') || lowerName.includes('e-bike')) return 'e-bike.png'
    if (lowerName.includes('scooter') || lowerName.includes('e-scooter')) return 'e-scooter.png'
    if (lowerName.includes('roller') || lowerName.includes('e-roller')) return 'e-roller.png'
    if (lowerName.includes('heat') || lowerName.includes('pump')) return 'heat-pump.png'
    if (lowerName.includes('boiler')) return 'electric-boiler.png'
    if (lowerName.includes('charging') || lowerName.includes('station')) return 'charging-station.png'
    if (lowerName.includes('controller')) return 'charge-controller.png'
    if (lowerName.includes('inverter')) return 'solar-inverter.png'
    // Default fallback based on ID
    const images = [
      'solar-panel.png', 'home-battery.png', 'smart-home.png', 'e-car.png', 
      'smart-meter.png', 'heat-pump.png', 'e-bike.png', 'smartphone.png',
      'power-bank.png', 'charging-station.png', 'e-scooter.png', 'e-roller.png',
      'electric-boiler.png', 'charge-controller.png', 'solar-inverter.png'
    ]
    return images[(id - 1) % images.length]
  }, [])



  // Konvertiere On-Chain NFTs zu Legacy-Format für bestehende UI-Components
  useEffect(() => {
    if (isConnected && blockchainNFTData.nfts.length > 0) {
      console.log('🔗 Converting on-chain NFTs to display format...')
      
      const nowIso = new Date().toISOString()
      const convertedTokens: BackendToken[] = blockchainNFTData.nfts.map((nft, index) => ({
        id: index + 1,
        contract_address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // NEW QuestNFT contract
        owner_address: address || '',
        token_id: nft.tokenId,
        name: nft.name,
        token_type: 'erc721',
        created_at: nowIso,
        updated_at: nowIso,
      }))
      
      setTokens(convertedTokens)
      console.log(`✅ Converted ${convertedTokens.length} on-chain NFTs for display`)
    } else if (!isConnected) {
      // Wenn nicht verbunden, zeige leere Liste (keine Mock-Daten mehr)
      setTokens([])
      console.log('❌ Not connected - showing empty token list')
    }
  }, [isConnected, address, blockchainNFTData.nfts])

  // Backend-Fetch entfernt - verwende nur On-Chain Daten
  const refreshData = useCallback(async () => {
    console.log('🔄 Refreshing on-chain data...')
    blockchainNFTData.refresh()
    blockchainPlantData.refresh()
  }, [blockchainNFTData, blockchainPlantData])

  // Zentrale NFT-Transformation - nur einmal definiert
  const transformedNFTs = useMemo(() => {
    return tokens.map((token, index) => {
      const originalTokenId = String(token.token_id);
      const displayId = index + 1;
      // Stabiler Key basierend auf originalTokenId und index
      const stableKey = `nft-${originalTokenId}-${index}`;
      
      return {
        tokenId: BigInt(originalTokenId.replace(/[^0-9]/g, '') || (index + 1)),
        nftType: {
          id: displayId,
          name: token.name || `NFT Type ${displayId}`,
          description: `A ${token.token_type} token from Swiss Energy Collection`,
          energyType: getEnergyTypeFromName(token.name || '') as 'Solar' | 'Wind' | 'Hydro' | 'Storage' | 'Smart' | 'Transport',
          rarity: getRarityForNFT() as 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary',
          image: getImageForToken(token.name || '', displayId)
        },
        quantity: 1,
        lastUpdated: new Date(),
        originalTokenId: originalTokenId,
        uniqueId: stableKey // Stabiler Key für React
      };
    });
  }, [tokens, getEnergyTypeFromName, getRarityForNFT, getImageForToken])

  const handleTokenClick = useCallback((token: BackendToken) => {
    setSelectedToken(token)
    setShowDetailModal(true)
  }, [])

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false)
    setSelectedToken(null)
  }, [])

  useEffect(() => {
    if (isConnected && address && !hasFetchedOnceRef.current) {
      hasFetchedOnceRef.current = true
      console.log('🔗 Attempting to connect to backend...')
      refreshData()
      // Session init (non-blocking)
      clientSessionAPI
        .initSession(address)
        .catch(error => console.log('💾 Session init skipped:', error.message))
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
                localStorage.setItem('skipAutoConnect', 'true')
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
                      // Find token by originalTokenId or by index
                      const token = tokens.find((t, index) => {
                        const originalTokenId = String(t.token_id);
                        return nft.originalTokenId === originalTokenId || nft.nftType.id === (index + 1);
                      });
                      if (token) handleTokenClick(token)
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
                    userTokens={tokens}
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
                        console.log('✅ createPlant completed, refreshing data...')
                        await refreshData()
                        console.log('✅ Backend data refreshed')
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
      <TokenDetailModal
        token={selectedToken}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
      />
      
      {/* Animation Queue Manager */}
      {isConnected && address && (
        <AnimationQueueManager
          nfts={transformedNFTs}
          walletAddress={address}
          onAnimationComplete={(animation) => {
            console.log('Animation completed:', animation.type, animation.nft.nftType.name)
          }}
        />
      )}

      {/* Fehleranzeige statt Demodaten */}
      {errorMessage && (
        <div className="fixed top-16 right-4 z-40 px-3 py-2 rounded-md border text-sm bg-red-50 text-red-800 border-red-200 shadow">
          {errorMessage}
        </div>
      )}
    </motion.div>
  )
}