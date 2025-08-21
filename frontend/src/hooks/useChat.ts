import { useState, useEffect, useCallback, useRef } from 'react';

// Client-side only imports
let Echo: any = null;
let Pusher: any = null;

if (typeof window !== 'undefined') {
  // Synchronous imports for better stability
  const PusherModule = require('pusher-js');
  const EchoModule = require('laravel-echo');
  
  Pusher = PusherModule.default || PusherModule;
  Echo = EchoModule.default || EchoModule;
  
  (window as any).Pusher = Pusher;
}

interface ChatMessage {
  id: number;
  content: string;
  channel: string;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface ChatUser {
  id: number;
  name: string;
}

interface UseChatOptions {
  channel?: string;
  authToken?: string;
}

export function useChat({ channel = 'general', authToken }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const echoRef = useRef<typeof Echo | null>(null);

  // Initialize Echo connection
  useEffect(() => {
    console.log('🔧 Initializing Chat Connection:', {
      hasAuthToken: !!authToken,
      hasWindow: typeof window !== 'undefined',
      hasEcho: !!Echo,
      hasPusher: !!Pusher
    });
    
    if (!authToken || typeof window === 'undefined') {
      console.log('❌ Cannot initialize: missing authToken or not in browser');
      setIsLoading(false);
      return;
    }
    
    if (!Echo || !Pusher) {
      console.log('❌ Cannot initialize: Echo or Pusher not loaded');
      setIsLoading(false);
      return;
    }

    try {
      // Initialize Laravel Echo with Reverb
      echoRef.current = new Echo({
        broadcaster: 'reverb',
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'reverb-key',
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
        wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8081'),
        wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '8081'),
        forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      // Listen to connection events
      echoRef.current.connector.pusher.connection.bind('connected', () => {
        setIsConnected(true);
        setIsLoading(false);
      });

      echoRef.current.connector.pusher.connection.bind('disconnected', () => {
        setIsConnected(false);
      });

      echoRef.current.connector.pusher.connection.bind('error', (error: any) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Failed to initialize Echo:', error);
      setIsLoading(false);
    }

    return () => {
      if (echoRef.current) {
        echoRef.current.disconnect();
      }
    };
  }, [authToken]);

  // Listen for messages in the current channel
  useEffect(() => {
    if (!echoRef.current || !isConnected) return;

    const channelName = `chat.${channel}`;
    
    // Leave previous channel if any
    echoRef.current.leave(channelName);
    
    // Join new channel and listen for messages
    echoRef.current.channel(channelName)
      .listen('MessageSent', (data: ChatMessage) => {
        setMessages(prev => [...prev, data]);
      });

    return () => {
      if (echoRef.current) {
        echoRef.current.leave(channelName);
      }
    };
  }, [channel, isConnected]);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!authToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/chat/messages?channel=${channel}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [channel, authToken]);

  // Fetch online users
  const fetchUsers = useCallback(async () => {
    if (!authToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/chat/users`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [authToken]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    console.log('🔍 SendMessage Debug:', {
      hasAuthToken: !!authToken,
      authTokenLength: authToken?.length,
      content: content.trim(),
      hasCurrentUser: false // currentUser not available in this scope
    });
    
    if (!authToken || !content.trim()) {
      console.log('❌ Cannot send message: missing token or content');
      return false;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          channel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Chat API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }, [channel, authToken]);

  // Load initial data when connected
  useEffect(() => {
    if (isConnected) {
      fetchMessages();
      fetchUsers();
    }
  }, [isConnected, fetchMessages, fetchUsers]);

  return {
    messages,
    users,
    isConnected,
    isLoading,
    sendMessage,
    refreshMessages: fetchMessages,
    refreshUsers: fetchUsers,
  };
}
