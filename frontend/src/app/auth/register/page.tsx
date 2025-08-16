'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    document.title = 'Register - Booster Energy'
  }, [])

  const handleRegister = async (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    wallet_address?: string
  }) => {
    console.log('Register attempt:', data)
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('Registration successful:', result)
        // Store token if provided
        if (result.data?.token) {
          localStorage.setItem('auth_token', result.data.token)
        }
        // Redirect to login or dashboard
        router.push('/auth/login?registered=true')
      } else {
        console.error('Registration failed:', result)
        
        // Show specific validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join('\n')
          alert(`Registration failed:\n\n${errorMessages}`)
        } else {
          alert(`Registration failed: ${result.message || 'Unknown error'}`)
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed: Network error')
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


