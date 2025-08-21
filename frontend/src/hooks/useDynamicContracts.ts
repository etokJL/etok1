import { useState, useEffect, useCallback } from 'react'

export interface ContractInfo {
  address: string
  abi: any[]
  deployedAt?: string
}

export interface DynamicContracts {
  QuestNFT: ContractInfo
  PlantToken: ContractInfo
  MockUSDT: ContractInfo
  NFTShop: ContractInfo
}

interface ContractResponse {
  success: boolean
  contracts: DynamicContracts | null
  network: string
  chainId: number
  timestamp: string
}

interface DeploymentCheck {
  success: boolean
  deployed: boolean
  message: string
  missing?: string[]
  contracts?: string[]
}

const CONTRACTS_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/contracts`
const CHECK_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/contracts/check`
const RELOAD_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/contracts/reload`

export function useDynamicContracts() {
  const [contracts, setContracts] = useState<DynamicContracts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [deployed, setDeployed] = useState(false)

  const loadContracts = useCallback(async (force = false) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔄 Loading dynamic contracts...')
      
      const response = await fetch(CONTRACTS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': force ? 'no-cache' : 'default'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to load contracts: ${response.status} ${response.statusText}`)
      }

      const data: ContractResponse = await response.json()

      if (!data.success || !data.contracts) {
        throw new Error(data.contracts ? 'Contracts not available' : 'Invalid response from server')
      }

      // Validate that all required contracts are present
      const requiredContracts = ['QuestNFT', 'PlantToken', 'MockUSDT', 'NFTShop']
      const missingContracts = requiredContracts.filter(name => !data.contracts![name as keyof DynamicContracts])

      if (missingContracts.length > 0) {
        throw new Error(`Missing contracts: ${missingContracts.join(', ')}`)
      }

      console.log('✅ Dynamic contracts loaded successfully:', {
        QuestNFT: data.contracts.QuestNFT.address,
        PlantToken: data.contracts.PlantToken.address,
        MockUSDT: data.contracts.MockUSDT.address,
        NFTShop: data.contracts.NFTShop.address,
      })

      setContracts(data.contracts)
      setLastUpdated(data.timestamp)
      setDeployed(true)
      setError(null)

      return data.contracts

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading contracts'
      console.error('❌ Failed to load dynamic contracts:', errorMessage)
      setError(errorMessage)
      setDeployed(false)
      return null

    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkDeployment = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(CHECK_ENDPOINT)
      if (!response.ok) return false

      const data: DeploymentCheck = await response.json()
      setDeployed(data.deployed)
      
      if (!data.deployed) {
        setError(data.message)
        console.warn('⚠️ Contracts not properly deployed:', data.message)
      }

      return data.deployed

    } catch (err) {
      console.error('❌ Failed to check deployment:', err)
      setDeployed(false)
      return false
    }
  }, [])

  const reloadContracts = useCallback(async () => {
    console.log('🔄 Force reloading contracts...')
    
    try {
      const response = await fetch(RELOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to reload contracts: ${response.status}`)
      }

      const data: ContractResponse = await response.json()
      
      if (data.success && data.contracts) {
        setContracts(data.contracts)
        setLastUpdated(data.timestamp)
        setDeployed(true)
        setError(null)
        console.log('✅ Contracts reloaded successfully')
        return data.contracts
      } else {
        throw new Error('Failed to reload contracts')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error reloading contracts'
      console.error('❌ Failed to reload contracts:', errorMessage)
      setError(errorMessage)
      return null
    }
  }, [])

  // Auto-load contracts on mount
  useEffect(() => {
    loadContracts()
  }, []) // Remove loadContracts dependency to prevent infinite loop

  // Auto-check deployment status periodically in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        checkDeployment()
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [checkDeployment])

  return {
    contracts,
    isLoading,
    error,
    deployed,
    lastUpdated,
    loadContracts,
    checkDeployment,
    reloadContracts,
    
    // Convenience getters
    questNFT: contracts?.QuestNFT || null,
    plantToken: contracts?.PlantToken || null,
    mockUSDT: contracts?.MockUSDT || null,
    nftShop: contracts?.NFTShop || null,
  }
}
