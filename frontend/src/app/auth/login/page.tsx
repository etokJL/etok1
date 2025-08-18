'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    document.title = 'Login - Booster Energy'
    
    // Redirect if already logged in
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password)
    
    if (result.success) {
      console.log('Login successful:', result)
      router.push('/')
    } else {
      console.error('Login failed:', result.message)
      alert(result.message || 'Login failed')
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


