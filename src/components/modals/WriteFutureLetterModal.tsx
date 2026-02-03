'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { Calendar, Mail, Clock, Sparkles } from 'lucide-react'
import { format, addMonths, addYears } from 'date-fns'

interface WriteFutureLetterModalProps {
  isOpen: boolean
  onClose: () => void
}

const quickDates = [
  { label: '1 Month', getValue: () => addMonths(new Date(), 1) },
  { label: '3 Months', getValue: () => addMonths(new Date(), 3) },
  { label: '6 Months', getValue: () => addMonths(new Date(), 6) },
  { label: '1 Year', getValue: () => addYears(new Date(), 1) },
  { label: '5 Years', getValue: () => addYears(new Date(), 5) },
]

export default function WriteFutureLetterModal({ isOpen, onClose }: WriteFutureLetterModalProps) {
  const { addLetter, profile } = useAppStore()
  
  const [content, setContent] = useState('')
  const [unlockDate, setUnlockDate] = useState(format(addMonths(new Date(), 1), 'yyyy-MM-dd'))
  const [isLoading, setIsLoading] = useState(false)
  const [previewResponse, setPreviewResponse] = useState('')
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent('')
      setUnlockDate(format(addMonths(new Date(), 1), 'yyyy-MM-dd'))
      setPreviewResponse('')
    }
  }, [isOpen])
  
  const handleQuickDate = (getValue: () => Date) => {
    setUnlockDate(format(getValue(), 'yyyy-MM-dd'))
  }
  
  const handlePreviewResponse = async () => {
    if (!content) return
    
    setIsGeneratingPreview(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'future_response',
          data: {
            letterContent: content,
            unlockDate
          }
        })
      })
      
      const result = await response.json()
      
      if (result.response) {
        setPreviewResponse(result.response)
      }
    } catch (error) {
      console.error('Failed to generate preview:', error)
    } finally {
      setIsGeneratingPreview(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content || !unlockDate) return
    
    setIsLoading(true)
    
    try {
      await addLetter({
        content,
        unlock_date: unlockDate,
        voice_note_url: null,
        user_id: '' // Will be set by the store
      })
      
      onClose()
    } catch (error) {
      console.error('Failed to send letter:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Write to Future Self" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Intro */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
          <Clock className="w-6 h-6 text-[#3b82f6] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#60a5fa] font-medium mb-1">A Message Across Time</p>
            <p className="text-sm text-gray-400">
              Write to the person you will become. When the date arrives, your letter will unlock 
              with a response from your future mythic self.
            </p>
          </div>
        </div>
        
        {/* Unlock Date */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Calendar className="w-4 h-4" />
            When should this letter unlock?
          </label>
          
          {/* Quick date buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickDates.map((qd) => (
              <button
                key={qd.label}
                type="button"
                onClick={() => handleQuickDate(qd.getValue)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  unlockDate === format(qd.getValue(), 'yyyy-MM-dd')
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {qd.label}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full pl-12 pr-4 py-3 bg-[#0f0f14]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all duration-300"
              required
            />
          </div>
        </div>
        
        {/* Letter Content */}
        <Textarea
          label="Your Letter"
          placeholder="Dear future me...

What do you hope to have accomplished? What are your dreams? What do you want to remember about this moment?

Write from the heart. Your future self is listening."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          required
        />
        
        {/* Preview Response */}
        {content && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-medium text-[#fbbf24]">
                <Sparkles className="w-4 h-4" />
                Preview Response
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePreviewResponse}
                isLoading={isGeneratingPreview}
                disabled={!content}
              >
                {previewResponse ? 'Regenerate' : 'Preview'}
              </Button>
            </div>
            
            {previewResponse ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20"
              >
                <p className="text-sm text-[#fbbf24] mb-2">From Your Future Self:</p>
                <p className="text-gray-300 italic leading-relaxed">
                  {previewResponse}
                </p>
              </motion.div>
            ) : (
              <p className="text-sm text-gray-500">
                Preview how your future mythic self might respond. The actual response 
                will be generated when the letter unlocks.
              </p>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="cosmic"
            isLoading={isLoading}
            disabled={!content || !unlockDate}
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Seal Letter
          </Button>
        </div>
      </form>
    </Modal>
  )
}
