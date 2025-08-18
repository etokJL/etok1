import { useEffect, useState, useCallback } from 'react'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { config } from '@/lib/wagmi'
import { useDynamicContracts } from './useDynamicContracts'

export interface OnChainNFT {
  tokenId: string
  nftType: number
  name: string
  owner: string
}

export interface OnChainPlantToken {
  tokenId: string
  name: string
  subUnits: number
  qrCode: string
  createdAt: number
  owner: string
}

export function useBlockchainNFTData() {
  const { address, isConnected } = useAccount()
  const [nfts, setNfts] = useState<OnChainNFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { contracts: dynamicContracts } = useDynamicContracts()

  // Note: totalBalance removed as it's not needed for ERC-1155 multi-type queries

  // Get total NFT balance (ERC-721A) - using dynamic contracts
  const { data: totalBalance } = useReadContract({
    address: dynamicContracts?.QuestNFT?.address as `0x${string}`,
    abi: dynamicContracts?.QuestNFT?.abi,
    functionName: 'balanceOf',
    args: [address], // ERC-721A balanceOf(address)
    query: {
      enabled: isConnected && !!address && !!dynamicContracts?.QuestNFT?.address,
    },
  })

  const fetchNFTDetails = useCallback(async () => {
    if (!isConnected || !address || !totalBalance || !dynamicContracts?.QuestNFT?.address) return

    setLoading(true)
    setError(null)

    try {
      const detailedNFTs: OnChainNFT[] = []
      const balance = Number(totalBalance)
      
      if (balance > 0) {
        // For ERC-721A, we have tokens 1-5 corresponding to NFT types 1-5
        const nftNames = [
          'Solar Panel', 'Home Battery', 'Smart Home System', 'E-Car', 'Smart Meter',
          'Heat Pump', 'E-Bike', 'Smartphone', 'Power Bank', 'Charging Station',
          'E-Scooter', 'E-Roller', 'Electric Boiler', 'Charge Controller', 'Solar Inverter'
        ]
        
        // Get actual NFT types from on-chain data using Transfer events
        // This approach is more reliable than hardcoded mappings
        
        try {
          // Get actual NFT types from contract using getUserNFTCounts
          const nftCounts = await readContract(config, {
            address: dynamicContracts.QuestNFT.address as `0x${string}`,
            abi: dynamicContracts.QuestNFT.abi,
            functionName: 'getUserNFTCounts',
            args: [address],
          }) as bigint[]
          
          console.log('🔍 On-chain NFT counts per type:', nftCounts.map(c => Number(c)))
          
          // Create individual NFT entries for ALL tokens (not just unique types)
          let tokenCounter = 1
          for (let nftType = 1; nftType <= 15; nftType++) {
            const count = Number(nftCounts[nftType - 1] || 0)
            
            // Create individual entries for each NFT of this type
            for (let i = 0; i < count; i++) {
              detailedNFTs.push({
                tokenId: `token_${tokenCounter}_type_${nftType}`,
                nftType: nftType,
                name: nftNames[nftType - 1] || `NFT Type ${nftType}`,
                owner: address,
              })
              tokenCounter++
            }
          }
          
          console.log('✅ Frontend NFT mapping complete (ALL individual NFTs):', {
            totalBalance: balance,
            totalNFTsCreated: detailedNFTs.length,
            nftsByType: nftCounts.map((count, index) => `Type ${index + 1}: ${Number(count)}`).filter(s => !s.includes(': 0'))
          })
          
        } catch (error) {
          console.error('❌ Error getting NFT counts from contract:', error)
          setError(`Failed to fetch NFT data from blockchain: ${error instanceof Error ? error.message : 'Unknown error'}`)
          return // No fallback - if blockchain fails, show empty
        }
      }

      setNfts(detailedNFTs)
    } catch (err) {
      console.error('Error fetching NFT details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch NFT details')
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, totalBalance, dynamicContracts])

  useEffect(() => {
    fetchNFTDetails()
  }, [fetchNFTDetails])

  const totalNFTs = nfts.length
  const uniqueTypes = new Set(nfts.map(nft => nft.nftType)).size

  return {
    nfts,
    totalNFTs,
    uniqueTypes,
    loading,
    error,
    refresh: fetchNFTDetails,
  }
}

export function useBlockchainPlantData() {
  const { address, isConnected } = useAccount()
  const [plants, setPlants] = useState<OnChainPlantToken[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { contracts: dynamicContracts } = useDynamicContracts()

  // Get user's plant tokens - using dynamic contracts
  const { data: userTokens } = useReadContract({
    address: dynamicContracts?.PlantToken?.address as `0x${string}`,
    abi: dynamicContracts?.PlantToken?.abi,
    functionName: 'getOwnerTokens',
    args: [address],
    query: {
      enabled: isConnected && !!address && !!dynamicContracts?.PlantToken?.address,
    }
  })

  const fetchPlantDetails = useCallback(async () => {
    if (!isConnected || !address || !userTokens || !dynamicContracts?.PlantToken?.address) return

    setLoading(true)
    setError(null)

    try {
      const detailedPlants: OnChainPlantToken[] = []
      const tokenIds = userTokens as bigint[]

      // Fetch details for each plant token
      for (const tokenId of tokenIds) {
        try {
          // This would need to be implemented properly with multicall
          // For now, we'll create a simple representation
          detailedPlants.push({
            tokenId: tokenId.toString(),
            name: `Plant Token #${tokenId}`,
            subUnits: 1000, // Default value
            qrCode: `plant_${tokenId}`,
            createdAt: Date.now(),
            owner: address,
          })
        } catch (err) {
          console.warn(`Failed to fetch details for token ${tokenId}:`, err)
        }
      }

      setPlants(detailedPlants)
    } catch (err) {
      console.error('Error fetching plant details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch plant details')
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, userTokens, dynamicContracts])

  useEffect(() => {
    fetchPlantDetails()
  }, [fetchPlantDetails])

  return {
    plants,
    plantsCreated: plants.length,
    loading,
    error,
    refresh: fetchPlantDetails,
  }
}

// Helper function to get NFT type names
function getNFTTypeName(nftType: number): string {
  const nftNames: { [key: number]: string } = {
    1: 'Solar Panel',
    2: 'Home Battery', 
    3: 'Smart Home System',
    4: 'E-Car',
    5: 'Smart Meter',
    6: 'Heat Pump',
    7: 'E-Bike',
    8: 'Smartphone',
    9: 'Power Bank',
    10: 'Charging Station',
    11: 'E-Scooter',
    12: 'E-Roller',
    13: 'Electric Boiler',
    14: 'Charge Controller',
    15: 'Solar Inverter',
  }
  
  return nftNames[nftType] || `NFT Type ${nftType}`
}

// Check if user can create plant (has all 15 NFT types)
export function useCanCreatePlant() {
  const { address, isConnected } = useAccount()
  const { contracts: dynamicContracts } = useDynamicContracts()
  
  const { data: canCreate } = useReadContract({
    address: dynamicContracts?.QuestNFT?.address as `0x${string}`,
    abi: dynamicContracts?.QuestNFT?.abi,
    functionName: 'canCreatePlant',
    args: [address],
    query: {
      enabled: isConnected && !!address && !!dynamicContracts?.QuestNFT?.address,
    }
  })

  return {
    canCreate: canCreate as boolean ?? false,
    isLoading: !canCreate && isConnected && !!address,
  }
}
