export interface NFTType {
  id: number
  name: string
  image: string
  description?: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
  energyType: 'Solar' | 'Wind' | 'Hydro' | 'Storage' | 'Smart' | 'Transport'
}

export interface UserNFT {
  tokenId: bigint
  nftType: NFTType
  quantity: number
  isSelected?: boolean
  lastUpdated: Date
  originalTokenId?: string // For mapping back to backend tokens
  uniqueId?: string // Unique ID for React keys
}

export interface PlantNFT {
  tokenId: bigint
  name: string
  createdAt: Date
  usedNFTs: NFTType[]
  energyOutput: number
  level: number
}

export interface NFTCardProps {
  nft: UserNFT
  onSelect?: (nft: UserNFT) => void
  isSelected?: boolean
  showQuantity?: boolean
  animate?: boolean
}

export interface CollectionStats {
  totalNFTs: number
  uniqueTypes: number
  plantsCreated: number
  totalEnergyGenerated: number
}

export interface TradingOffer {
  id: string
  seller: string
  nftType: NFTType
  quantity: number
  priceETH: number
  priceUSD: number
  expiresAt: Date
  isActive: boolean
}

export interface PlantCreationProgress {
  selectedNFTs: UserNFT[]
  requiredTypes: number
  isComplete: boolean
  canCreate: boolean
}

export type ViewMode = 'grid' | 'list' | 'compact'
export type SortOption = 'name' | 'rarity' | 'quantity' | 'recent'
export type FilterOption = 'all' | 'solar' | 'wind' | 'hydro' | 'storage' | 'smart' | 'transport'