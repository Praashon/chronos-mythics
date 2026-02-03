'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { format } from 'date-fns'
import { BookOpen, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function MythicManuscript() {
  const { chapters, memories, toggleAddMemory } = useAppStore()
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true })
  
  // Generate pages from memories if no chapters exist
  const pages = chapters.length > 0 
    ? chapters.map(c => ({
        title: c.title || `Chapter ${c.chapter_number}`,
        content: c.content || '',
        date: c.created_at
      }))
    : memories.slice(0, 10).map((memory, index) => ({
        title: memory.title,
        content: memory.mythic_prose || memory.description || 'A moment awaiting its mythic transformation...',
        date: memory.memory_date
      }))
  
  const handleFlip = (direction: 'next' | 'prev') => {
    if (isFlipping) return
    
    setIsFlipping(true)
    
    if (direction === 'next' && currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1)
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
    
    setTimeout(() => setIsFlipping(false), 800)
  }
  
  const currentPageData = pages[currentPage]
  
  return (
    <div ref={containerRef} className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl"
      >
        {pages.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 rounded-2xl bg-[#fbbf24]/10 flex items-center justify-center mx-auto mb-8"
            >
              <BookOpen className="w-12 h-12 text-[#fbbf24]" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Manuscript Awaits
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Every memory you add becomes a verse in your epic tale. 
              Begin writing your legend.
            </p>
            <Button variant="cosmic" onClick={toggleAddMemory}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Chapter
            </Button>
          </div>
        ) : (
          <>
            {/* Book container */}
            <div className="relative aspect-[3/2] glass rounded-3xl overflow-hidden">
              {/* Decorative spine */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 z-10" />
              
              {/* Page content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, rotateY: -10 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 10 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex"
                >
                  {/* Left page - illustration/decoration */}
                  <div className="w-1/2 p-8 md:p-12 flex flex-col items-center justify-center border-r border-white/5">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="text-8xl md:text-9xl font-bold gradient-text-cosmic opacity-20 mb-4">
                        {String(currentPage + 1).padStart(2, '0')}
                      </div>
                      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mx-auto mb-4" />
                      <p className="text-sm text-gray-500 uppercase tracking-widest">
                        {currentPageData.date && format(new Date(currentPageData.date), 'MMMM yyyy')}
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Right page - text content */}
                  <div className="w-1/2 p-8 md:p-12 flex flex-col">
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-2xl md:text-3xl font-bold text-white mb-6"
                    >
                      {currentPageData.title}
                    </motion.h2>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="flex-1 overflow-y-auto"
                    >
                      <p className="text-gray-300 leading-relaxed text-lg font-light italic">
                        {currentPageData.content}
                      </p>
                    </motion.div>
                    
                    {/* Page number */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-500">
                        Page {currentPage + 1} of {pages.length}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-[#8b5cf6]" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => handleFlip('prev')}
                disabled={currentPage === 0 || isFlipping}
                className="p-3 rounded-full glass hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>
              
              {/* Page dots */}
              <div className="flex items-center gap-2">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !isFlipping && setCurrentPage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentPage 
                        ? 'w-6 bg-[#fbbf24]' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => handleFlip('next')}
                disabled={currentPage === pages.length - 1 || isFlipping}
                className="p-3 rounded-full glass hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
