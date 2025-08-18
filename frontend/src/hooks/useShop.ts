import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseAbi, formatUnits, parseUnits } from 'viem'
import { useDynamicContracts } from './useDynamicContracts'

// Contract ABIs
const shopAbi = parseAbi([
  'function purchaseQuestNFTPackage() external',
  'function purchaseSingleQuestNFT(uint256 nftType) external',
  'function purchasePlantToken(string memory plantName) external',
  'function getPrices() external view returns (uint256, uint256, uint256)',
  'function canAfford(address user, uint256 itemType) external view returns (bool)',
  'function getShopStats() external view returns (uint256, uint256, uint256, uint256)',
  'event QuestNFTPackagePurchased(address indexed buyer, uint256 packageId, uint256 price)',
  'event SingleQuestNFTPurchased(address indexed buyer, uint256 nftType, uint256 price)',
  'event PlantTokenPurchased(address indexed buyer, string plantName, uint256 tokenId, uint256 price)'
])

const usdtAbi = parseAbi([
  'function balanceOf(address account) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function faucet() external',
  'function balanceOfFormatted(address account) external view returns (string)'
])

interface ShopPrices {
  questNFTPackagePrice: bigint
  singleQuestNFTPrice: bigint
  plantTokenPrice: bigint
}

interface ShopStats {
  totalSales: bigint
  totalQuestNFTsSold: bigint
  totalPlantTokensSold: bigint
  currentUSDTBalance: bigint
}

