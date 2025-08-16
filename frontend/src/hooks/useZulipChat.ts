import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'

interface ZulipMessage {
  id: number
  sender_full_name: string
  sender_email: string
  content: string
  timestamp: number
  avatar_url?: string
}

interface ZulipConfig {
  serverUrl: string
  botEmail: string
  botApiKey: string
  streamName: string
  topicName?: string
}

export function useZulipChat(config: ZulipConfig) {
  const { address } = useAccount()
  const [messages, setMessages] = useState<ZulipMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Zulip API base URL
  const apiUrl = `${config.serverUrl}/api/v1`

  // Authentication headers
  const getAuthHeaders = useCallback(() => {
    const credentials = btoa(`${config.botEmail}:${config.botApiKey}`)
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    }
  }, [config.botEmail, config.botApiKey])

  // Test connection to Zulip
  const testConnection = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`${apiUrl}/users/me`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        setIsConnected(true)
        return true
      } else {
        throw new Error(`Connection failed: ${response.status}`)
      }
    } catch (err) {
      console.error('Zulip connection test failed:', err)
      setError(err instanceof Error ? err.message : 'Connection failed')
      setIsConnected(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiUrl, getAuthHeaders])

  // Fetch messages from a stream
  const fetchMessages = useCallback(async (limit = 50) => {
    if (!isConnected) return

    try {
      setIsLoading(true)
      
      const params = new URLSearchParams({
        anchor: 'newest',
        num_before: limit.toString(),
        num_after: '0',
        narrow: JSON.stringify([
          { operator: 'stream', operand: config.streamName },
          ...(config.topicName ? [{ operator: 'topic', operand: config.topicName }] : [])
        ])
      })

      const response = await fetch(`${apiUrl}/messages?${params}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        throw new Error(`Failed to fetch messages: ${response.status}`)
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setIsLoading(false)
    }
  }, [apiUrl, getAuthHeaders, isConnected, config.streamName, config.topicName])

  // Send a message to the stream
  const sendMessage = useCallback(async (content: string) => {
    if (!isConnected || !content.trim()) return false

    try {
      setIsLoading(true)
      setError(null)

      // Add user context if wallet is connected
      const messageContent = address 
        ? `**${address.slice(0, 6)}...${address.slice(-4)}:** ${content}`
        : content

      const payload = {
        type: 'stream',
        to: config.streamName,
        topic: config.topicName || 'General',
        content: messageContent,
      }

      const response = await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        // Refresh messages after sending
        setTimeout(() => fetchMessages(), 500)
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.msg || `Failed to send message: ${response.status}`)
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setError(err instanceof Error ? err.message : 'Failed to send message')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [apiUrl, getAuthHeaders, isConnected, address, config.streamName, config.topicName, fetchMessages])

  // Get stream info
  const getStreamInfo = useCallback(async () => {
    if (!isConnected) return null

    try {
      const response = await fetch(`${apiUrl}/streams`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return data.streams?.find((stream: any) => stream.name === config.streamName)
      }
    } catch (err) {
      console.error('Failed to get stream info:', err)
    }
    return null
  }, [apiUrl, getAuthHeaders, isConnected, config.streamName])

  // Subscribe to a stream (if not already subscribed)
  const subscribeToStream = useCallback(async () => {
    if (!isConnected) return false

    try {
      const payload = {
        subscriptions: JSON.stringify([{
          name: config.streamName,
          description: 'Booster Energy Community Chat'
        }])
      }

      const response = await fetch(`${apiUrl}/users/me/subscriptions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      return response.ok
    } catch (err) {
      console.error('Failed to subscribe to stream:', err)
      return false
    }
  }, [apiUrl, getAuthHeaders, isConnected, config.streamName])

  // Initialize connection on mount
  useEffect(() => {
    if (config.serverUrl && config.botEmail && config.botApiKey) {
      testConnection()
    }
  }, [config.serverUrl, config.botEmail, config.botApiKey, testConnection])

  // Fetch messages when connected
  useEffect(() => {
    if (isConnected) {
      fetchMessages()
      // Set up polling for new messages
      const interval = setInterval(() => fetchMessages(), 10000) // Poll every 10 seconds
      return () => clearInterval(interval)
    }
  }, [isConnected, fetchMessages])

  return {
    // Data
    messages,
    isConnected,
    isLoading,
    error,

    // Actions
    sendMessage,
    testConnection,
    fetchMessages,
    getStreamInfo,
    subscribeToStream,

    // Utilities
    clearError: () => setError(null),
  }
}

