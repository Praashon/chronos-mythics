'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input, { Textarea } from '@/components/ui/Input'
import { Calendar, Sparkles, Tag, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface AddMemoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddMemoryModal({ isOpen, onClose }: AddMemoryModalProps) {
  const { emotions, addMemory, profile } = useAppStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [memoryDate, setMemoryDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedProse, setGeneratedProse] = useState('')
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('')
      setDescription('')
      setMemoryDate(format(new Date(), 'yyyy-MM-dd'))
      setSelectedEmotions([])
      setGeneratedProse('')
    }
  }, [isOpen])
  
  const toggleEmotion = (id: string) => {
    setSelectedEmotions(prev => 
      prev.includes(id) 
        ? prev.filter(e => e !== id)
        : [...prev, id]
    )
  }
  
  const handleGenerateProse = async () => {
    if (!title || !description) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mythic_prose',
          data: {
            title,
            description,
            emotions: selectedEmotions.map(id => 
              emotions.find(e => e.id === id)?.name
            ).filter(Boolean),
            date: memoryDate
          }
        })
      })
      
      const result = await response.json()
      
      if (result.prose) {
        setGeneratedProse(result.prose)
      }
    } catch (error) {
      console.error('Failed to generate prose:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    
    setIsLoading(true)
    
    try {
      await addMemory({
        title,
        description,
        memory_date: memoryDate,
        mythic_prose: generatedProse || null,
        user_id: '' // Will be set by the store
      }, selectedEmotions)
      
      onClose()
    } catch (error) {
      console.error('Failed to add memory:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Memory" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Title"
          placeholder="A moment worth remembering..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            When did this happen?
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0f0f14]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all duration-300"
              required
            />
          </div>
        </div>
        
        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Describe what happened, how you felt, what it meant to you..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        
        {/* Emotions */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
            <Tag className="w-4 h-4" />
            Emotions
          </label>
          <div className="flex flex-wrap gap-2">
            {emotions.filter(e => !e.is_custom).map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion.id)
              return (
                <motion.button
                  key={emotion.id}
                  type="button"
                  onClick={() => toggleEmotion(emotion.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? 'text-white shadow-lg'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  style={isSelected ? { 
                    backgroundColor: emotion.color + '30',
                    borderColor: emotion.color,
                    border: `1px solid ${emotion.color}50`
                  } : undefined}
                >
                  <span className="mr-2">{emotion.symbol}</span>
                  {emotion.name}
                </motion.button>
              )
            })}
          </div>
        </div>
        
        {/* AI Generation */}
        {description && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-medium text-[#8b5cf6]">
                <Sparkles className="w-4 h-4" />
                Mythic Translation
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateProse}
                isLoading={isGenerating}
                disabled={!title || !description}
              >
                {generatedProse ? 'Regenerate' : 'Generate'}
              </Button>
            </div>
            
            {generatedProse ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20"
              >
                <p className="text-gray-300 italic leading-relaxed">
                  {generatedProse}
                </p>
              </motion.div>
            ) : (
              <p className="text-sm text-gray-500">
                {profile?.openrouter_api_key 
                  ? 'Click "Generate" to create a mythic translation of your memory using AI.'
                  : 'Add an OpenRouter API key in settings for AI-enhanced mythic prose, or use basic generation.'}
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
            disabled={!title}
            className="flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Memory
          </Button>
        </div>
      </form>
    </Modal>
  )
}
