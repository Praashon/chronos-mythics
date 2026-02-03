'use client'

import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { format, isPast, isToday, formatDistanceToNow } from 'date-fns'
import { Mail, Clock, Unlock, Lock, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function EchoesTimeline() {
  const { letters, toggleWriteLetter } = useAppStore()
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true })
  
  // Separate letters into past, today, and future
  const categorizedLetters = useMemo(() => {
    const now = new Date()
    return letters.map(letter => ({
      ...letter,
      isUnlockable: isPast(new Date(letter.unlock_date)) || isToday(new Date(letter.unlock_date)),
      timeLabel: isPast(new Date(letter.unlock_date))
        ? `Unlocked ${formatDistanceToNow(new Date(letter.unlock_date))} ago`
        : `Unlocks in ${formatDistanceToNow(new Date(letter.unlock_date))}`
    }))
  }, [letters])
  
  return (
    <div ref={containerRef} className="min-h-[calc(100vh-5rem)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3b82f6]/20 mb-6">
            <Clock className="w-8 h-8 text-[#3b82f6]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Echoes Across Time
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Messages to your future self, waiting to be revealed when the moment arrives.
          </p>
        </motion.div>
        
        {categorizedLetters.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-8">
              <Mail className="w-12 h-12 text-[#3b82f6]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Send Your First Echo
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Write a letter to your future self. Set a date, and when it arrives, 
              receive a response from your mythic future persona.
            </p>
            <Button variant="cosmic" onClick={toggleWriteLetter}>
              <Mail className="w-4 h-4 mr-2" />
              Write to Future Self
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#3b82f6] via-[#8b5cf6] to-[#fbbf24] opacity-30" />
              
              {/* Letters */}
              <div className="space-y-8">
                {categorizedLetters.map((letter, index) => {
                  const isLeft = index % 2 === 0
                  const isUnlocked = letter.is_unlocked || letter.isUnlockable
                  
                  return (
                    <motion.div
                      key={letter.id}
                      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -20 : 20 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      className={`relative flex items-center ${
                        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      } gap-8`}
                    >
                      {/* Timeline node */}
                      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className={`w-4 h-4 rounded-full ${
                            isUnlocked 
                              ? 'bg-[#fbbf24] shadow-[0_0_20px_rgba(251,191,36,0.5)]' 
                              : 'bg-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                          }`}
                        />
                      </div>
                      
                      {/* Card */}
                      <div className={`flex-1 ml-16 md:ml-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`glass rounded-2xl p-6 cursor-pointer transition-all ${
                            isUnlocked 
                              ? 'border border-[#fbbf24]/20' 
                              : 'border border-white/5 opacity-70'
                          }`}
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {isUnlocked ? (
                                <Unlock className="w-5 h-5 text-[#fbbf24]" />
                              ) : (
                                <Lock className="w-5 h-5 text-[#3b82f6]" />
                              )}
                              <span className={`text-sm font-medium ${
                                isUnlocked ? 'text-[#fbbf24]' : 'text-[#3b82f6]'
                              }`}>
                                {letter.timeLabel}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {format(new Date(letter.unlock_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          {/* Content */}
                          {isUnlocked ? (
                            <>
                              <p className="text-gray-300 mb-4 line-clamp-3">
                                {letter.content}
                              </p>
                              
                              {letter.response && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                  <p className="text-sm text-[#8b5cf6] mb-2 font-medium flex items-center gap-2">
                                    <span className="text-lg">✨</span>
                                    From Your Future Self
                                  </p>
                                  <p className="text-gray-400 italic line-clamp-2">
                                    {letter.response}
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-3 text-gray-500">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">
                                This letter will be revealed on {format(new Date(letter.unlock_date), 'MMMM d, yyyy')}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                      
                      {/* Spacer for alternating layout */}
                      <div className="hidden md:block flex-1" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
            
            {/* Add new letter button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <Button variant="ghost" onClick={toggleWriteLetter}>
                <Plus className="w-4 h-4 mr-2" />
                Write Another Letter
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
