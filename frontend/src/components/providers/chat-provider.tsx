'use client'

import WebSocketChatSystem from '@/components/chat/websocket-chat-system'
import { useAuth } from '@/hooks/useAuth'

export function ChatProvider() {
  const { user, token } = useAuth()
  
  console.log('🔌 ChatProvider State:', {
    user,
    hasToken: !!token,
    tokenPreview: token?.substring(0, 10) + '...'
  });
  
  return (
    <WebSocketChatSystem 
      currentUser={user ? {
        id: user.id,
        name: user.name,
        email: user.email
      } : null}
      authToken={token}
    />
  )
}

