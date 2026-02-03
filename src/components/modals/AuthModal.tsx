'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Mail, Lock, User, Sparkles } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type AuthMode = 'login' | 'signup' | 'magic'

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  
  const supabase = createClient()
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      })
      
      if (error) throw error
      
      // Auto-login after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (loginError) throw loginError
      
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
      
      setMagicLinkSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
      setIsLoading(false)
    }
  }
  
  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError(null)
    setMagicLinkSent(false)
  }
  
  const switchMode = (newMode: AuthMode) => {
    resetForm()
    setMode(newMode)
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white">
          {mode === 'login' && 'Welcome Back'}
          {mode === 'signup' && 'Begin Your Myth'}
          {mode === 'magic' && 'Magic Link'}
        </h2>
        <p className="text-gray-400 mt-2">
          {mode === 'login' && 'Continue your mythic journey'}
          {mode === 'signup' && 'Create your eternal narrative'}
          {mode === 'magic' && 'Sign in without a password'}
        </p>
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
      
      {mode === 'magic' && magicLinkSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10b981]/20 mb-4">
            <Mail className="w-8 h-8 text-[#10b981]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Check Your Email</h3>
          <p className="text-gray-400">
            We&apos;ve sent a magic link to <span className="text-[#8b5cf6]">{email}</span>
          </p>
          <Button
            variant="ghost"
            className="mt-6"
            onClick={() => switchMode('login')}
          >
            Back to Login
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={
          mode === 'login' ? handleLogin :
          mode === 'signup' ? handleSignup :
          handleMagicLink
        }>
          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
                required
              />
            </div>
            
            {mode !== 'magic' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12"
                  required
                  minLength={6}
                />
              </div>
            )}
            
            <Button
              type="submit"
              variant="cosmic"
              className="w-full"
              isLoading={isLoading}
            >
              {mode === 'login' && 'Enter the Cosmos'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'magic' && 'Send Magic Link'}
            </Button>
          </div>
        </form>
      )}
      
      {!magicLinkSent && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0f0f14] text-gray-500">or</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full mb-4"
            onClick={handleGoogleLogin}
            isLoading={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          
          {mode !== 'magic' && (
            <button
              type="button"
              onClick={() => switchMode('magic')}
              className="w-full text-center text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
            >
              Sign in with Magic Link
            </button>
          )}
          
          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === 'login' ? (
              <>
                New to the cosmos?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#fbbf24] hover:text-[#fcd34d] transition-colors font-medium"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#fbbf24] hover:text-[#fcd34d] transition-colors font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </>
      )}
    </Modal>
  )
}
