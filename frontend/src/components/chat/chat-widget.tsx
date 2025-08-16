'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { useAccount } from 'wagmi'

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: Date
  isBot?: boolean
}

interface ChatWidgetProps {
  zulipUrl?: string
  streamName?: string
  botEmail?: string
  botApiKey?: string
}

export function ChatWidget({ 
  zulipUrl = 'http://localhost:9090',
  streamName = 'general',
  botEmail = 'bot@booster.energy',
  botApiKey = 'your-bot-api-key'
}: ChatWidgetProps) {
  const { address } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessages: ChatMessage[] = [
      {
        id: '1',
        sender: 'Booster Bot',
        content: 'Welcome to Booster Energy Chat! 🚀',
        timestamp: new Date(),
        isBot: true
      },
      {
        id: '2',
        sender: 'Booster Bot',
        content: 'Connect your wallet to join the conversation and get support.',
        timestamp: new Date(),
        isBot: true
      }
    ]
    setMessages(welcomeMessages)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate Zulip connection (replace with actual Zulip API calls)
  const connectToZulip = async () => {
    setIsLoading(true)
    try {
      // Here you would implement actual Zulip API connection
      // For now, we'll simulate a connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsConnected(true)
      
      // Add connection success message
      const connectedMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'System',
        content: `✅ Connected to chat server! ${address ? `Welcome ${address.slice(0, 6)}...${address.slice(-4)}` : 'Please connect wallet for full features.'}`,
        timestamp: new Date(),
        isBot: true
      }
      setMessages(prev => [...prev, connectedMessage])
    } catch (error) {
      console.error('Failed to connect to Zulip:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Send message to Zulip
  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Anonymous',
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Here you would send to actual Zulip API
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate bot response
      if (newMessage.toLowerCase().includes('help')) {
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'Booster Bot',
          content: '🤖 Here are some helpful commands:\n• Type "shop" for shop help\n• Type "nft" for NFT collection help\n• Type "support" for technical support',
          timestamp: new Date(),
          isBot: true
        }
        setTimeout(() => setMessages(prev => [...prev, botResponse]), 1000)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
        {/* Notification indicator */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          !
        </div>
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <div>
                  <h3 className="font-semibold">Booster Energy Chat</h3>
                  <p className="text-xs text-blue-200">
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-blue-200 hover:text-white"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-200 hover:text-white"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {!isConnected && (
                    <div className="text-center py-4">
                      <button
                        onClick={connectToZulip}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? 'Connecting...' : 'Connect to Chat'}
                      </button>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <div className="flex items-center mb-1">
                          <UserIcon className="h-3 w-3 mr-2" />
                          <span className="text-xs font-medium">{message.sender}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {isConnected && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendMessage}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {address ? `Connected as ${address.slice(0, 8)}...` : 'Connect wallet for full features'}
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
