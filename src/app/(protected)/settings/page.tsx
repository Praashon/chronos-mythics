'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/stores/useAppStore'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  ArrowLeft, 
  Key, 
  User, 
  Sparkles, 
  Save, 
  LogOut,
  Check,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

const modelOptions = [
  { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (Recommended)' },
  { value: 'mistralai/mistral-7b-instruct', label: 'Mistral 7B Instruct' },
  { value: 'google/gemma-2-9b-it', label: 'Gemma 2 9B' },
  { value: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku' },
]

export default function SettingsPage() {
  const router = useRouter()
  const { profile, updateProfile, fetchUserData } = useAppStore()
  const supabase = createClient()
  
  const [displayName, setDisplayName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [preferredModel, setPreferredModel] = useState('meta-llama/llama-3.3-70b-instruct')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setApiKey(profile.openrouter_api_key || '')
      setPreferredModel(profile.preferred_model || 'meta-llama/llama-3.3-70b-instruct')
    }
  }, [profile])
  
  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSaveSuccess(false)
    
    try {
      await updateProfile({
        display_name: displayName,
        openrouter_api_key: apiKey || null,
        preferred_model: preferredModel
      })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your Chronos Mythica experience</p>
        </motion.div>
        
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center">
              <User className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <p className="text-sm text-gray-500">Your identity in the cosmos</p>
            </div>
          </div>
          
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your mythic name"
          />
        </motion.section>
        
        {/* AI Configuration Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-[#fbbf24]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Enhancement</h2>
              <p className="text-sm text-gray-500">Power up with your own API key</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <Input
                label="OpenRouter API Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Get your free API key at{' '}
                <a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#8b5cf6] hover:underline"
                >
                  openrouter.ai
                </a>
                . Leave empty for basic templated generation.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Model
              </label>
              <select
                value={preferredModel}
                onChange={(e) => setPreferredModel(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f14]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all duration-300"
              >
                {modelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {!apiKey && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                <Sparkles className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-[#60a5fa] font-medium">No API key? No problem!</p>
                  <p className="text-gray-400 mt-1">
                    Chronos Mythica works without an API key using intelligent templated prose generation. 
                    Add a key anytime to unlock advanced AI-powered mythic narratives.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.section>
        
        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}
        
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400"
          >
            <Check className="w-5 h-5" />
            Settings saved successfully!
          </motion.div>
        )}
        
        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            variant="cosmic"
            onClick={handleSave}
            isLoading={isSaving}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="flex-1"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
