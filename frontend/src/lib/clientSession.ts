'use client'

import { v4 as uuidv4 } from 'uuid'

export interface ClientSession {
  sessionId: string
  createdAt: Date
  lastSeen: Date
  walletAddress?: string
}

export interface NFTAnimationStatus {
  tokenId: string
  tokenType: 'nft' | 'token'
  needsMintAnimation: boolean
  needsBurnAnimation: boolean
  lastAnimationShown?: Date
}

const SESSION_COOKIE_NAME = 'booster_client_session'
const SESSION_STORAGE_KEY = 'booster_session_data'

/**
 * Cookie-basiertes Client Session Management
 * - Session läuft nie ab
 * - Eindeutige Session pro Browser/Gerät
 * - Keine Login erforderlich
 */
class ClientSessionManager {
  private session: ClientSession | null = null

  /**
   * Initialisiert oder lädt bestehende Session
   */
  init(): ClientSession {
    if (typeof window === 'undefined') {
      throw new Error('ClientSession can only be used in browser environment')
    }

    // Versuche bestehende Session zu laden
    let sessionId = this.getSessionIdFromCookie()
    
    if (!sessionId) {
      // Erstelle neue Session
      sessionId = uuidv4()
      this.setSessionCookie(sessionId)
    }

    // Lade oder erstelle Session-Daten
    this.session = this.loadOrCreateSessionData(sessionId)
    
    // Update last seen
    this.session.lastSeen = new Date()
    this.saveSessionData()

    return this.session
  }

  /**
   * Holt aktuelle Session (initialisiert automatisch wenn nötig)
   */
  getSession(): ClientSession {
    if (!this.session) {
      return this.init()
    }
    return this.session
  }

  /**
   * Setzt Wallet-Adresse für Session
   */
  setWalletAddress(address: string): void {
    const session = this.getSession()
    session.walletAddress = address
    this.saveSessionData()
  }

  /**
   * Entfernt Wallet-Adresse von Session
   */
  clearWalletAddress(): void {
    const session = this.getSession()
    session.walletAddress = undefined
    this.saveSessionData()
  }

  /**
   * Lädt Session-ID aus Cookie
   */
  private getSessionIdFromCookie(): string | null {
    if (typeof document === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === SESSION_COOKIE_NAME) {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  /**
   * Setzt Session Cookie (läuft nie ab)
   */
  private setSessionCookie(sessionId: string): void {
    if (typeof document === 'undefined') return
    
    // Cookie läuft in 10 Jahren ab (praktisch nie)
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 10)
    
    document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
  }

  /**
   * Lädt bestehende Session-Daten oder erstellt neue
   */
  private loadOrCreateSessionData(sessionId: string): ClientSession {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    
    if (stored) {
      try {
        const data = JSON.parse(stored)
        return {
          sessionId: data.sessionId || sessionId,
          createdAt: new Date(data.createdAt),
          lastSeen: new Date(data.lastSeen),
          walletAddress: data.walletAddress
        }
      } catch (e) {
        console.warn('Failed to parse stored session data:', e)
      }
    }

    // Erstelle neue Session-Daten
    return {
      sessionId,
      createdAt: new Date(),
      lastSeen: new Date()
    }
  }

  /**
   * Speichert Session-Daten im localStorage
   */
  private saveSessionData(): void {
    if (!this.session || typeof localStorage === 'undefined') return
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      sessionId: this.session.sessionId,
      createdAt: this.session.createdAt.toISOString(),
      lastSeen: this.session.lastSeen.toISOString(),
      walletAddress: this.session.walletAddress
    }))
  }
}

/**
 * NFT Animation Status Management
 */
class NFTAnimationManager {
  private static readonly ANIMATION_STATUS_KEY = 'booster_nft_animations'

  /**
   * Lädt Animation Status für alle NFTs
   */
  static getAnimationStatuses(): Record<string, NFTAnimationStatus> {
    if (typeof localStorage === 'undefined') return {}
    
    const stored = localStorage.getItem(this.ANIMATION_STATUS_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        // Konvertiere Datum-Strings zurück zu Date-Objekten
        Object.values(data).forEach((status: any) => {
          if (status.lastAnimationShown) {
            status.lastAnimationShown = new Date(status.lastAnimationShown)
          }
        })
        return data
      } catch (e) {
        console.warn('Failed to parse animation statuses:', e)
      }
    }
    return {}
  }

  /**
   * Holt Animation Status für spezifisches NFT
   */
  static getAnimationStatus(tokenId: string, tokenType: 'nft' | 'token'): NFTAnimationStatus | null {
    const statuses = this.getAnimationStatuses()
    const key = `${tokenType}_${tokenId}`
    return statuses[key] || null
  }

  /**
   * Setzt Animation Status für NFT
   */
  static setAnimationStatus(status: NFTAnimationStatus): void {
    const statuses = this.getAnimationStatuses()
    const key = `${status.tokenType}_${status.tokenId}`
    statuses[key] = status
    this.saveAnimationStatuses(statuses)
  }

  /**
   * Markiert Mint-Animation als gezeigt
   */
  static markMintAnimationShown(tokenId: string, tokenType: 'nft' | 'token'): void {
    const status = this.getAnimationStatus(tokenId, tokenType) || {
      tokenId,
      tokenType,
      needsMintAnimation: false,
      needsBurnAnimation: false
    }
    
    status.needsMintAnimation = false
    status.lastAnimationShown = new Date()
    this.setAnimationStatus(status)
  }

  /**
   * Markiert Burn-Animation als gezeigt
   */
  static markBurnAnimationShown(tokenId: string, tokenType: 'nft' | 'token'): void {
    const status = this.getAnimationStatus(tokenId, tokenType) || {
      tokenId,
      tokenType,
      needsMintAnimation: false,
      needsBurnAnimation: false
    }
    
    status.needsBurnAnimation = false
    status.lastAnimationShown = new Date()
    this.setAnimationStatus(status)
  }

  /**
   * Speichert alle Animation Statuses
   */
  private static saveAnimationStatuses(statuses: Record<string, NFTAnimationStatus>): void {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(this.ANIMATION_STATUS_KEY, JSON.stringify(statuses))
  }
}

// Singleton Instance
export const clientSessionManager = new ClientSessionManager()
export { NFTAnimationManager }

