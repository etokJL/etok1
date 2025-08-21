'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../config/app.config';

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
  email?: string;
  last_seen?: string;
  is_recent?: boolean;
}

interface UseChatSimpleOptions {
  channel?: string;
  authToken?: string;
}

export function useChatSimple({ channel = 'general', authToken }: UseChatSimpleOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      console.log('📥 Fetching messages...');
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      // Add auth token if available (for future authenticated features)
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${getApiUrl('/chat/messages')}?channel=${channel}`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Messages fetched:', data.messages?.length || 0);
        setMessages(data.messages || []);
      } else {
        console.error('❌ Failed to fetch messages:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    }
  }, [authToken, channel]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      // Add auth token if available (for future authenticated features)
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${getApiUrl('/chat/users')}`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [authToken]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    console.log('🔍 SendMessage Debug:', {
      hasAuthToken: !!authToken,
      authTokenLength: authToken?.length,
      content: content.trim(),
    });
    
    if (!authToken || !content.trim()) {
      console.log('❌ Cannot send message: missing token or content');
      return false;
    }

    try {
      console.log('📤 Sending message...');
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
        console.error('❌ Chat API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }

      console.log('✅ Message sent successfully');
      // Refetch messages after sending
      await fetchMessages();
      return true;
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      return false;
    }
  }, [channel, authToken, fetchMessages]);

  // Load initial data
  useEffect(() => {
    console.log('🔄 Loading initial chat data...');
    setIsLoading(true);
    Promise.all([fetchMessages(), fetchUsers()]).finally(() => {
      setIsLoading(false);
    });
  }, [fetchMessages, fetchUsers]);

  // Auto refresh messages every 5 seconds
  useEffect(() => {
    if (authToken) {
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [authToken, fetchMessages]);

  return {
    messages,
    users,
    isConnected: !!authToken, // Simple connection state
    isLoading,
    sendMessage,
  };
}
