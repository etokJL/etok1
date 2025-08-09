'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'btn-base relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        swiss: 'bg-red-500 text-white hover:bg-red-600 swiss-quality',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base',
        xl: 'h-14 px-12 text-lg',
        icon: 'h-10 w-10',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      loading: false,
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'size'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false, 
    loadingText = 'Loading...', 
    disabled, 
    children, 
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, loading, className }))}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <span className={cn(loading && 'sr-only')}>
          {loading ? loadingText : children as React.ReactNode}
        </span>
        
        {/* Quality indicator for swiss variant */}
        {variant === 'swiss' && (
          <motion.div
            className="absolute -top-1 -right-1 text-xs"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            
          </motion.div>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }