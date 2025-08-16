'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    document.title = 'Login - Booster Energy'
  }, [])

  const handleLogin = async (email: string, password: string) => {
    console.log('Login attempt:', email, password)
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('Login successful:', result)
        // Store token
        if (result.data?.token) {
          localStorage.setItem('auth_token', result.data.token)
        }
        // Redirect to dashboard or home
        router.push('/')
      } else {
        console.error('Login failed:', result)
        alert(`Login failed: ${result.message || 'Invalid credentials'}`)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed: Network error')
    }
  }

  const handleForgotPassword = () => {
    console.log('Forgot password clicked')
    router.push('/auth/reset-password')
  }

  const handleSwitchToRegister = () => {
    router.push('/auth/register')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <LoginForm
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </div>
  )
}


