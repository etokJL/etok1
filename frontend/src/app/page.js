'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { ethers } from 'ethers'
import Image from 'next/image'
import contracts from '../contracts.json'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  // Fix hydration error by tracking client-side state
  const [mounted, setMounted] = useState(false)
  
  const [contracts, setContracts] = useState(null)
  const [questContract, setQuestContract] = useState(null)
  const [plantContract, setPlantContract] = useState(null)
  const [nftCounts, setNftCounts] = useState([])
  const [packages, setPackages] = useState([])
  const [plantTokens, setPlantTokens] = useState([])
  const [loading, setLoading] = useState(false)
  const [newPlantName, setNewPlantName] = useState('')
  const [loadAmount, setLoadAmount] = useState('')
  const [unloadAmount, setUnloadAmount] = useState('')
  const [selectedTokenId, setSelectedTokenId] = useState('')
  const [nftTypes, setNftTypes] = useState([])

  // NFT Types Configuration
  const nftTypesConfig = [
    { id: 1, name: "e-car", image: "e-car.png" },
    { id: 2, name: "e-bike", image: "e-bike.png" },
    { id: 3, name: "e-roller", image: "e-roller.png" },
    { id: 4, name: "e-scooter", image: "e-scooter.png" },
    { id: 5, name: "smart-home", image: "smart-home.png" },
    { id: 6, name: "solar-inverter", image: "solar-inverter.png" },
    { id: 7, name: "home-battery", image: "home-battery.png" },
    { id: 8, name: "smart-meter", image: "smart-meter.png" },
    { id: 9, name: "charging-station", image: "charging-station.png" },
    { id: 10, name: "heat-pump", image: "heat-pump.png" },
    { id: 11, name: "solar-panel", image: "solar-panel.png" },
    { id: 12, name: "electric-boiler", image: "electric-boiler.png" },
    { id: 13, name: "power-bank", image: "power-bank.png" },
    { id: 14, name: "charge-controller", image: "charge-controller.png" },
    { id: 15, name: "smartphone", image: "smartphone.png" }
  ]

  // Fix hydration issue - only render wallet-dependent content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load contracts first
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadContracts = async () => {
        try {
          console.log('📄 Loading contracts.json...')
          const response = await fetch('/contracts.json')
          const contractsData = await response.json()
          console.log('✅ Contracts loaded:', contractsData)
          setContracts(contractsData)
        } catch (error) {
          console.error('❌ Error loading contracts:', error)
        }
      }
      loadContracts()
    }
  }, [])

  // Initialize contracts when wallet is connected and contracts are loaded
  useEffect(() => {
    const initContracts = async () => {
      console.log('🔍 InitContracts called with:', {
        isConnected,
        address,
        hasEthereum: typeof window !== 'undefined' && !!window.ethereum,
        hasContracts: !!contracts
      })
      
      if (isConnected && address && window.ethereum && contracts) {
        try {
          console.log('✅ Initializing contracts...')
          console.log('📄 Contracts data:', contracts)
          
          if (!contracts.QuestNFT?.address || !contracts.PlantToken?.address) {
            console.error('❌ Contract addresses not found:', contracts)
            return
          }
          
          if (!contracts.QuestNFT?.abi || !contracts.PlantToken?.abi) {
            console.error('❌ Contract ABIs not found:', contracts)
            return
          }
          
          console.log('🌐 Creating provider and signer...')
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const signerAddress = await signer.getAddress()
          console.log('👤 Signer address:', signerAddress)
          
          console.log('📝 Creating contract instances...')
          const questNFT = new ethers.Contract(
            contracts.QuestNFT.address,
            contracts.QuestNFT.abi,
            signer
          )
          
          const plantToken = new ethers.Contract(
            contracts.PlantToken.address,
            contracts.PlantToken.abi,
            signer
          )
          
          setQuestContract(questNFT)
          setPlantContract(plantToken)
          console.log('🎮 QuestNFT initialized:', contracts.QuestNFT.address)
          console.log('🌱 PlantToken initialized:', contracts.PlantToken.address)
          console.log('✅ Contracts initialized successfully!')
        } catch (error) {
          console.error('❌ Error initializing contracts:', error)
        }
      } else {
        console.log('⏸️ Waiting for wallet connection and contracts...')
      }
    }

    if (typeof window !== 'undefined') {
      initContracts()
    }
  }, [isConnected, address, contracts])

  // Load data when contracts are ready
  useEffect(() => {
    const loadData = async () => {
      console.log('🔍 LoadData called with:', {
        questContract: !!questContract,
        plantContract: !!plantContract,
        address: address
      })
      
      if (!questContract || !plantContract || !address) {
        console.log('❌ Missing requirements for data loading')
        return
      }
      
      try {
        console.log('Loading data...')
        
        // Load NFT counts (handle empty wallets)
        try {
          const counts = await questContract.getUserNFTCounts(address)
          setNftCounts(counts.map(count => Number(count)))
          console.log('✅ NFT counts loaded:', counts.map(count => Number(count)))
        } catch (error) {
          console.log('ℹ️ No NFTs found for this wallet (normal for new wallets)')
          // Initialize with zeros for new wallets
          setNftCounts(new Array(15).fill(0))
        }

        // Load user's individual NFTs with metadata
        try {
          console.log('🔍 About to call totalSupply...')
          const totalSupplyResult = await questContract.totalSupply()
          
          if (!totalSupplyResult || totalSupplyResult.toString() === '0') {
            console.log('📊 No NFTs minted yet (totalSupply = 0)')
            setNftTypes([])
          } else {
            const totalSupply = Number(totalSupplyResult)
            console.log('🔍 Total NFT supply:', totalSupply)
            const userNFTs = []

            // Check all tokens to find which ones belong to the user
            for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
              try {
                const owner = await questContract.ownerOf(tokenId)
                if (owner.toLowerCase() === address.toLowerCase()) {
                  const nftType = await questContract.getNFTType(tokenId)
                  const typeConfig = nftTypesConfig.find(config => config.id === Number(nftType))
                  
                  const nftData = {
                    tokenId,
                    type: Number(nftType),
                    name: typeConfig?.name || `NFT Type ${nftType}`,
                    image: typeConfig?.image || 'default.png'
                  }
                  
                  userNFTs.push(nftData)
                  console.log(`🎮 Found user NFT: Token #${tokenId}, Type ${nftType} (${nftData.name})`)
                }
              } catch (tokenError) {
                console.log(`⚠️ Error checking token ${tokenId}:`, tokenError.message)
                continue
              }
            }

            setNftTypes(userNFTs)
            console.log('✅ User NFTs loaded:', userNFTs.length, 'total')
          }
        } catch (error) {
          console.error('❌ Error loading user NFTs:', error)
          console.error('❌ Error details:', error.message, error.code)
          setNftTypes([])
        }
        
        // Load plant tokens
        try {
          console.log('🌱 About to call getOwnerTokens...')
          const tokens = await plantContract.getOwnerTokens(address)
          
          if (!tokens || tokens.length === 0) {
            console.log('🌱 No plant tokens found for user')
            setPlantTokens([])
          } else {
            console.log('🌱 Found plant tokens:', tokens.map(t => Number(t)))
            const tokenDetails = []
            for (const tokenId of tokens) {
              try {
                const details = await plantContract.getTokenDetails(tokenId)
                tokenDetails.push({
                  id: Number(tokenId),
                  name: details.name,
                  subUnits: Number(details.subUnits),
                  qrCode: details.qrCode
                })
              } catch (tokenError) {
                console.log(`⚠️ Error loading plant token ${tokenId}:`, tokenError.message)
              }
            }
            setPlantTokens(tokenDetails)
            console.log('🌱 Plant tokens loaded:', tokenDetails.length)
          }
        } catch (error) {
          console.error('❌ Error loading plant tokens:', error)
          console.error('❌ Error details:', error.message, error.code)
          setPlantTokens([])
        }
        
        // Load packages
        try {
          console.log('🔄 About to call getTotalPackages...')
          console.log('📝 Contract address:', await questContract.getAddress())
          
          const totalPackages = await questContract.getTotalPackages()
          const packageCount = Number(totalPackages)
          console.log('📦 Total packages found:', packageCount)
          
          if (packageCount === 0) {
            console.log('⚠️ No packages found - setting empty array')
            setPackages([])
            return
          }
          
          const packagesList = []
          for (let i = 0; i < packageCount; i++) {
            try {
              const contents = await questContract.getPackageContents(i)
              const packageData = {
                id: i,
                contents: contents.map(c => Number(c))
              }
              packagesList.push(packageData)
              console.log(`📦 Package ${i} loaded:`, packageData.contents)
            } catch (packageError) {
              console.error(`❌ Error loading package ${i}:`, packageError)
            }
          }
          
          setPackages(packagesList)
          console.log('✅ Packages loaded successfully:', packagesList.length, 'packages')
          console.log('📋 Final packages array:', packagesList)
        } catch (error) {
          console.error('❌ Error loading packages:', error)
          console.error('❌ Error details:', error.message)
          setPackages([]) // Reset to empty array on error
        }
        
        console.log('Data loaded successfully')
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    if (questContract && plantContract && address) {
      console.log('🚀 Starting data load...')
      loadData()
    } else {
      console.log('⏸️ Missing dependencies for data load:', {
        questContract: !!questContract,
        plantContract: !!plantContract,
        address: !!address
      })
    }
  }, [questContract, plantContract, address])

  const createWeeklyPackage = async () => {
    if (!questContract) return
    
    try {
      setLoading(true)
      const tx = await questContract.createWeeklyPackage()
      await tx.wait()
      console.log('Weekly package created!')
      
      // Reload data
      window.location.reload()
    } catch (error) {
      console.error('Error creating package:', error)
    } finally {
      setLoading(false)
    }
  }

  const purchasePackage = async (packageId) => {
    if (!questContract) return
    
    try {
      setLoading(true)
      const tx = await questContract.purchasePackage(packageId)
      await tx.wait()
      console.log('Package purchased!')
      
      // Reload data
      window.location.reload()
    } catch (error) {
      console.error('Error purchasing package:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPlant = async () => {
    if (!plantContract || !newPlantName) return
    
    try {
      setLoading(true)
      
      // First check if user can create plant
      const canCreate = await questContract.canCreatePlant(address)
      if (!canCreate) {
        alert('You need all 15 different NFT types to create a Plant!')
        return
      }
      
      const tx = await plantContract.createPlant(newPlantName)
      await tx.wait()
      console.log('Plant created!')
      setNewPlantName('')
      
      // Reload data
      window.location.reload()
    } catch (error) {
      console.error('Error creating plant:', error)
      alert('Error creating plant. Make sure you have all 15 NFT types!')
    } finally {
      setLoading(false)
    }
  }

  const loadSubUnits = async () => {
    if (!plantContract || !selectedTokenId || !loadAmount) return
    
    try {
      setLoading(true)
      const tx = await plantContract.loadSubUnitsManual(selectedTokenId, loadAmount)
      await tx.wait()
      console.log('Sub-units loaded!')
      
      // Reload data
      window.location.reload()
    } catch (error) {
      console.error('Error loading sub-units:', error)
    } finally {
      setLoading(false)
    }
  }

  const unloadSubUnits = async () => {
    if (!plantContract || !selectedTokenId || !unloadAmount) return
    
    try {
      setLoading(true)
      const tx = await plantContract.unloadSubUnits(selectedTokenId, unloadAmount)
      await tx.wait()
      console.log('Sub-units unloaded!')
      
      // Reload data
      window.location.reload()
    } catch (error) {
      console.error('Error unloading sub-units:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">🌱 Booster NFT dApp</h1>
      
      {/* Connection Status */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Wallet Connection</h2>
        {!mounted ? (
          <div>
            <p className="mb-2 text-gray-600">⏳ Loading wallet state...</p>
          </div>
        ) : isConnected ? (
          <div>
            <p className="mb-2">✅ Connected: {address}</p>
            <p className="mb-2">📦 Contracts: {questContract && plantContract ? '✅ Ready' : '⏳ Loading...'}</p>
            <button 
              type="button"
              onClick={() => disconnect()} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-yellow-600">⚠️ Please connect your MetaMask wallet</p>
            <p className="mb-4 text-sm text-gray-600">
              Make sure you're on Hardhat Local Network (Chain ID: 31337)
            </p>
            {connectors.map((connector) => (
              <button
                key={connector.id}
                type="button"
                onClick={() => connect({ connector })}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {mounted && isConnected && questContract && plantContract && (
        <>
          {/* Quest Game Section */}
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🎮 Quest Game - ERC721A NFTs</h2>
            
            {/* Create Package */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Create Weekly Package (Owner Only)</h3>
              <button
                type="button"
                onClick={createWeeklyPackage}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Weekly Package'}
              </button>
            </div>

            {/* Available Packages */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Available Packages ({packages.length})</h3>
              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border p-4 rounded">
                      <h4 className="font-semibold">Package #{pkg.id}</h4>
                      <p className="text-sm text-gray-600">
                        NFTs: {pkg.contents.join(', ')}
                      </p>
                      <button
                        type="button"
                        onClick={() => purchasePackage(pkg.id)}
                        disabled={loading}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        Purchase
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-700">⏳ Loading packages... or no packages available.</p>
                  <p className="text-sm text-gray-600">If this persists, check the browser console for errors.</p>
                </div>
              )}
            </div>

            {/* NFT Collection Summary */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Collection Summary (by Type)</h3>
              <div className="grid grid-cols-5 gap-2">
                {nftTypesConfig.map((typeConfig, index) => (
                  <div key={`nft-type-${typeConfig.id}`} className="border p-2 text-center">
                    <div className="font-semibold text-xs">{typeConfig.name}</div>
                    <div className="text-lg">{nftCounts[index] || 0}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual NFTs with Images */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Individual NFTs</h3>
              {nftTypes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {nftTypes.map((nft) => (
                    <div key={nft.tokenId} className="border p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square mb-2 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                        <Image 
                          src={`/metadata/images/${nft.image}`}
                          alt={nft.name}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm capitalize">{nft.name}</div>
                        <div className="text-xs text-gray-500">Token #{nft.tokenId}</div>
                        <div className="text-xs text-gray-400">Type {nft.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No NFTs found. Purchase some packages above!</p>
              )}
            </div>

            {/* Create Plant */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Create Plant Token</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Plant name"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  className="border px-3 py-2 rounded flex-1"
                />
                <button
                  type="button"
                  onClick={createPlant}
                  disabled={loading || !newPlantName}
                  className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  Create Plant
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Requires all 15 different NFT types (burns them to create Plant)
              </p>
            </div>
          </div>

          {/* Real Life Game Section */}
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-2xl font-bold mb-4">⚡ Real Life Game - ERC1155 Plant Tokens</h2>
            
            {/* Plant Tokens */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Plant Tokens</h3>
              {plantTokens.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plantTokens.map((token) => (
                    <div key={token.id} className="border p-4 rounded">
                      <h4 className="font-semibold">{token.name}</h4>
                      <p>Sub-units: {token.subUnits.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">QR: {token.qrCode}</p>
                      <p className="text-sm text-gray-600">Token ID: {token.id}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No plant tokens yet. Create one above!</p>
              )}
            </div>

            {/* Sub-unit Management */}
            {plantTokens.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Manage Sub-units</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Load Sub-units */}
                  <div className="border p-4 rounded">
                    <h4 className="font-semibold mb-2">Load Sub-units</h4>
                    <select
                      value={selectedTokenId}
                      onChange={(e) => setSelectedTokenId(e.target.value)}
                      className="border px-3 py-2 rounded w-full mb-2"
                    >
                      <option value="">Select Token</option>
                      {plantTokens.map((token) => (
                        <option key={token.id} value={token.id}>
                          {token.name} (ID: {token.id})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Amount to load"
                      value={loadAmount}
                      onChange={(e) => setLoadAmount(e.target.value)}
                      className="border px-3 py-2 rounded w-full mb-2"
                    />
                    <button
                      type="button"
                      onClick={loadSubUnits}
                      disabled={loading || !selectedTokenId || !loadAmount}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 w-full"
                    >
                      Load Sub-units
                    </button>
                  </div>

                  {/* Unload Sub-units */}
                  <div className="border p-4 rounded">
                    <h4 className="font-semibold mb-2">Unload Sub-units</h4>
                    <select
                      value={selectedTokenId}
                      onChange={(e) => setSelectedTokenId(e.target.value)}
                      className="border px-3 py-2 rounded w-full mb-2"
                    >
                      <option value="">Select Token</option>
                      {plantTokens.map((token) => (
                        <option key={token.id} value={token.id}>
                          {token.name} (ID: {token.id})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Amount to unload"
                      value={unloadAmount}
                      onChange={(e) => setUnloadAmount(e.target.value)}
                      className="border px-3 py-2 rounded w-full mb-2"
                    />
                    <button
                      type="button"
                      onClick={unloadSubUnits}
                      disabled={loading || !selectedTokenId || !unloadAmount}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 w-full"
                    >
                      Unload Sub-units
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contract Addresses */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Contract Information</h3>
            <p className="text-sm"><strong>QuestNFT (ERC721A):</strong> {contracts?.QuestNFT?.address || 'Loading...'}</p>
            <p className="text-sm"><strong>PlantToken (ERC1155):</strong> {contracts?.PlantToken?.address || 'Loading...'}</p>
            <p className="text-sm"><strong>Network:</strong> Hardhat Local (Chain ID: 31337)</p>
          </div>
        </>
      )}
    </div>
  )
}