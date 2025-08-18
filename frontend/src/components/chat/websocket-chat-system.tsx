'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserGroupIcon,
  MinusIcon 
} from '@heroicons/react/24/outline';
import { useChatSimple } from '@/hooks/useChatSimple';

interface User {
  id: number;
  name: string;
}

interface WebSocketChatSystemProps {
  currentUser: User | null;
  authToken?: string;
}

export default function WebSocketChatSystem({ currentUser, authToken }: WebSocketChatSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChannel] = useState('general');
  const [activeTab, setActiveTab] = useState<'chat' | 'users'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('🎮 WebSocketChatSystem Props:', {
      currentUser,
      hasAuthToken: !!authToken,
      authTokenPreview: authToken?.substring(0, 10) + '...'
    });
  }, [currentUser, authToken]);

  const { 
    messages, 
    users, 
    isConnected, 
    isLoading, 
    sendMessage 
  } = useChatSimple({ 
    channel: selectedChannel, 
    authToken 
  });

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  if (!currentUser) {
    return null;
  }

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  console.log('🎮 Rendering WebSocketChatSystem', { currentUser, hasAuthToken: !!authToken });

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 right-6 z-[9998] bg-white rounded-lg shadow-2xl border border-gray-200 w-80 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-5 h-5" />
                <span className="font-medium">Energy Chat</span>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-blue-700 p-1 rounded"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="hover:bg-blue-700 p-1 rounded"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs - Hidden when minimized */}
            {!isMinimized && (
              <>
                {/* Tab Navigation */}
                <div className="flex border-b bg-white">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'chat'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 px-4 py-2 text-sm font-medium ${
                      activeTab === 'users'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    👥 Users ({users.length})
                  </button>
                </div>

                {activeTab === 'chat' && (
                  <>
                    {/* Chat Status */}
                    <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
                  {!authToken ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Please log in to chat
                    </span>
                  ) : isLoading ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Connecting...
                    </span>
                  ) : isConnected ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Connected • {users.length} users online
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Disconnected • Check network
                    </span>
                  )}
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  {!authToken ? (
                    <div className="text-center text-gray-500 text-sm py-8">
                      <div className="mb-2">🔐</div>
                      Please log in to join the chat
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.user.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.user.id === currentUser.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.user.id !== currentUser.id && (
                            <div className="text-xs font-medium mb-1 opacity-75">
                              {message.user.name}
                            </div>
                          )}
                          <div className="text-sm">{message.content}</div>
                          <div className={`text-xs mt-1 ${
                            message.user.id === currentUser.id ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      disabled={!isConnected || !authToken}
                      maxLength={1000}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || !isConnected || !authToken}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-md transition-colors"
                    >
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                  </div>
                </form>
                  </>
                )}

                {activeTab === 'users' && (
                  <>
                    {/* Users List */}
                    <div className="h-80 overflow-y-auto p-4">
                      {!authToken ? (
                        <div className="text-center text-gray-500 text-sm py-8">
                          <div className="mb-2">🔐</div>
                          Please log in to see users
                        </div>
                      ) : users.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-8">
                          <div className="mb-2">👥</div>
                          No other users online
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Current User */}
                          {currentUser && (
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {currentUser.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {currentUser.name} (You)
                                </div>
                                <div className="text-xs text-gray-500">
                                  {currentUser.email}
                                </div>
                              </div>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          )}
                          
                          {/* Other Users */}
                          {users.map((user) => (
                            <div key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                user.is_recent ? 'bg-green-500' : 'bg-gray-500'
                              }`}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {user.last_seen ? `Last seen ${user.last_seen}` : 'Online'}
                                </div>
                                {user.email && (
                                  <div className="text-xs text-gray-400 truncate">
                                    {user.email}
                                  </div>
                                )}
                              </div>
                              <div className={`w-2 h-2 rounded-full ${user.is_recent ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Users Footer */}
                    <div className="p-4 border-t bg-gray-50 text-center text-xs text-gray-500">
                      {users.length + (currentUser ? 1 : 0)} user{users.length === 0 && !currentUser ? '' : 's'} online
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
