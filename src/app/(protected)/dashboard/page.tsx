'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { createClient } from '@/lib/supabase/client'
import CosmicOverview from '@/components/dashboard/CosmicOverview'
import MythicManuscript from '@/components/dashboard/MythicManuscript'
import EchoesTimeline from '@/components/dashboard/EchoesTimeline'
import DashboardNav from '@/components/dashboard/DashboardNav'
import AddMemoryModal from '@/components/modals/AddMemoryModal'
import WriteFutureLetterModal from '@/components/modals/WriteFutureLetterModal'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { 
    activeView, 
    isLoading, 
    initialize, 
    isAddMemoryOpen,
    isWriteLetterOpen,
    toggleAddMemory,
    toggleWriteLetter
  } = useAppStore()
  
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    const init = async () => {
      await initialize()
      setIsInitialized(true)
    }
    init()
  }, [initialize])
  
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-10 h-10 text-[#8b5cf6] animate-spin" />
          <p className="text-gray-400">Loading your cosmos...</p>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      {/* Dashboard Navigation */}
      <DashboardNav />
      
      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {activeView === 'cosmos' && (
            <motion.div
              key="cosmos"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <CosmicOverview />
            </motion.div>
          )}
          
          {activeView === 'manuscript' && (
            <motion.div
              key="manuscript"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <MythicManuscript />
            </motion.div>
          )}
          
          {activeView === 'echoes' && (
            <motion.div
              key="echoes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <EchoesTimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Modals */}
      <AddMemoryModal 
        isOpen={isAddMemoryOpen} 
        onClose={toggleAddMemory} 
      />
      <WriteFutureLetterModal 
        isOpen={isWriteLetterOpen} 
        onClose={toggleWriteLetter} 
      />
    </div>
  )
}
