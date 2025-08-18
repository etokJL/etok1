'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  wallet_address?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  })
  const [loading, setLoading] = useState(true)

  // Check for stored auth data on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        setAuthState({
          isAuthenticated: true,
          user,
          token
        })
      } catch (error) {
        console.error('Failed to parse user data:', error)
        // Clear invalid data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const { user, token } = data.data
        
        // Store in localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(user))
        
        setAuthState({
          isAuthenticated: true,
          user,
          token
        })
        
        return { success: true, user, token }
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    wallet_address?: string
  }) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        const { user, token } = data.data
        
        // Store in localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(user))
        
        setAuthState({
          isAuthenticated: true,
          user,
          token
        })
        
        return { success: true, user, token }
      } else {
        return { 
          success: false, 
          message: data.message,
          errors: data.errors 
        }
      }
    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      }
    }
  }

  const logout = async () => {
    try {
      if (authState.token) {
        await fetch('http://localhost:8000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null
      })
    }
  }

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user_data', JSON.stringify(updatedUser))
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }))
  }

  return {
    ...authState,
    loading,
    login,
    register,
    logout,
    updateUser
  }
}


