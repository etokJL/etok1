'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Copy, QrCode } from 'lucide-react'
import { type BackendToken } from '@/types'

interface EnhancedTokenCardProps {
  token: BackendToken
  className?: string
  viewMode?: 'grid' | 'list'
  onViewDetails?: (token: BackendToken) => void
}

const energyIcons: Record<string, string> = {
  'Solar Panel': '☀️',
  'Wind Turbine': '💨',
  'Battery': '🔋',
  'Smart Home': '🏠',
  'E-Car': '🚗',
  'Heat Pump': '🌡️',
  'Smart Meter': '⚡',
  'E-Bike': '🚴',
  'Charging Station': '🔌',
  'Home Battery': '🔋',
  'Power Bank': '🔋',
  'Electric Boiler': '🔥',
  'E-Roller': '🛴',
  'Charge Controller': '⚙️',
  'Smartphone': '📱',
  'Quest NFT Type 1': '⚡',
  'Quest NFT Type 2': '🌞',
  'Quest NFT Type 3': '💨',
  'Quest NFT Type 4': '🔋',
  'Quest NFT Type 5': '🏠',
  'Quest NFT Type 6': '🚗',
  'Quest NFT Type 7': '🌡️',
  'Quest NFT Type 8': '⚡',
  'Quest NFT Type 9': '🚴',
  'Quest NFT Type 10': '🌱',
  'Quest NFT Type 11': '🔌',
  'Quest NFT Type 12': '💡',
  'Quest NFT Type 13': '🌍',
  'Quest NFT Type 14': '⚙️',
  'Quest NFT Type 15': '🎯',
  'Plant Token A': '🌱',
  'Plant Token B': '🌿',
  'E car': '🚗',
  'Smart home': '🏠',
  'Charge controller': '⚙️',
  'Power bank': '🔋',
  'Charging station': '🔌',
  'Home battery': '🔋',
  'Smart meter': '⚡',
  'E roller': '🛴',
  'Electric boiler': '🔥'
}

const getRarityColor = (quantity: number): string => {
  if (quantity >= 5) return 'bg-gray-100 text-gray-800 border-gray-200'
  if (quantity >= 3) return 'bg-green-100 text-green-800 border-green-200'
  if (quantity >= 2) return 'bg-blue-100 text-blue-800 border-blue-200'
  return 'bg-purple-100 text-purple-800 border-purple-200'
}

const getRarityName = (quantity: number): string => {
  if (quantity >= 5) return 'Common'
  if (quantity >= 3) return 'Uncommon'
  if (quantity >= 2) return 'Rare'
  return 'Epic'
}

export function EnhancedTokenCard({ 
  token, 
  className, 
  viewMode = 'grid',
  onViewDetails 
}: EnhancedTokenCardProps) {
  const [imageError, setImageError] = useState(false)

  const icon = energyIcons[token.name] || '🎁'
  const rarityColor = getRarityColor(1)
  const rarityName = getRarityName(1)

  // Map token names to image file names
  const getImagePath = (tokenName: string): string => {
    const imageMap: Record<string, string> = {
      'Solar Panel': 'solar-panel.png',
      'Wind Turbine': 'wind-turbine.png',
      'Battery': 'home-battery.png',
      'Smart Home': 'smart-home.png',
      'E-Car': 'e-car.png',
      'Heat Pump': 'heat-pump.png',
      'Smart Meter': 'smart-meter.png',
      'E-Bike': 'e-bike.png',
      'Charging Station': 'charging-station.png',
      'Home Battery': 'home-battery.png',
      'Power Bank': 'power-bank.png',
      'Electric Boiler': 'electric-boiler.png',
      'E-Roller': 'e-roller.png',
      'Charge Controller': 'charge-controller.png',
      'Smartphone': 'smartphone.png',
      'E car': 'e-car.png',
      'Smart home': 'smart-home.png',
      'Charge controller': 'charge-controller.png',
      'Power bank': 'power-bank.png',
      'Charging station': 'charging-station.png',
      'Home battery': 'home-battery.png',
      'Smart meter': 'smart-meter.png',
      'E roller': 'e-roller.png',
      'Electric boiler': 'electric-boiler.png'
    }
    return `/metadata/images/${imageMap[tokenName] || 'solar-panel.png'}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(token)
    }
  }

  // Grid View
  if (viewMode === 'grid') {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden cursor-pointer group" onClick={handleViewDetails}>
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
              {!imageError && (
                <img
                  src={getImagePath(token.name)}
                  alt={token.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              )}
              
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                  <div className="text-center">
                    <div className="text-6xl mb-3">{icon}</div>
                    <div className="text-sm font-medium text-gray-600 px-4">{token.name}</div>
                  </div>
                </div>
              )}
              
              <div className="absolute top-3 right-3 text-2xl bg-white/80 rounded-full p-2 backdrop-blur-sm">
                {icon}
              </div>
              
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  #{token.token_id}
                </Badge>
              </div>

              <div className="absolute bottom-3 left-3">
                <Badge className={`${getRarityColor(1)} text-xs`}>
                  {token.token_type.toUpperCase()}
                </Badge>
              </div>

              {token.sub_units && (
                <div className="absolute bottom-3 right-3">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {token.sub_units} units
                  </Badge>
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="bg-white/90 text-gray-800 hover:bg-white">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-xs line-clamp-1 leading-tight">
                  {token.name}
                </h3>
                <Badge className={`${rarityColor} text-xs ml-1 flex-shrink-0`}>
                  {rarityName}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span className="truncate">{token.token_type}</span>
                <span>#{token.token_id}</span>
              </div>

              {token.qr_code && (
                <div className="flex items-center gap-1">
                  <QrCode className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs text-gray-500 truncate">{token.qr_code}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // List View
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="cursor-pointer group" onClick={handleViewDetails}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 flex-shrink-0">
              {!imageError && (
                <img
                  src={getImagePath(token.name)}
                  alt={token.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              )}
              
              {imageError && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-2xl">{icon}</div>
                </div>
              )}
              
              <div className="absolute top-1 right-1 text-sm bg-white/80 rounded-full p-1">
                {icon}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {token.name}
                </h3>
                <Badge className={`${rarityColor} text-xs ml-2`}>
                  {rarityName}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                <span>Type: {token.token_type}</span>
                <span>ID: {token.token_id}</span>
                {token.sub_units && (
                  <span className="text-green-600 font-medium">
                    {token.sub_units} units
                  </span>
                )}
              </div>

              {token.qr_code && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <QrCode className="w-3 h-3" />
                  <span className="truncate">{token.qr_code}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  copyToClipboard(token.token_id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDetails()
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
