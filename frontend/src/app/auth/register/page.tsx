'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/auth/register-form'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()

  useEffect(() => {
    document.title = 'Register - Booster Energy'
    
    // Redirect if already logged in
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleRegister = async (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    wallet_address?: string
  }) => {
    const result = await register(data)
    
    if (result.success) {
      console.log('Registration successful:', result)
      router.push('/')
    } else {
      console.error('Registration failed:', result.message)
      
      // Show detailed validation errors
      if (result.errors) {
        const errorMessages = Object.values(result.errors).flat().join('\n')
        alert(`Registration failed:\n${errorMessages}`)
      } else {
        alert(`Registration failed: ${result.message || 'Unknown error'}`)
      }
    }
  }

  const handleSwitchToLogin = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <RegisterForm
        onSubmit={handleRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  )
}


