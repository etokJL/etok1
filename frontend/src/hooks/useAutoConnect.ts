'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect } from 'wagmi'

export function useAutoConnect() {
  const { isConnected, isConnecting, status } = useAccount()
  const { connect, connectors } = useConnect()
  const [isAttemptingConnect, setIsAttemptingConnect] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)

  useEffect(() => {
    // Check if user wants to skip auto-connect
    const skipAutoConnect = typeof window !== 'undefined' && localStorage.getItem('skipAutoConnect') === 'true'
    
    // Only attempt auto-connect once when the component mounts
    if (!hasAttempted && !isConnected && status === 'disconnected' && !skipAutoConnect) {
      setHasAttempted(true)
      setIsAttemptingConnect(true)

      // Try to auto-connect with the most likely wallet
      const attemptConnect = async () => {
        try {
          // Check if we're in browser environment
          if (typeof window === 'undefined') {
            setIsAttemptingConnect(false)
            return
          }

          // Wenn localStorage einen bevorzugten Wallet-Connector gespeichert hat, diesen zuerst versuchen
          const preferred = typeof window !== 'undefined' ? localStorage.getItem('booster-preferred-wallet') : null
          // Prefer injected (MetaMask) if available, otherwise first available connector
          const injected = connectors.find(c => c.id === 'io.metamask' || c.type === 'injected')
          const target = connectors.find(c => c.id === preferred) || injected || connectors[0]
          if (target) {
            await connect({ connector: target })
          }
        } catch (error) {
          // Auto-connect failed, this is normal if user rejects or no wallet
          console.log('Auto-connect attempt failed (this is normal):', error)
        } finally {
          // Always finish the attempt after a short delay
          setTimeout(() => {
            setIsAttemptingConnect(false)
          }, 200)
        }
      }

      // Set a maximum timeout for auto-connect attempts
      const maxTimeout = setTimeout(() => {
        console.log('Auto-connect timeout reached')
        setIsAttemptingConnect(false)
        // Programmatically perform the same action as the old manual button:
        // mark skipAutoConnect and reload once to show manual connector list immediately.
        try {
          if (typeof window !== 'undefined' && !isConnected) {
            const alreadySet = typeof window !== 'undefined' && localStorage.getItem('skipAutoConnect') === 'true'
            if (!alreadySet && typeof window !== 'undefined') {
              localStorage.setItem('skipAutoConnect', 'true')
              window.location.reload()
            }
          }
        } catch (_) {}
      }, 2000)

      // Add a small delay to allow wagmi to initialize
      const timer = setTimeout(attemptConnect, 100)
      return () => {
        clearTimeout(timer)
        clearTimeout(maxTimeout)
      }
    } else if (skipAutoConnect && !hasAttempted) {
      // If user chose to skip auto-connect, mark as attempted immediately
      setHasAttempted(true)
      // Clear the skip flag for next time
      if (typeof window !== 'undefined') {
        localStorage.removeItem('skipAutoConnect')
      }
    }
  }, [hasAttempted, isConnected, isConnecting, connect, connectors])

  return {
    isAutoConnecting: isAttemptingConnect || isConnecting,
    hasAttempted,
    isConnected
  }
}
