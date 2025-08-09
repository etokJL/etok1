import { type Address } from 'viem'

// Backend Token from Laravel API
export interface BackendToken {
  id: number
  contract_address: string
  token_type: string
  token_id: string
  owner_address: string
  name: string
  sub_units?: number
  qr_code?: string
  transaction_hash?: string
  metadata?: any
  created_at: string
  updated_at: string
}

// Base NFT Type
export interface NFTType {
  id: number
  name: string
  image: string
  displayName: string
}

// User's NFT with metadata
export interface UserNFT {
  tokenId: bigint
  typeId: number
  owner: Address
  imageUrl: string
  metadata: NFTMetadata
}

// NFT Metadata structure
export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
}

// NFT Attributes
export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: string
}

// User's collection status
export interface CollectionStatus {
  totalCards: number
  uniqueTypes: number
  completedSets: number
  missingTypes: number[]
  duplicates: { [typeId: number]: number }
  canCreatePlant: boolean
}

// Plant Token
export interface PlantToken {
  tokenId: bigint
  name: string
  owner: Address
  createdAt: Date
  energy: bigint
}

// Trading related types
export interface TradeOffer {
  id: string
  from: Address
  to?: Address
  offeredTokens: bigint[]
  requestedTypes: number[]
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: Date
  expiresAt: Date
}

// Wallet connection types
export interface WalletConnection {
  address: Address
  chainId: number
  isConnected: boolean
  isConnecting: boolean
  isReconnecting: boolean
}

// User profile
export interface UserProfile {
  address: Address
  ensName?: string
  ensAvatar?: string
  joinedAt: Date
  totalCards: number
  plantsCreated: number
  tradesCompleted: number
}

// Chat message
export interface ChatMessage {
  id: string
  userId: Address
  username: string
  message: string
  timestamp: Date
  type: 'message' | 'trade' | 'system'
}

// Application state
export interface AppState {
  isLoading: boolean
  error: string | null
  user: UserProfile | null
  collection: UserNFT[]
  collectionStatus: CollectionStatus | null
  plants: PlantToken[]
  trades: TradeOffer[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pack opening result
export interface PackOpenResult {
  packId: string
  cards: UserNFT[]
  isNew: boolean[]
  duplicates: boolean[]
}

// Transaction status
export interface TransactionStatus {
  hash: string
  status: 'pending' | 'success' | 'failed'
  confirmations: number
  error?: string
}

// Card rarity (for future expansion)
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

// View modes for collection display
export type CollectionView = 'grid' | 'list' | 'masonry'

// Sort options for collection
export type SortOption = 'id' | 'name' | 'rarity' | 'acquired' | 'quantity'

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Animation variants for Framer Motion
export interface AnimationVariants {
  initial: any
  animate: any
  exit?: any
  transition?: any
}

// Component props that include common properties
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Modal props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
}

// Button variants
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive'
  
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

// Card component props
export interface CardProps extends BaseComponentProps {
  nft: UserNFT
  isSelected?: boolean
  onSelect?: (nft: UserNFT) => void
  showQuantity?: boolean
  animate?: boolean
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

// Form validation
export interface FormErrors {
  [key: string]: string | undefined
}

// Toast notification
export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Analytics event
export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  userId?: string
}

// Environment variables (for type safety)
export interface EnvVars {
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string
  NEXT_PUBLIC_API_URL: string
  NEXT_PUBLIC_INFURA_API_KEY: string
  NEXT_PUBLIC_ALCHEMY_API_KEY: string
}