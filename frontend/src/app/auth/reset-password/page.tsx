'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PasswordResetForm } from '@/components/auth/password-reset-form'

export default function ResetPasswordPage() {
  const router = useRouter()

  useEffect(() => {
    document.title = 'Reset Password - Booster Energy'
  }, [])

  const handleSendResetLink = async (email: string) => {
    console.log('Send reset link for:', email)
    // TODO: Implement actual reset link sending
  }

  const handleResetPassword = async (data: {
    email: string
    token: string
    password: string
    password_confirmation: string
  }) => {
    console.log('Reset password with:', data)
    // TODO: Implement actual password reset
  }

  const handleBackToLogin = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <PasswordResetForm
        onSendResetLink={handleSendResetLink}
        onResetPassword={handleResetPassword}
        onBackToLogin={handleBackToLogin}
      />
    </div>
  )
}


