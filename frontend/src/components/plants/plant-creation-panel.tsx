'use client'

import { useMemo, useState } from 'react'
import type { UserNFT } from '@/types/nft'
import { motion, AnimatePresence } from 'framer-motion'
import { useBlockchainNFTData, useCanCreatePlant } from '@/hooks/useBlockchainData'
import { NFT_TYPES } from '@/lib/constants'

interface PlantCreationPanelProps {
  questNFTs: UserNFT[] // Legacy prop - wird durch on-chain Daten ersetzt
  onCreate: (plantName: string) => Promise<void> | void
  isCreating?: boolean
}

// Use central NFT_TYPES instead of custom REQUIRED_TYPES
// All 15 NFT types are required for plant creation

const energyIcons: Record<string, string> = {
  Solar: '☀️',
  Wind: '💨',
  Hydro: '🌊',
  Storage: '🔋',
  Smart: '🏠',
  Transport: '🚗',
}

export function PlantCreationPanel({ onCreate, isCreating }: PlantCreationPanelProps) {
  const [plantName, setPlantName] = useState<string>('My Energy Plant')
  
  // Verwende direkte On-Chain Daten
  const blockchainNFTData = useBlockchainNFTData()
  const { canCreate: canCreateFromContract } = useCanCreatePlant()

  const { ownedTypeIds, ownedCount, totalNFTs } = useMemo(() => {
    const ownedIds = new Set<number>()
    
    console.log('🔍 PlantCreationPanel - Analyzing NFTs:', {
      totalNFTs: blockchainNFTData.nfts.length,
      firstFew: blockchainNFTData.nfts.slice(0, 5).map(nft => `${nft.name} (Type ${nft.nftType})`)
    })
    
    // Analysiere die On-Chain NFTs nach UNIQUE Typen (für Plant Creation)
    blockchainNFTData.nfts.forEach((nft) => {
      ownedIds.add(nft.nftType)
    })
    
    const ownedTypesArray = Array.from(ownedIds).sort()
    const missingTypes = NFT_TYPES.filter(t => !ownedIds.has(t.id)).map(t => t.id)
    
    console.log('📊 Plant Creation Analysis:', {
      totalNFTs: blockchainNFTData.nfts.length,
      uniqueTypes: ownedTypesArray,
      uniqueCount: ownedIds.size,
      missingTypes: missingTypes,
      canCreateFromContract: canCreateFromContract
    })
    
    return { 
      ownedTypeIds: ownedIds, 
      ownedCount: ownedIds.size,
      totalNFTs: blockchainNFTData.nfts.length
    }
  }, [blockchainNFTData.nfts, canCreateFromContract])

  // Verwende direkte Contract-Prüfung statt lokaler Logik
  const canCreate = canCreateFromContract && plantName.trim().length > 0

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Plant Token</h2>
          <div className="text-sm text-gray-600">
            Total NFTs: {totalNFTs} | Unique Types: {ownedCount}/15
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="text-sm font-medium">Progress</div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${(ownedCount / NFT_TYPES.length) * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="text-sm font-semibold text-gray-800">{ownedCount} / {NFT_TYPES.length}</div>
        </div>

        {/* Required Types Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {NFT_TYPES.map((t) => {
            const isOwned = ownedTypeIds.has(t.id)
            const onChainNFT = blockchainNFTData.nfts.find(nft => nft.nftType === t.id)
            return (
              <div key={t.id} className={`relative rounded-xl border overflow-hidden ${isOwned ? 'border-green-200 bg-white' : 'border-gray-200 bg-gray-50'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/metadata/images/${t.image}`}
                  alt={t.displayName}
                  className={`w-full h-28 object-cover ${isOwned ? '' : 'opacity-40'} transition-opacity`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                {/* Fallback icon for missing image */}
                <div className={`hidden absolute inset-0 items-center justify-center ${isOwned ? '' : 'opacity-40'}`}>
                  <div className="text-3xl">⚡</div>
                </div>
                {/* Metadata (hidden for missing) */}
                <div className={`p-3 ${isOwned ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="text-sm font-semibold text-gray-900 truncate">{onChainNFT?.name || t.displayName}</div>
                  <div className="text-xs text-gray-600">Type {t.id}</div>
                </div>
                {!isOwned && (
                  <div className="absolute inset-0 bg-white/30" />
                )}
                <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-white/80 border">
                  {isOwned ? 'Owned' : 'Missing'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Burn and Create Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Will be burned */}
        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-3">Will be burned</h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {NFT_TYPES.filter(t => ownedTypeIds.has(t.id)).map((t) => (
                <motion.div
                  key={t.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/metadata/images/${t.image}`} alt={t.displayName} className="w-6 h-6 rounded" />
                  <span className="text-sm font-medium">{t.displayName}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {ownedCount === 0 && (
              <div className="text-sm text-gray-500">No eligible NFTs found</div>
            )}
          </div>
        </div>

        {/* Arrow / Action */}
        <div className="card p-5 flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">➡️</div>
          <div className="w-full">
            <label htmlFor="plant-name" className="block text-sm font-medium text-gray-700 mb-2">Plant name</label>
            <input
              id="plant-name"
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Enter a unique plant name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            className={`btn mt-4 ${canCreate ? 'btn-primary' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!canCreate || isCreating}
            onClick={async () => {
              console.log('🌱 Plant creation button clicked')
              console.log('canCreate:', canCreate)
              console.log('isCreating:', isCreating)
              console.log('plantName:', plantName.trim())
              console.log('ownedCount:', ownedCount)
              console.log('required:', NFT_TYPES.length)
              
              if (canCreate) {
                try {
                  console.log('🚀 Calling onCreate...')
                  await onCreate(plantName.trim())
                  console.log('✅ onCreate completed successfully')
                } catch (error) {
                  console.error('❌ onCreate failed:', error)
                }
              } else {
                console.warn('⚠️ Cannot create plant - requirements not met')
              }
            }}
          >
            {isCreating ? 'Creating...' : 'Create Plant Token'}
          </button>
          {!canCreate && (
            <div className="text-xs text-gray-500 mt-2">Requires all 15 quest NFTs and a name</div>
          )}
        </div>

        {/* Will be created */}
        <div className="card p-5">
          <h3 className="text-lg font-semibold mb-3">Will be created</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/metadata/images/plant.png`}
                alt="Plant Token"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
              <div className="hidden absolute inset-0 flex items-center justify-center text-3xl">🌱</div>
            </div>
            <div>
              <div className="text-base font-semibold text-gray-900">{plantName || 'New Plant Token'}</div>
              <div className="text-sm text-gray-600">ERC1155 • Initial capacity preset</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


