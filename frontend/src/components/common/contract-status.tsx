'use client'

import { useDynamicContracts } from '@/hooks/useDynamicContracts'
import { useState } from 'react'

export function ContractStatus() {
  const { 
    contracts, 
    isLoading, 
    error, 
    deployed, 
    lastUpdated, 
    reloadContracts,
    checkDeployment 
  } = useDynamicContracts()
  
  const [isReloading, setIsReloading] = useState(false)

  const handleReload = async () => {
    setIsReloading(true)
    try {
      await reloadContracts()
    } finally {
      setIsReloading(false)
    }
  }

  const handleCheck = async () => {
    await checkDeployment()
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border-2 p-4 min-w-[300px] ${
        deployed ? 'border-green-500' : error ? 'border-red-500' : 'border-yellow-500'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm">Contract Status</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleCheck}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Check deployment"
            >
              Check
            </button>
            <button
              onClick={handleReload}
              disabled={isReloading}
              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              title="Reload contracts"
            >
              {isReloading ? 'Reloading...' : 'Reload'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              title="Force page reload"
            >
              🔄
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Loading contracts...</span>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 mb-2">
            <strong>Error:</strong> {error}
          </div>
        )}

        {deployed && contracts && (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700 font-medium">Deployed</span>
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              <div>QuestNFT: {contracts.QuestNFT.address.slice(0, 8)}...</div>
              <div>MockUSDT: {contracts.MockUSDT.address.slice(0, 8)}...</div>
              <div>NFTShop: {contracts.NFTShop.address.slice(0, 8)}...</div>
              <div>PlantToken: {contracts.PlantToken.address.slice(0, 8)}...</div>
            </div>

            {lastUpdated && (
              <div className="text-xs text-gray-500 mt-2">
                Updated: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {!deployed && !isLoading && !error && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-yellow-700">Not deployed</span>
          </div>
        )}
      </div>
    </div>
  )
}
