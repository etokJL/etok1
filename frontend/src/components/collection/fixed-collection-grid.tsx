'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnhancedNFTCard } from '@/components/cards/enhanced-nft-card'
import { ListNFTCard } from '@/components/cards/list-nft-card'
import { UserNFT, ViewMode, SortOption, FilterOption, PlantCreationProgress, CollectionStats } from '@/types/nft'

interface FixedCollectionGridProps {
  nfts: UserNFT[]
  onNFTSelect?: (nft: UserNFT) => void
  onCreatePlant?: (selectedNFTs: UserNFT[]) => void
}

export function FixedCollectionGrid({ nfts, onNFTSelect, onCreatePlant }: FixedCollectionGridProps) {
  const [selectedNFTs, setSelectedNFTs] = useState<UserNFT[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Statistics
  const stats: CollectionStats = useMemo(() => ({
    totalNFTs: nfts.reduce((sum, nft) => sum + nft.quantity, 0),
    uniqueTypes: nfts.filter(nft => nft.quantity > 0).length,
    plantsCreated: 0, // TODO: Get from contract
    totalEnergyGenerated: 0 // TODO: Calculate from plants
  }), [nfts])

  // Plant creation progress
  const plantProgress: PlantCreationProgress = useMemo(() => {
    const uniqueSelectedTypes = new Set(selectedNFTs.map(nft => nft.nftType.id)).size
    return {
      selectedNFTs,
      requiredTypes: 15,
      isComplete: uniqueSelectedTypes === 15,
      canCreate: uniqueSelectedTypes === 15
    }
  }, [selectedNFTs])

  // Filter and sort NFTs
  const filteredAndSortedNFTs = useMemo(() => {
    let filtered = nfts.filter(nft => nft.quantity > 0)

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(nft => 
        nft.nftType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.nftType.energyType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply energy type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(nft => 
        nft.nftType.energyType.toLowerCase() === filterBy
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nftType.name.localeCompare(b.nftType.name)
        case 'rarity': {
          const rarityOrder = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5 }
          return rarityOrder[b.nftType.rarity] - rarityOrder[a.nftType.rarity]
        }
        case 'quantity':
          return b.quantity - a.quantity
        case 'recent':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [nfts, searchTerm, filterBy, sortBy])

  const handleNFTSelect = (nft: UserNFT) => {
    setSelectedNFTs(prev => {
      const isSelected = prev.some(selected => selected.tokenId === nft.tokenId)
      if (isSelected) {
        return prev.filter(selected => selected.tokenId !== nft.tokenId)
      } else {
        return [...prev, nft]
      }
    })
    
    if (onNFTSelect) {
      onNFTSelect(nft)
    }
  }

  const handleCreatePlant = () => {
    if (plantProgress.canCreate && onCreatePlant) {
      onCreatePlant(selectedNFTs)
      setSelectedNFTs([])
    }
  }

  const clearSelection = () => {
    setSelectedNFTs([])
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  // Get grid classes based on view mode
  const getGridClasses = () => {
    if (viewMode === 'grid') {
      return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4'
    }
    return 'grid grid-cols-1 gap-4'
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Energy Collection</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Swiss Quality</span>
            <span className="text-lg">🇨🇭</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalNFTs}</div>
            <div className="text-sm text-gray-600">Total NFTs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.uniqueTypes}</div>
            <div className="text-sm text-gray-600">Unique Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.plantsCreated}</div>
            <div className="text-sm text-gray-600">Plants Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalEnergyGenerated}</div>
            <div className="text-sm text-gray-600">Energy Generated</div>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="card p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="solar">☀️ Solar</option>
            <option value="wind">💨 Wind</option>
            <option value="hydro">🌊 Hydro</option>
            <option value="storage">🔋 Storage</option>
            <option value="smart">🏠 Smart</option>
            <option value="transport">🚗 Transport</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="rarity">Sort by Rarity</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="recent">Sort by Recent</option>
          </select>

          {/* View Mode */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              List
            </button>
          </div>
        </div>
      </motion.div>

      {/* NFT Grid */}
      <motion.div
        className={getGridClasses()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredAndSortedNFTs.map((nft) => (
            <motion.div
              key={nft.tokenId.toString()}
              variants={itemVariants}
              layout
            >
              {viewMode === 'grid' ? (
                <EnhancedNFTCard
                  nft={nft}
                  onSelect={handleNFTSelect}
                  isSelected={selectedNFTs.some(selected => selected.tokenId === nft.tokenId)}
                  showQuantity={true}
                  animate={true}
                />
              ) : (
                <ListNFTCard
                  nft={nft}
                  onSelect={handleNFTSelect}
                  isSelected={selectedNFTs.some(selected => selected.tokenId === nft.tokenId)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Plant Creation Panel */}
      <AnimatePresence>
        {selectedNFTs.length > 0 && (
          <motion.div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="card p-4 shadow-xl bg-white border-2 border-blue-200">
              <div className="flex items-center gap-4">
                {/* Progress */}
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">
                    Plant Progress: {new Set(selectedNFTs.map(nft => nft.nftType.id)).size} / 15
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(new Set(selectedNFTs.map(nft => nft.nftType.id)).size / 15) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Selected NFTs Preview */}
                <div className="flex -space-x-2">
                  {selectedNFTs.slice(0, 5).map((nft, index) => (
                    <motion.div
                      key={nft.tokenId.toString()}
                      className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center text-xs"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {nft.nftType.name.charAt(0)}
                    </motion.div>
                  ))}
                  {selectedNFTs.length > 5 && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs">
                      +{selectedNFTs.length - 5}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="btn btn-outline text-sm"
                  >
                    Clear
                  </button>
                  <motion.button
                    onClick={handleCreatePlant}
                    disabled={!plantProgress.canCreate}
                    className={`btn text-sm ${
                      plantProgress.canCreate 
                        ? 'btn-primary' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    whileTap={plantProgress.canCreate ? { scale: 0.95 } : {}}
                  >
                    🌱 Create Plant
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredAndSortedNFTs.length === 0 && (
        <motion.div
          className="card p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterBy !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Start collecting energy NFTs to build your portfolio!'}
          </p>
        </motion.div>
      )}
    </div>
  )
}




