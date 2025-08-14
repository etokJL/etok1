import { useAccount } from 'wagmi'
import { useCallback, useState } from 'react'
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions'

import { config } from '@/lib/wagmi'
import contracts from '@/contracts.json'
import { formatEther } from 'viem'

// Hook for QuestNFT contract interactions
export function useQuestNFT() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  const userNFTs = [BigInt(1), BigInt(2), BigInt(3), BigInt(4), BigInt(5)] // Mock token IDs
  const packagePrice = BigInt(10000000000000000) // Mock price in wei (0.01 ETH)

  // Purchase package function
  const handlePurchasePackage = useCallback(async () => {
    if (!address) {
      setError('Wallet not connected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Package purchased successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase package')
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // Get NFT details
  const getNFTDetails = useCallback(async (_tokenId: bigint) => {
    try {
      // This would be implemented with actual contract call
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get NFT details')
      return null
    }
  }, [])

  return {
    userNFTs,
    packagePrice: formatEther(packagePrice),
    isLoading,
    isPurchaseSuccess: false,
    error,
    purchasePackage: handlePurchasePackage,
    getNFTDetails,
    refetchUserNFTs: () => {},
  }
}

// Hook for PlantToken contract interactions
export function usePlantToken() {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  const userPlants = [BigInt(1), BigInt(2)] // Mock plant token IDs

  // Create plant function (by name on contract)
  const handleCreatePlant = useCallback(async (plantName: string) => {
    console.log('🔗 handleCreatePlant called with:', plantName)
    console.log('Address:', address)
    console.log('Contract address:', contracts.PlantToken.address)
    
    if (!address) {
      console.error('❌ Wallet not connected')
      setError('Wallet not connected')
      return
    }

    console.log('⏳ Starting plant creation...')
    setIsLoading(true)
    setError(null)

    try {
      console.log('📝 MINIMAL TEST APPROACH')
      console.log('========================')
      console.log('PlantToken address:', contracts.PlantToken.address)
      console.log('PlantName argument:', plantName)
      console.log('User address:', address)
      
      // Debug: Log ABI to see what we're working with
      console.log('Contract ABI type:', typeof contracts.PlantToken.abi)
      console.log('First ABI entry:', contracts.PlantToken.abi[0])
      
      // Find the createPlant function in ABI
      const createPlantABI = contracts.PlantToken.abi.find(
        (item: any) => item.type === 'function' && item.name === 'createPlant'
      )
      console.log('CreatePlant ABI:', createPlantABI)
      
      console.log('🚀 Attempting writeContract...')
      const hash = await writeContract(config, {
        address: contracts.PlantToken.address as `0x${string}`,
        abi: contracts.PlantToken.abi,
        functionName: 'createPlant',
        args: [plantName],
      })

      console.log('🔍 Transaction hash:', hash)
      console.log('⏳ Waiting for transaction receipt...')
      
      await waitForTransactionReceipt(config, { hash })
      console.log('✅ Plant created on-chain with name:', plantName)
    } catch (err) {
      console.error('❌ Contract call failed:', err)
      console.error('Error details:', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        cause: err instanceof Error ? err.cause : undefined,
        stack: err instanceof Error ? err.stack : undefined
      })
      
      const message = err instanceof Error
        ? (typeof (err as unknown as { shortMessage?: string }).shortMessage === 'string'
            ? (err as unknown as { shortMessage: string }).shortMessage
            : err.message)
        : 'Failed to create plant'
      setError(message)
      console.error('🚨 Setting error:', message)
    } finally {
      console.log('🏁 Plant creation finished, setting loading to false')
      setIsLoading(false)
    }
  }, [address])

  // Load sub-units function
  const handleLoadSubUnits = useCallback(async (_tokenId: bigint, _amount: bigint) => {
    if (!address) {
      setError('Wallet not connected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Sub-units loaded successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sub-units')
    } finally {
      setIsLoading(false)
    }
  }, [address])

  // Unload sub-units function
  const handleUnloadSubUnits = useCallback(async (_tokenId: bigint, _amount: bigint) => {
    if (!address) {
      setError('Wallet not connected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Sub-units unloaded successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unload sub-units')
    } finally {
      setIsLoading(false)
    }
  }, [address])

  return {
    userPlants,
    isLoading,
    isCreatePlantSuccess: false,
    isLoadSubUnitsSuccess: false,
    isUnloadSubUnitsSuccess: false,
    error,
    createPlant: handleCreatePlant,
    loadSubUnits: handleLoadSubUnits,
    unloadSubUnits: handleUnloadSubUnits,
    refetchUserPlants: () => {},
  }
}

// Combined hook for all contract interactions
export function useContracts() {
  const questNFT = useQuestNFT()
  const plantToken = usePlantToken()

  return {
    questNFT,
    plantToken,
    isLoading: questNFT.isLoading || plantToken.isLoading,
    error: questNFT.error || plantToken.error,
  }
}