export function useShop() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })
  const { contracts: dynamicContracts, isLoading: contractsLoading, error: contractsError, deployed } = useDynamicContracts()

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastPurchase, setLastPurchase] = useState<{
    type: 'package' | 'single' | 'plant'
    items?: {
      nftType?: number
      nftTypes?: number[]
      plantName?: string
    }
  } | null>(null)
  
  // Watch for transaction success to show modal
  useEffect(() => {
    if (isSuccess && lastPurchase && !showSuccessModal) {
      console.log('✅ Transaction confirmed! Showing success modal')
      setShowSuccessModal(true)
      setIsProcessing(false) // Reset processing state
    }
  }, [isSuccess, lastPurchase, showSuccessModal])
  
  // Reset processing state and modal when transaction finishes
  useEffect(() => {
    if (!isConfirming && !isPending) {
      setIsProcessing(false)
    }
  }, [isConfirming, isPending])
  
  // Reset modal state when starting new transaction
  useEffect(() => {
    if (isPending && showSuccessModal) {
      console.log('🔄 New transaction started, closing previous modal')
      setShowSuccessModal(false)
      setLastPurchase(null)
    }
  }, [isPending, showSuccessModal])

  // Read shop prices
  const { data: pricesData } = useReadContract({
    address: dynamicContracts?.NFTShop?.address as `0x${string}`,
    abi: shopAbi,
    functionName: 'getPrices',
    query: {
      enabled: !!dynamicContracts?.NFTShop?.address
    }
  })

  // Read user USDT balance
  const { data: usdtBalance, refetch: refetchBalance } = useReadContract({
    address: dynamicContracts?.MockUSDT?.address as `0x${string}`,
    abi: usdtAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!dynamicContracts?.MockUSDT?.address && !!address
    }
  })

  // Read USDT allowance for shop
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: dynamicContracts?.MockUSDT?.address as `0x${string}`,
    abi: usdtAbi,
    functionName: 'allowance',
    args: address && dynamicContracts?.NFTShop?.address ? [address, dynamicContracts.NFTShop.address] : undefined,
    query: {
      enabled: !!dynamicContracts?.MockUSDT?.address && !!dynamicContracts?.NFTShop?.address && !!address
    }
  })

  // Read shop stats
  const { data: shopStatsData } = useReadContract({
    address: dynamicContracts?.NFTShop?.address as `0x${string}`,
    abi: shopAbi,
    functionName: 'getShopStats',
    query: {
      enabled: !!dynamicContracts?.NFTShop?.address
    }
  })

  const prices: ShopPrices | null = pricesData ? {
    questNFTPackagePrice: pricesData[0],
    singleQuestNFTPrice: pricesData[1],
    plantTokenPrice: pricesData[2]
  } : null

  const shopStats: ShopStats | null = shopStatsData ? {
    totalSales: shopStatsData[0],
    totalQuestNFTsSold: shopStatsData[1],
    totalPlantTokensSold: shopStatsData[2],
    currentUSDTBalance: shopStatsData[3]
  } : null

  // Format USDT amounts for display
  const formatUSDT = useCallback((amount: bigint) => {
    return formatUnits(amount, 6) // USDT has 6 decimals
  }, [])

  // Check if user can afford an item
  const canAfford = useCallback((itemType: 0 | 1 | 2) => {
    if (!address || !usdtBalance || !prices) return false
    
    let requiredAmount: bigint
    switch (itemType) {
      case 0: requiredAmount = prices.questNFTPackagePrice; break
      case 1: requiredAmount = prices.singleQuestNFTPrice; break
      case 2: requiredAmount = prices.plantTokenPrice; break
      default: return false
    }
    
    return usdtBalance >= requiredAmount
  }, [address, usdtBalance, prices])

  // Approve USDT spending
  const approveUSDT = useCallback(async (amount: bigint) => {
    if (!address) throw new Error('Wallet not connected')

    // More robust contract loading check
    if (!dynamicContracts?.MockUSDT?.address || !dynamicContracts?.NFTShop?.address || 
        !dynamicContracts?.MockUSDT?.abi || !dynamicContracts?.NFTShop?.abi) {
      console.log('⏳ Contracts not fully loaded yet. Missing:', {
        mockUSDTAddress: !!dynamicContracts?.MockUSDT?.address,
        nftShopAddress: !!dynamicContracts?.NFTShop?.address,
        mockUSDTAbi: !!dynamicContracts?.MockUSDT?.abi,
        nftShopAbi: !!dynamicContracts?.NFTShop?.abi
      })
      
      // Wait a bit and try to reload contracts
      const errorMsg = 'Contracts are still loading. Please wait a moment and try again.'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
    
    try {
      setError(null)
      setIsProcessing(true)

      await writeContract({
        address: dynamicContracts.MockUSDT.address as `0x${string}`,
        abi: usdtAbi,
        functionName: 'approve',
        args: [dynamicContracts.NFTShop.address, amount],
      })
    } catch (err) {
      console.error('USDT approval failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to approve USDT')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [address, writeContract])

  // Get USDT from faucet
  const getUSDTFromFaucet = useCallback(async () => {
    if (!address) throw new Error('Wallet not connected')
    
    try {
      setError(null)
      setIsProcessing(true)
      
      if (!dynamicContracts?.MockUSDT?.address) {
        throw new Error('USDT contract not loaded yet')
      }

      console.log('🚰 Getting USDT from faucet...')
      const result = await writeContract({
        address: dynamicContracts.MockUSDT.address as `0x${string}`,
        abi: usdtAbi,
        functionName: 'faucet',
      })
      
      console.log('✅ USDT faucet transaction submitted:', result)
    } catch (err) {
      console.error('❌ USDT faucet failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to get USDT from faucet')
      throw err
    }
  }, [address, writeContract])

  // Purchase Quest NFT package
  const purchaseQuestNFTPackage = useCallback(async () => {
    if (!address || !prices) throw new Error('Wallet not connected or prices not loaded')
    
    try {
      setError(null)
      setIsProcessing(true)
      
      // Check allowance
      if (!allowance || allowance < prices.questNFTPackagePrice) {
        await approveUSDT(prices.questNFTPackagePrice * 2n) // Approve double for future transactions
        await refetchAllowance()
      }
      
      if (!dynamicContracts?.NFTShop?.address) {
        throw new Error('Shop contract not loaded yet')
      }

      const result = await writeContract({
        address: dynamicContracts.NFTShop.address as `0x${string}`,
        abi: shopAbi,
        functionName: 'purchaseQuestNFTPackage',
      })
      
      console.log('✅ NFT Package Purchase submitted:', result)
      
      // Set purchase info for success modal (will show when transaction confirms)
      setLastPurchase({
        type: 'package',
        items: {
          nftTypes: [1, 2, 3, 4, 5] // Default package contents
        }
      })
    } catch (err) {
      console.error('Quest NFT package purchase failed:', err)
      
      // Check if this is just a MetaMask SDK connection error but transaction went through
      const errorMsg = err instanceof Error ? err.message : String(err)
      if (errorMsg.includes('metamask-sdk.api.cx.metamask.io') || 
          errorMsg.includes('ERR_CONNECTION_RESET') ||
          errorMsg.includes('ERR_CONNECTION_CLOSED')) {
        console.log('⚠️ MetaMask SDK connection error, but transaction may have succeeded')
        console.log('Check your wallet and refresh the page to see if NFTs arrived')
        setError('Network connection issue with MetaMask, but purchase may have succeeded. Please check your wallet.')
        
        // Set purchase info for SDK errors since transaction likely succeeded  
        setLastPurchase({
          type: 'package',
          items: {
            nftTypes: [1, 2, 3, 4, 5] // Default package contents
          }
        })
        return // Don't throw error for SDK connection issues
      }
      
      setError(errorMsg)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [address, prices, allowance, approveUSDT, refetchAllowance, writeContract, dynamicContracts])

  // Purchase single Quest NFT
  const purchaseSingleQuestNFT = useCallback(async (nftType: number) => {
    if (!address || !prices) throw new Error('Wallet not connected or prices not loaded')
    
    try {
      setError(null)
      setIsProcessing(true)
      
      // Check allowance
      if (!allowance || allowance < prices.singleQuestNFTPrice) {
        await approveUSDT(prices.singleQuestNFTPrice * 10n) // Approve for multiple purchases
        await refetchAllowance()
      }
      
      if (!dynamicContracts?.NFTShop?.address) {
        throw new Error('Shop contract not loaded yet')
      }

      const result = await writeContract({
        address: dynamicContracts.NFTShop.address as `0x${string}`,
        abi: shopAbi,
        functionName: 'purchaseSingleQuestNFT',
        args: [BigInt(nftType)],
      })
      
      console.log('✅ Single NFT Purchase submitted:', result)
      
      // Set purchase info for success modal (will show when transaction confirms)
      setLastPurchase({
        type: 'single',
        items: {
          nftType: nftType
        }
      })
    } catch (err) {
      console.error('Single Quest NFT purchase failed:', err)
      
      // Check if this is just a MetaMask SDK connection error but transaction went through
      const errorMsg = err instanceof Error ? err.message : String(err)
      if (errorMsg.includes('metamask-sdk.api.cx.metamask.io') || 
          errorMsg.includes('ERR_CONNECTION_RESET') ||
          errorMsg.includes('ERR_CONNECTION_CLOSED')) {
        console.log('⚠️ MetaMask SDK connection error, but transaction may have succeeded')
        console.log('Check your wallet and refresh the page to see if NFTs arrived')
        setError('Network connection issue with MetaMask, but purchase may have succeeded. Please check your wallet.')
        
        // Set purchase info for SDK errors since transaction likely succeeded
        setLastPurchase({
          type: 'single',
          items: {
            nftType: nftType
          }
        })
        return // Don't throw error for SDK connection issues
      }
      
      setError(errorMsg)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [address, prices, allowance, approveUSDT, refetchAllowance, writeContract, dynamicContracts])

  // Purchase Plant Token
  const purchasePlantToken = useCallback(async (plantName: string) => {
    if (!address || !prices) throw new Error('Wallet not connected or prices not loaded')
    
    try {
      setError(null)
      setIsProcessing(true)
      
      // Check allowance
      if (!allowance || allowance < prices.plantTokenPrice) {
        await approveUSDT(prices.plantTokenPrice)
        await refetchAllowance()
      }
      
      if (!dynamicContracts?.NFTShop?.address) {
        throw new Error('Shop contract not loaded yet')
      }

      const result = await writeContract({
        address: dynamicContracts.NFTShop.address as `0x${string}`,
        abi: shopAbi,
        functionName: 'purchasePlantToken',
        args: [plantName],
      })
      
      console.log('✅ Plant Token Purchase submitted:', result)
      
      // Set purchase info for success modal (will show when transaction confirms)
      setLastPurchase({
        type: 'plant',
        items: {
          plantName: plantName
        }
      })
    } catch (err) {
      console.error('Plant Token purchase failed:', err)
      
      // Check if this is just a MetaMask SDK connection error but transaction went through
      const errorMsg = err instanceof Error ? err.message : String(err)
      if (errorMsg.includes('metamask-sdk.api.cx.metamask.io') || 
          errorMsg.includes('ERR_CONNECTION_RESET') ||
          errorMsg.includes('ERR_CONNECTION_CLOSED')) {
        console.log('⚠️ MetaMask SDK connection error, but transaction may have succeeded')
        console.log('Check your wallet and refresh the page to see if Plant Tokens arrived')
        setError('Network connection issue with MetaMask, but purchase may have succeeded. Please check your wallet.')
        
        // Set purchase info for SDK errors since transaction likely succeeded
        setLastPurchase({
          type: 'plant',
          items: {
            plantName: plantName
          }
        })
        return // Don't throw error for SDK connection issues
      }
      
      setError(errorMsg)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [address, prices, allowance, approveUSDT, refetchAllowance, writeContract, dynamicContracts])

  // Refresh data after successful transaction
  useEffect(() => {
    if (isSuccess) {
      refetchBalance()
      refetchAllowance()
      setIsProcessing(false)
    }
  }, [isSuccess, refetchBalance, refetchAllowance])

  return {
    // Data
    prices,
    shopStats,
    usdtBalance: usdtBalance || 0n,
    allowance: allowance || 0n,
    
    // States
    isProcessing: isProcessing || isPending || isConfirming || contractsLoading,
    error: error || contractsError,
    showSuccessModal,
    lastPurchase,
    
    // Contract status - more thorough check
    contractsLoaded: !!dynamicContracts && 
                    !!dynamicContracts.NFTShop?.address && !!dynamicContracts.NFTShop?.abi &&
                    !!dynamicContracts.MockUSDT?.address && !!dynamicContracts.MockUSDT?.abi &&
                    !!dynamicContracts.QuestNFT?.address && !!dynamicContracts.QuestNFT?.abi &&
                    !contractsLoading,
    contractsError,
    
    // Actions (all enabled, but with proper contract loading checks)
    purchaseQuestNFTPackage,
    purchaseSingleQuestNFT,
    purchasePlantToken,
    getUSDTFromFaucet,
    approveUSDT,
    closeSuccessModal: () => setShowSuccessModal(false),
    
    // Utilities
    formatUSDT,
    canAfford,
    
    // Refresh functions
    refetchBalance,
    refetchAllowance,
    
    // Contract info
    contracts: dynamicContracts,
  }
}

