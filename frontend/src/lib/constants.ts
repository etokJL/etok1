// Application constants
export const APP_NAME = 'Booster Collection Cards'
export const APP_DESCRIPTION = 'Swiss-quality decentralized energy NFT collection platform'
export const APP_URL = 'https://booster-cards.swiss'

// Contract addresses (to be updated with actual deployed addresses)
export const CONTRACTS = {
  QUEST_NFT: '0x...',  // QuestNFT contract address
  PLANT_TOKEN: '0x...', // PlantToken contract address
} as const

// NFT Collection Configuration
export const NFT_COLLECTION = {
  TOTAL_TYPES: 15,
  CARDS_PER_PACK: 5,
  REQUIRED_FOR_PLANT: 15, // Need all 15 different types
} as const

// NFT Types from the configuration - SINGLE SOURCE OF TRUTH
export const NFT_TYPES = [
  { id: 1, name: 'e-car', image: 'e-car.png', displayName: 'Electric Car', rarity: 'common' as const },
  { id: 2, name: 'e-bike', image: 'e-bike.png', displayName: 'Electric Bike', rarity: 'common' as const },
  { id: 3, name: 'e-roller', image: 'e-roller.png', displayName: 'Electric Scooter', rarity: 'common' as const },
  { id: 4, name: 'e-scooter', image: 'e-scooter.png', displayName: 'E-Scooter', rarity: 'common' as const },
  { id: 5, name: 'smart-home', image: 'smart-home.png', displayName: 'Smart Home', rarity: 'common' as const },
  { id: 6, name: 'solar-inverter', image: 'solar-inverter.png', displayName: 'Solar Inverter', rarity: 'uncommon' as const },
  { id: 7, name: 'home-battery', image: 'home-battery.png', displayName: 'Home Battery', rarity: 'uncommon' as const },
  { id: 8, name: 'smart-meter', image: 'smart-meter.png', displayName: 'Smart Meter', rarity: 'uncommon' as const },
  { id: 9, name: 'charging-station', image: 'charging-station.png', displayName: 'Charging Station', rarity: 'uncommon' as const },
  { id: 10, name: 'heat-pump', image: 'heat-pump.png', displayName: 'Heat Pump', rarity: 'uncommon' as const },
  { id: 11, name: 'solar-panel', image: 'solar-panel.png', displayName: 'Solar Panel', rarity: 'rare' as const },
  { id: 12, name: 'electric-boiler', image: 'electric-boiler.png', displayName: 'Electric Boiler', rarity: 'rare' as const },
  { id: 13, name: 'power-bank', image: 'power-bank.png', displayName: 'Power Bank', rarity: 'rare' as const },
  { id: 14, name: 'charge-controller', image: 'charge-controller.png', displayName: 'Charge Controller', rarity: 'epic' as const },
  { id: 15, name: 'smartphone', image: 'smartphone.png', displayName: 'Smartphone', rarity: 'legendary' as const },
] as const

// NFT Rarity definitions
export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export const RARITY_COLORS: Record<NFTRarity, string> = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
}

export const RARITY_GLOW: Record<NFTRarity, string> = {
  common: 'shadow-lg',
  uncommon: 'shadow-green-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50'
}

// Animation durations
export const ANIMATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  CARD_HOVER: 0.2,
  PAGE_TRANSITION: 0.5,
} as const

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const

// Layout constants
export const LAYOUT = {
  HEADER_HEIGHT: 80,
  SIDEBAR_WIDTH: 280,
  CARD_ASPECT_RATIO: 3 / 4, // Portrait cards
  MAX_CONTENT_WIDTH: 1400,
} as const

// Swiss theme colors (matching our design system)
export const COLORS = {
  PRIMARY: '#0ea5e9',
  SECONDARY: '#64748b',
  ACCENT: '#eab308',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  SWISS_RED: '#FF0000',
  SWISS_WHITE: '#FFFFFF',
} as const

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'booster-theme',
  WALLET_PREFERENCE: 'booster-wallet',
  USER_SETTINGS: 'booster-settings',
  COLLECTION_VIEW: 'booster-collection-view',
} as const

// API endpoints (to be configured)
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  METADATA: '/metadata',
  CHAT: '/chat',
  ANALYTICS: '/analytics',
} as const

// Feature flags
export const FEATURES = {
  CHAT_ENABLED: true,
  TRADING_ENABLED: true,
  ANALYTICS_ENABLED: true,
  DARK_MODE_ENABLED: true,
  NOTIFICATIONS_ENABLED: true,
} as const

// Swiss quality standards
export const QUALITY_STANDARDS = {
  MAX_LOADING_TIME: 2000, // 2 seconds
  MIN_CONTRAST_RATIO: 4.5,
  ACCESSIBILITY_LEVEL: 'AA',
  UPTIME_TARGET: 99.9,
} as const