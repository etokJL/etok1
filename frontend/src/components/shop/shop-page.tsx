'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCartIcon, 
  CurrencyDollarIcon, 
  GiftIcon,
  SparklesIcon,
  CubeIcon
} from '@heroicons/react/24/outline'
import { useShop } from '@/hooks/useShop'
import { PurchaseSuccessModal } from './purchase-success-modal'
import { useAccount } from 'wagmi'
import { ShopCard } from './shop-card'
import { USDTBalance } from './usdt-balance'
import { ShopStats } from './shop-stats'

const ENERGY_TYPES = [
  { id: 1, name: 'Solar Panel', icon: '☀️', description: 'Harness the power of the sun' },
  { id: 2, name: 'Wind Turbine', icon: '💨', description: 'Generate energy from wind' },
  { id: 3, name: 'Hydroelectric', icon: '💧', description: 'Power from flowing water' },
  { id: 4, name: 'Geothermal', icon: '🌋', description: 'Energy from Earth\'s core' },
  { id: 5, name: 'Biomass', icon: '🌱', description: 'Renewable organic energy' },
  { id: 6, name: 'Nuclear', icon: '⚛️', description: 'Clean atomic power' },
  { id: 7, name: 'E-Bike Battery', icon: '🔋', description: 'Portable electric storage' },
  { id: 8, name: 'Smart Grid', icon: '🔌', description: 'Intelligent energy distribution' },
  { id: 9, name: 'Fuel Cell', icon: '🧪', description: 'Hydrogen-powered energy' },
  { id: 10, name: 'Tidal', icon: '🌊', description: 'Ocean wave energy' },
  { id: 11, name: 'Carbon Capture', icon: '🏭', description: 'Clean air technology' },
  { id: 12, name: 'Energy Storage', icon: '📦', description: 'Grid-scale batteries' },
  { id: 13, name: 'Micro Inverter', icon: '⚡', description: 'Solar power conversion' },
  { id: 14, name: 'Heat Pump', icon: '🔥', description: 'Efficient heating system' },
  { id: 15, name: 'LED Efficiency', icon: '💡', description: 'Energy-saving lighting' }
]

export function ShopPage() {
  const { address } = useAccount()
  const {
    prices,
    shopStats,
    usdtBalance,
    isProcessing,
    error,
    showSuccessModal,
    lastPurchase,
    purchaseQuestNFTPackage,
    purchaseSingleQuestNFT,
    purchasePlantToken,
    getUSDTFromFaucet,
    formatUSDT,
    canAfford,
    closeSuccessModal,
    contractsLoaded,
    contractsError
  } = useShop()

  const [selectedNFTType, setSelectedNFTType] = useState<number | null>(null)
  const [plantName, setPlantName] = useState('My Energy Plant')
  const [activeTab, setActiveTab] = useState<'packages' | 'individual' | 'plants'>('packages')

  if (!address) {
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

  // Show loading state while contracts are loading
  if (!contractsLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Shop</h2>
          <p className="text-gray-600">
            {contractsError ? 
              `Contract Error: ${contractsError}` : 
              'Connecting to blockchain contracts...'}
          </p>
          {contractsError && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-4"
        >
          <ShoppingCartIcon className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">NFT Energy Shop</h1>
        </motion.div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Purchase Quest NFTs and Plant Tokens with USDT. Build your renewable energy collection!
        </p>
      </div>

      {/* USDT Balance & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <USDTBalance 
          balance={usdtBalance}
          formatUSDT={formatUSDT}
          onGetFaucet={getUSDTFromFaucet}
          isProcessing={isProcessing}
        />
        {shopStats && <ShopStats stats={shopStats} formatUSDT={formatUSDT} />}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'packages', label: 'NFT Packages', icon: GiftIcon },
            { id: 'individual', label: 'Individual NFTs', icon: CubeIcon },
            { id: 'plants', label: 'Plant Tokens', icon: SparklesIcon }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                activeTab === id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Shop Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'packages' && (
          <motion.div
            key="packages"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ShopCard
              title="Random Quest Package"
              description="Get 5 random Quest NFTs in one package"
              price={prices?.questNFTPackagePrice || 0n}
              formatPrice={formatUSDT}
              canAfford={canAfford(0)}
              isProcessing={isProcessing}
              onPurchase={purchaseQuestNFTPackage}
              icon={<GiftIcon className="h-12 w-12 text-blue-600" />}
              features={[
                '5 Random Quest NFTs',
                'Best value deal',
                'Instant delivery',
                'Random energy types'
              ]}
            />
          </motion.div>
        )}

        {activeTab === 'individual' && (
          <motion.div
            key="individual"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Energy Type</h3>
              <p className="text-gray-600">
                Price: {prices ? formatUSDT(prices.singleQuestNFTPrice) : '...'} USDT per NFT
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {ENERGY_TYPES.map((energyType) => (
                <motion.button
                  key={energyType.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNFTType(energyType.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedNFTType === energyType.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{energyType.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{energyType.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{energyType.description}</div>
                </motion.button>
              ))}
            </div>

            {selectedNFTType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 text-center"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Purchase {ENERGY_TYPES.find(t => t.id === selectedNFTType)?.name} NFT
                </h4>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => purchaseSingleQuestNFT(selectedNFTType)}
                  disabled={!canAfford(1) || isProcessing}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Processing...' : `Buy for ${prices ? formatUSDT(prices.singleQuestNFTPrice) : '...'} USDT`}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'plants' && (
          <motion.div
            key="plants"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <ShopCard
              title="Plant Token"
              description="Create your own energy plant (requires all 15 Quest NFT types)"
              price={prices?.plantTokenPrice || 0n}
              formatPrice={formatUSDT}
              canAfford={canAfford(2)}
              isProcessing={isProcessing}
              onPurchase={() => purchasePlantToken(plantName)}
              icon={<SparklesIcon className="h-12 w-12 text-green-600" />}
              features={[
                'Unique plant creation',
                'Burns all 15 Quest NFTs',
                'Custom plant name',
                'Ultimate achievement'
              ]}
              extraContent={
                <div className="mt-4">
                  <label htmlFor="plantName" className="block text-sm font-medium text-gray-700 mb-2">
                    Plant Name
                  </label>
                  <input
                    id="plantName"
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your plant name"
                  />
                </div>
              }
            />
          </motion.div>
        )}
      </div>
      
      {/* Purchase Success Modal */}
      <PurchaseSuccessModal
        isOpen={showSuccessModal}
        onClose={closeSuccessModal}
        purchaseType={lastPurchase?.type || 'package'}
        purchasedItems={lastPurchase?.items}
      />
    </div>
  )
}

