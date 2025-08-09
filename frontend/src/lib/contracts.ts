// Contract ABIs (simplified for now - would be generated from compiled contracts)
export const QUEST_NFT_ABI = [
  {
    "inputs": [],
    "name": "purchasePackage",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "getUserNFTs",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getNFTDetails",
    "outputs": [{"name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPackagePrice",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const PLANT_TOKEN_ABI = [
  {
    "inputs": [{"name": "nftTokenIds", "type": "uint256[]"}, {"name": "plantTypeId", "type": "uint256"}],
    "name": "createPlant",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}, {"name": "amount", "type": "uint256"}],
    "name": "loadSubUnitsManual",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}, {"name": "amount", "type": "uint256"}],
    "name": "unloadSubUnits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getPlantDetails",
    "outputs": [{"name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "getUserPlants",
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract addresses (these should be deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  QUEST_NFT: process.env.NEXT_PUBLIC_QUEST_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
  PLANT_TOKEN: process.env.NEXT_PUBLIC_PLANT_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const

// Contract configurations
export const CONTRACT_CONFIG = {
  QUEST_NFT: {
    address: CONTRACT_ADDRESSES.QUEST_NFT as `0x${string}`,
    abi: QUEST_NFT_ABI,
  },
  PLANT_TOKEN: {
    address: CONTRACT_ADDRESSES.PLANT_TOKEN as `0x${string}`,
    abi: PLANT_TOKEN_ABI,
  },
} as const

// Contract function names for easy reference
export const CONTRACT_FUNCTIONS = {
  QUEST_NFT: {
    PURCHASE_PACKAGE: 'purchasePackage',
    GET_USER_NFTS: 'getUserNFTs',
    GET_NFT_DETAILS: 'getNFTDetails',
    GET_PACKAGE_PRICE: 'getPackagePrice',
  },
  PLANT_TOKEN: {
    CREATE_PLANT: 'createPlant',
    LOAD_SUB_UNITS: 'loadSubUnitsManual',
    UNLOAD_SUB_UNITS: 'unloadSubUnits',
    GET_PLANT_DETAILS: 'getPlantDetails',
    GET_USER_PLANTS: 'getUserPlants',
  },
} as const

// Gas limits for different operations
export const GAS_LIMITS = {
  PURCHASE_PACKAGE: BigInt(300000),
  CREATE_PLANT: BigInt(200000),
  LOAD_SUB_UNITS: BigInt(100000),
  UNLOAD_SUB_UNITS: BigInt(100000),
} as const

// Error messages
export const CONTRACT_ERRORS = {
  INSUFFICIENT_FUNDS: 'Insufficient funds to purchase package',
  NOT_ENOUGH_NFTS: 'Not enough NFTs to create plant',
  ALREADY_OWNED: 'You already own this NFT',
  INVALID_TOKEN_ID: 'Invalid token ID',
  UNAUTHORIZED: 'Unauthorized operation',
} as const
