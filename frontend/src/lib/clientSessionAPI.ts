'use client'

import { clientSessionManager } from './clientSession'
import { API } from './constants'

const API_BASE = `${API.BASE_URL}/v1/client-session`

export interface BackendAnimationStatus {
  token_id: string
  token_type: 'nft' | 'token'
  status: {
    needs_mint_animation?: boolean
    needs_burn_animation?: boolean
    last_mint_animation_shown?: string
    last_burn_animation_shown?: string
    updated_at?: string
  }
}

export interface SessionSyncResponse {
  success: boolean
  session?: {
    session_id: string
    wallet_address?: string
    first_seen_at: string
    last_seen_at: string
    pending_mint_animations: BackendAnimationStatus[]
    pending_burn_animations: BackendAnimationStatus[]
    animation_statuses?: Record<string, any>
  }
  pending_mint_animations?: BackendAnimationStatus[]
  pending_burn_animations?: BackendAnimationStatus[]
  message?: string
  errors?: any
}

/**
 * Client Session API Interface
 */
class ClientSessionAPI {
  /**
   * Initialisiert Session mit Backend
   */
  async initSession(walletAddress?: string): Promise<SessionSyncResponse> {
    const session = clientSessionManager.getSession()
    
    try {
      const response = await fetch(`${API_BASE}/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session.sessionId,
          wallet_address: walletAddress
        })
      })

      if (!response.ok) {
        console.error('Session init failed with status:', response.status)
        return {
          success: false,
          message: `Server error: ${response.status}`
        }
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Session init returned non-JSON:', text.slice(0, 200))
        return { success: false, message: 'Invalid server response' }
      }

      const data: SessionSyncResponse = await response.json()
      
      if (data.success) {
        // Update lokale Session mit Wallet-Adresse
        if (walletAddress) {
          clientSessionManager.setWalletAddress(walletAddress)
        }
      }

      return data
    } catch (error) {
      console.error('Failed to init session:', error)
      return {
        success: false,
        message: 'Failed to connect to server'
      }
    }
  }

  /**
   * Synchronisiert Session mit Backend (nach Wallet-Verbindung)
   */
  async syncSession(walletAddress: string): Promise<SessionSyncResponse> {
    const session = clientSessionManager.getSession()
    
    try {
      const response = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session.sessionId,
          wallet_address: walletAddress
        })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Session sync returned non-JSON:', text.slice(0, 200))
        return { success: false, message: 'Invalid server response' }
      }
      const data: SessionSyncResponse = await response.json()
      
      if (data.success) {
        // Update lokale Session
        clientSessionManager.setWalletAddress(walletAddress)
      }

      return data
    } catch (error) {
      console.error('Failed to sync session:', error)
      return {
        success: false,
        message: 'Failed to sync with server'
      }
    }
  }

  /**
   * Holt Animation Status vom Backend
   */
  async getAnimationStatus(): Promise<SessionSyncResponse> {
    const session = clientSessionManager.getSession()
    
    try {
      const response = await fetch(`${API_BASE}/status?session_id=${session.sessionId}`)
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Animation status returned non-JSON:', text.slice(0, 200))
        return { success: false, message: 'Invalid server response' }
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to get animation status:', error)
      return {
        success: false,
        message: 'Failed to get animation status'
      }
    }
  }

  /**
   * Markiert Mint-Animation als gezeigt
   */
  async markMintAnimationShown(tokenId: string, tokenType: 'nft' | 'token'): Promise<SessionSyncResponse> {
    const session = clientSessionManager.getSession()
    
    try {
      const response = await fetch(`${API_BASE}/animation/mint/shown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session.sessionId,
          token_id: tokenId,
          token_type: tokenType
        })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Mint shown returned non-JSON:', text.slice(0, 200))
        return { success: false, message: 'Invalid server response' }
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to mark mint animation shown:', error)
      return {
        success: false,
        message: 'Failed to update animation status'
      }
    }
  }

  /**
   * Markiert Burn-Animation als gezeigt
   */
  async markBurnAnimationShown(tokenId: string, tokenType: 'nft' | 'token'): Promise<SessionSyncResponse> {
    const session = clientSessionManager.getSession()
    
    try {
      const response = await fetch(`${API_BASE}/animation/burn/shown`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session.sessionId,
          token_id: tokenId,
          token_type: tokenType
        })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Burn shown returned non-JSON:', text.slice(0, 200))
        return { success: false, message: 'Invalid server response' }
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to mark burn animation shown:', error)
      return {
        success: false,
        message: 'Failed to update animation status'
      }
    }
  }

  /**
   * Holt Session Details
   */
  async getSession(): Promise<SessionSyncResponse> {
    const session = clientSessionManager.getSession()
    
    try {
      const response = await fetch(`${API_BASE}/${session.sessionId}`)
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Get session returned non-JSON:', text.slice(0, 200))
        return { success: false, message: 'Invalid server response' }
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to get session:', error)
      return {
        success: false,
        message: 'Failed to get session details'
      }
    }
  }
}

// Singleton Instance
export const clientSessionAPI = new ClientSessionAPI()

