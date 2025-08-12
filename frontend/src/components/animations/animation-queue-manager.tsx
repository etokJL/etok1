'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NFTMintAnimation } from './nft-mint-animation'
import { NFTBurnAnimation } from './nft-burn-animation'
import { clientSessionAPI, type BackendAnimationStatus } from '@/lib/clientSessionAPI'
import { NFTAnimationManager } from '@/lib/clientSession'
import type { UserNFT } from '@/types/nft'

interface QueuedAnimation {
  id: string
  type: 'mint' | 'burn'
  nft: UserNFT
  timestamp: Date
}

interface AnimationQueueManagerProps {
  nfts: UserNFT[]
  walletAddress?: string
  onAnimationComplete?: (animation: QueuedAnimation) => void
  isVisible?: boolean
  onPendingAnimationsDetected?: () => void
}

export function AnimationQueueManager({ 
  nfts, 
  walletAddress, 
  onAnimationComplete,
  isVisible = true,
  onPendingAnimationsDetected
}: AnimationQueueManagerProps) {
  const [animationQueue, setAnimationQueue] = useState<QueuedAnimation[]>([])
  const [currentAnimation, setCurrentAnimation] = useState<QueuedAnimation | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  /**
   * Lädt ausstehende Animationen vom Backend
   */
  const loadPendingAnimations = useCallback(async () => {
    if (!walletAddress) return

    try {
      const response = await clientSessionAPI.getAnimationStatus()
      
      if (response.success && response.pending_mint_animations) {
        const newAnimations: QueuedAnimation[] = []

        // Verarbeite Mint-Animationen
        response.pending_mint_animations.forEach((animation: BackendAnimationStatus) => {
          const nft = nfts.find(n => 
            n.tokenId.toString() === animation.token_id && 
            animation.token_type === 'nft'
          )
          
          if (nft) {
            // Prüfe ob Animation bereits lokal als gezeigt markiert
            const localStatus = NFTAnimationManager.getAnimationStatus(
              animation.token_id, 
              animation.token_type
            )
            
            if (!localStatus?.needsMintAnimation) {
              newAnimations.push({
                id: `mint_${animation.token_type}_${animation.token_id}`,
                type: 'mint',
                nft,
                timestamp: new Date()
              })
            }
          }
        })

        // Verarbeite Burn-Animationen
        response.pending_burn_animations?.forEach((animation: BackendAnimationStatus) => {
          const nft = nfts.find(n => 
            n.tokenId.toString() === animation.token_id && 
            animation.token_type === 'nft'
          )
          
          if (nft) {
            // Prüfe ob Animation bereits lokal als gezeigt markiert
            const localStatus = NFTAnimationManager.getAnimationStatus(
              animation.token_id, 
              animation.token_type
            )
            
            if (!localStatus?.needsBurnAnimation) {
              newAnimations.push({
                id: `burn_${animation.token_type}_${animation.token_id}`,
                type: 'burn',
                nft,
                timestamp: new Date()
              })
            }
          }
        })

        // Sortiere nach Timestamp (älteste zuerst)
        newAnimations.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        
        setAnimationQueue(prev => {
          // Verhindere Duplikate
          const existingIds = new Set(prev.map(a => a.id))
          const filtered = newAnimations.filter(a => !existingIds.has(a.id))
          if (filtered.length > 0) {
            onPendingAnimationsDetected?.()
          }
          return [...prev, ...filtered]
        })
      }
    } catch (error) {
      console.error('Failed to load pending animations:', error)
    }
  }, [walletAddress, nfts])

  /**
   * Verarbeitet die nächste Animation in der Queue
   */
  const processNextAnimation = useCallback(() => {
    if (!isVisible) return
    if (isProcessing || currentAnimation) return

    const nextAnimation = animationQueue[0]
    if (!nextAnimation) return

    setIsProcessing(true)
    setCurrentAnimation(nextAnimation)
    
    // Entferne Animation aus Queue
    setAnimationQueue(prev => prev.slice(1))
  }, [animationQueue, currentAnimation, isProcessing, isVisible])

  /**
   * Behandelt das Ende einer Animation
   */
  const handleAnimationComplete = useCallback(async (animation: QueuedAnimation) => {
    try {
      // Markiere lokal als gezeigt
      if (animation.type === 'mint') {
        NFTAnimationManager.markMintAnimationShown(
          animation.nft.tokenId.toString(),
          'nft'
        )
        // Markiere im Backend als gezeigt
        await clientSessionAPI.markMintAnimationShown(
          animation.nft.tokenId.toString(),
          'nft'
        )
      } else if (animation.type === 'burn') {
        NFTAnimationManager.markBurnAnimationShown(
          animation.nft.tokenId.toString(),
          'nft'
        )
        // Markiere im Backend als gezeigt
        await clientSessionAPI.markBurnAnimationShown(
          animation.nft.tokenId.toString(),
          'nft'
        )
      }

      // Callback aufrufen
      if (onAnimationComplete) {
        onAnimationComplete(animation)
      }
    } catch (error) {
      console.error('Failed to mark animation as complete:', error)
    } finally {
      setCurrentAnimation(null)
      setIsProcessing(false)
    }
  }, [onAnimationComplete])

  /**
   * Fügt neue Animation zur Queue hinzu
   */
  const queueAnimation = useCallback((type: 'mint' | 'burn', nft: UserNFT) => {
    const animation: QueuedAnimation = {
      id: `${type}_nft_${nft.tokenId.toString()}`,
      type,
      nft,
      timestamp: new Date()
    }

    setAnimationQueue(prev => {
      // Verhindere Duplikate
      if (prev.some(a => a.id === animation.id)) {
        return prev
      }
      return [...prev, animation]
    })
  }, [])

  // Lade ausstehende Animationen beim Start
  useEffect(() => {
    if (walletAddress) {
      loadPendingAnimations()
    }
  }, [walletAddress, loadPendingAnimations])

  // Poll for updates while mounted
  useEffect(() => {
    if (!walletAddress) return
    const interval = setInterval(() => {
      loadPendingAnimations()
    }, 10000)
    return () => clearInterval(interval)
  }, [walletAddress, loadPendingAnimations])

  // When tab/window regains focus or collection becomes visible, refresh queue
  useEffect(() => {
    const handleFocus = () => loadPendingAnimations()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [loadPendingAnimations])

  useEffect(() => {
    if (isVisible) {
      loadPendingAnimations()
    }
  }, [isVisible, loadPendingAnimations])

  // Verarbeite Queue automatisch
  useEffect(() => {
    if (!isProcessing && !currentAnimation && animationQueue.length > 0) {
      const timer = setTimeout(processNextAnimation, 100)
      return () => clearTimeout(timer)
    }
  }, [animationQueue, currentAnimation, isProcessing, processNextAnimation])

  // Synchronisiere Session bei Wallet-Verbindung
  useEffect(() => {
    if (walletAddress) {
      clientSessionAPI.syncSession(walletAddress)
        .then(() => {
          // Lade Animationen nach Sync
          setTimeout(loadPendingAnimations, 500)
        })
        .catch(error => {
          console.error('Failed to sync session:', error)
        })
    }
  }, [walletAddress, loadPendingAnimations])

  return (
    <>
      {/* Aktuelle Animation anzeigen */}
      <AnimatePresence>
        {currentAnimation && currentAnimation.type === 'mint' && (
          <NFTMintAnimation
            nft={currentAnimation.nft}
            isVisible={true}
            onComplete={() => handleAnimationComplete(currentAnimation)}
            delay={0}
          />
        )}
        {currentAnimation && currentAnimation.type === 'burn' && (
          <NFTBurnAnimation
            nft={currentAnimation.nft}
            isVisible={true}
            onComplete={() => handleAnimationComplete(currentAnimation)}
            delay={0}
          />
        )}
      </AnimatePresence>

      {/* Debug Info (nur in Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded-lg z-40">
          <div>Queue: {animationQueue.length}</div>
          <div>Current: {currentAnimation?.type || 'none'}</div>
          <div>Processing: {isProcessing ? 'yes' : 'no'}</div>
          {animationQueue.map((anim, i) => (
            <div key={anim.id}>
              {i + 1}. {anim.type} - {anim.nft.nftType.name}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// Hook für einfache Verwendung
export function useAnimationQueue(nfts: UserNFT[], walletAddress?: string) {
  const [queueManager, setQueueManager] = useState<{
    queueAnimation: (type: 'mint' | 'burn', nft: UserNFT) => void
  } | null>(null)

  const handleQueueRef = useCallback((type: 'mint' | 'burn', nft: UserNFT) => {
    if (queueManager) {
      queueManager.queueAnimation(type, nft)
    }
  }, [queueManager])

  const AnimationQueue = useCallback((props: Partial<AnimationQueueManagerProps>) => (
    <AnimationQueueManager
      nfts={nfts}
      walletAddress={walletAddress}
      {...props}
    />
  ), [nfts, walletAddress])

  return {
    AnimationQueue,
    queueAnimation: handleQueueRef
  }
}

