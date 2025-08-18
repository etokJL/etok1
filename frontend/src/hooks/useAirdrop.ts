import { useCallback, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useDynamicContracts } from './useDynamicContracts'

export interface AirdropData {
  id: number
  title: string
  nft_types: number[]
  package_id: string
  status: 'pending' | 'executing' | 'completed' | 'failed'
  total_recipients: number
  completed_recipients: number
}

export function useAirdrop() {
  const { address, isConnected } = useAccount()
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  const { contracts: dynamicContracts } = useDynamicContracts()

  const executeAirdropForUser = useCallback(async (airdrop: AirdropData) => {
    if (!isConnected || !address) {
      setError('Wallet not connected')
      return false
    }

    setIsExecuting(true)
    setError(null)

    try {
      console.log('🎁 Executing airdrop via MetaMask...')
      console.log('Airdrop:', airdrop)

      if (!dynamicContracts?.QuestNFT?.address) {
        throw new Error('QuestNFT contract not loaded yet')
      }

      // Create a weekly package first
      console.log('📦 Creating weekly package...')
      await writeContract({
        address: dynamicContracts.QuestNFT.address as `0x${string}`,
        abi: dynamicContracts.QuestNFT.abi,
        functionName: 'createWeeklyPackage',
      })

      // Wait for package creation
      if (hash) {
        console.log('⏳ Waiting for package creation...')
        // After package is created, we would need to get the package ID
        // and then purchase it for the user
        
        // For now, let's try to purchase the most recent package
        console.log('🛒 Purchasing package...')
        
        // Get current package ID and purchase the latest one
        await writeContract({
          address: dynamicContracts.QuestNFT.address as `0x${string}`,
          abi: dynamicContracts.QuestNFT.abi,
          functionName: 'purchasePackage',
          args: [0], // This should be the actual package ID
        })
      }

      console.log('✅ Airdrop executed successfully!')
      return true

    } catch (err) {
      console.error('❌ Airdrop execution failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to execute airdrop')
      return false
    } finally {
      setIsExecuting(false)
    }
  }, [isConnected, address, writeContract, hash, dynamicContracts])

  const createPackageForSelf = useCallback(async () => {
    if (!isConnected || !address) {
      setError('Wallet not connected')
      return false
    }

    if (!dynamicContracts?.QuestNFT?.address) {
      setError('QuestNFT contract not loaded yet')
      return false
    }

    try {
      console.log('📦 Creating package for self via MetaMask...')
      
      await writeContract({
        address: dynamicContracts.QuestNFT.address as `0x${string}`,
        abi: dynamicContracts.QuestNFT.abi,
        functionName: 'createWeeklyPackage',
      })

      return true
    } catch (err) {
      console.error('❌ Package creation failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to create package')
      return false
    }
  }, [isConnected, address, writeContract, dynamicContracts])

  const purchasePackage = useCallback(async (packageId: number) => {
    if (!isConnected || !address) {
      setError('Wallet not connected')
      return false
    }

    if (!dynamicContracts?.QuestNFT?.address) {
      setError('QuestNFT contract not loaded yet')
      return false
    }

    try {
      console.log(`🛒 Purchasing package ${packageId} via MetaMask...`)
      
      await writeContract({
        address: dynamicContracts.QuestNFT.address as `0x${string}`,
        abi: dynamicContracts.QuestNFT.abi,
        functionName: 'purchasePackage',
        args: [packageId],
      })

      return true
    } catch (err) {
      console.error('❌ Package purchase failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to purchase package')
      return false
    }
  }, [isConnected, address, writeContract, dynamicContracts])

  return {
    executeAirdropForUser,
    createPackageForSelf,
    purchasePackage,
    isExecuting: isExecuting || isPending || isConfirming,
    isSuccess,
    error: error || (writeError?.message),
    transactionHash: hash,
  }
}
