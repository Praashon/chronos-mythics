'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/stores/useAppStore'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { 
  Sparkles, 
  Settings, 
  Plus, 
  Mail, 
  Star, 
  BookOpen, 
  Clock,
  LogOut
} from 'lucide-react'

const views = [
  { id: 'cosmos', label: 'Cosmos', icon: Star },
  { id: 'manuscript', label: 'Manuscript', icon: BookOpen },
  { id: 'echoes', label: 'Echoes', icon: Clock },
] as const

export default function DashboardNav() {
  const router = useRouter()
  const { 
    activeView, 
    setActiveView, 
    toggleAddMemory, 
    toggleWriteLetter,
    profile 
  } = useAppStore()
  const supabase = createClient()
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
              Chronos Mythica
            </span>
          </Link>
          
          {/* View Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeView === view.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {activeView === view.id && (
                  <motion.div
                    layoutId="activeView"
                    className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/20 to-[#3b82f6]/20 rounded-full border border-white/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <view.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{view.label}</span>
              </button>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAddMemory}
                className="!px-3"
              >
                <Plus className="w-4 h-4 mr-1" />
                Memory
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleWriteLetter}
                className="!px-3"
              >
                <Mail className="w-4 h-4 mr-1" />
                Letter
              </Button>
            </div>
            
            {/* Settings */}
            <Link
              href="/settings"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Settings className="w-5 h-5" />
            </Link>
            
            {/* Profile */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              title="Sign out"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                {profile?.display_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile View Switcher */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeView === view.id
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
