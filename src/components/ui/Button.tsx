'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'cosmic' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'cosmic', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden'
    
    const variants = {
      cosmic: 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#050508] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:-translate-y-0.5',
      ghost: 'bg-transparent text-gray-300 border border-white/10 hover:border-[#8b5cf6] hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
      outline: 'bg-transparent text-[#3b82f6] border border-[#3b82f6]/50 hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]',
      danger: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-full',
      md: 'px-6 py-3 text-sm uppercase rounded-full',
      lg: 'px-8 py-4 text-base uppercase rounded-full'
    }
    
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
