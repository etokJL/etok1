import { useState, useEffect, useCallback } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseAbi, formatUnits, parseUnits } from 'viem'
import contracts from '@/contracts.json'

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

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Read shop prices
  const { data: pricesData } = useReadContract({
    address: contracts.NFTShop.address as `0x${string}`,
    abi: shopAbi,
    functionName: 'getPrices',
  })

  // Read user USDT balance
  const { data: usdtBalance, refetch: refetchBalance } = useReadContract({
    address: contracts.MockUSDT.address as `0x${string}`,
    abi: usdtAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Read USDT allowance for shop
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: contracts.MockUSDT.address as `0x${string}`,
    abi: usdtAbi,
    functionName: 'allowance',
    args: address ? [address, contracts.NFTShop.address] : undefined,
  })

  // Read shop stats
  const { data: shopStatsData } = useReadContract({
    address: contracts.NFTShop.address as `0x${string}`,
    abi: shopAbi,
    functionName: 'getShopStats',
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
    
    try {
      setError(null)
      setIsProcessing(true)
      
      await writeContract({
        address: contracts.MockUSDT.address as `0x${string}`,
        abi: usdtAbi,
        functionName: 'approve',
        args: [contracts.NFTShop.address, amount],
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
      
      await writeContract({
        address: contracts.MockUSDT.address as `0x${string}`,
        abi: usdtAbi,
        functionName: 'faucet',
      })
    } catch (err) {
      console.error('USDT faucet failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to get USDT from faucet')
      throw err
    } finally {
      setIsProcessing(false)
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
      
      await writeContract({
        address: contracts.NFTShop.address as `0x${string}`,
        abi: shopAbi,
        functionName: 'purchaseQuestNFTPackage',
      })
    } catch (err) {
      console.error('Quest NFT package purchase failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to purchase Quest NFT package')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [address, prices, allowance, approveUSDT, refetchAllowance, writeContract])

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
      
      await writeContract({
        address: contracts.NFTShop.address as `0x${string}`,
        abi: shopAbi,
        functionName: 'purchaseSingleQuestNFT',
        args: [BigInt(nftType)],
      })
    } catch (err) {
      console.error('Single Quest NFT purchase failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to purchase Quest NFT')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [address, prices, allowance, approveUSDT, refetchAllowance, writeContract])

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
      
      await writeContract({
        address: contracts.NFTShop.address as `0x${string}`,
        abi: shopAbi,
        functionName: 'purchasePlantToken',
        args: [plantName],
      })
    } catch (err) {
      console.error('Plant Token purchase failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to purchase Plant Token')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [address, prices, allowance, approveUSDT, refetchAllowance, writeContract])

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
    isProcessing: isProcessing || isPending || isConfirming,
    error,
    
    // Actions
    purchaseQuestNFTPackage,
    purchaseSingleQuestNFT,
    purchasePlantToken,
    getUSDTFromFaucet,
    approveUSDT,
    
    // Utilities
    formatUSDT,
    canAfford,
    
    // Refresh functions
    refetchBalance,
    refetchAllowance,
  }
}

