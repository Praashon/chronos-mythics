import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Memory, Emotion, ConstellationStar, FutureLetter, ManuscriptChapter, MemoryWithEmotions } from '@/types/database'
import type { User } from '@supabase/supabase-js'

interface AppState {
  // User state
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Data state
  memories: MemoryWithEmotions[]
  emotions: Emotion[]
  stars: ConstellationStar[]
  letters: FutureLetter[]
  chapters: ManuscriptChapter[]
  
  // UI state
  activeView: 'cosmos' | 'manuscript' | 'echoes'
  selectedStar: ConstellationStar | null
  selectedMemory: Memory | null
  isAddMemoryOpen: boolean
  isWriteLetterOpen: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setActiveView: (view: 'cosmos' | 'manuscript' | 'echoes') => void
  setSelectedStar: (star: ConstellationStar | null) => void
  setSelectedMemory: (memory: Memory | null) => void
  toggleAddMemory: () => void
  toggleWriteLetter: () => void
  
  // Data fetching
  fetchUserData: () => Promise<void>
  fetchMemories: () => Promise<void>
  fetchEmotions: () => Promise<void>
  fetchStars: () => Promise<void>
  fetchLetters: () => Promise<void>
  fetchChapters: () => Promise<void>
  
  // Data mutations
  addMemory: (memory: Omit<Memory, 'id' | 'created_at' | 'updated_at'>, emotionIds: string[]) => Promise<void>
  addLetter: (letter: Omit<FutureLetter, 'id' | 'created_at' | 'is_unlocked' | 'response'>) => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  
  // Initialization
  initialize: () => Promise<void>
  reset: () => void
}

const initialState = {
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  memories: [],
  emotions: [],
  stars: [],
  letters: [],
  chapters: [],
  activeView: 'cosmos' as const,
  selectedStar: null,
  selectedMemory: null,
  isAddMemoryOpen: false,
  isWriteLetterOpen: false,
}

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveView: (activeView) => set({ activeView }),
  setSelectedStar: (selectedStar) => set({ selectedStar }),
  setSelectedMemory: (selectedMemory) => set({ selectedMemory }),
  toggleAddMemory: () => set((state) => ({ isAddMemoryOpen: !state.isAddMemoryOpen })),
  toggleWriteLetter: () => set((state) => ({ isWriteLetterOpen: !state.isWriteLetterOpen })),
  
  fetchUserData: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      set({ user, isAuthenticated: true })
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (profile) {
        set({ profile })
      }
    } else {
      set({ user: null, isAuthenticated: false, profile: null })
    }
  },
  
  fetchMemories: async () => {
    const { user } = get()
    if (!user) return
    
    const supabase = createClient()
    const { data } = await supabase
      .from('memories')
      .select(`
        *,
        memory_emotions (
          *,
          emotions (*)
        )
      `)
      .eq('user_id', user.id)
      .order('memory_date', { ascending: false })
    
    if (data) {
      set({ memories: data as MemoryWithEmotions[] })
    }
  },
  
  fetchEmotions: async () => {
    const supabase = createClient()
    const { user } = get()
    
    const { data } = await supabase
      .from('emotions')
      .select('*')
      .or(`is_custom.eq.false,user_id.eq.${user?.id || '00000000-0000-0000-0000-000000000000'}`)
      .order('name')
    
    if (data) {
      set({ emotions: data })
    }
  },
  
  fetchStars: async () => {
    const { user } = get()
    if (!user) return
    
    const supabase = createClient()
    const { data } = await supabase
      .from('constellation_stars')
      .select('*')
      .eq('user_id', user.id)
    
    if (data) {
      set({ stars: data })
    }
  },
  
  fetchLetters: async () => {
    const { user } = get()
    if (!user) return
    
    const supabase = createClient()
    const { data } = await supabase
      .from('future_letters')
      .select('*')
      .eq('user_id', user.id)
      .order('unlock_date', { ascending: true })
    
    if (data) {
      set({ letters: data })
    }
  },
  
  fetchChapters: async () => {
    const { user } = get()
    if (!user) return
    
    const supabase = createClient()
    const { data } = await supabase
      .from('manuscript_chapters')
      .select('*')
      .eq('user_id', user.id)
      .order('chapter_number', { ascending: true })
    
    if (data) {
      set({ chapters: data })
    }
  },
  
  addMemory: async (memory, emotionIds) => {
    const { user, fetchMemories, fetchStars } = get()
    if (!user) return
    
    const supabase = createClient()
    
    // Insert memory
    const { data: newMemory, error } = await supabase
      .from('memories')
      .insert({ ...memory, user_id: user.id })
      .select()
      .single()
    
    if (error || !newMemory) return
    
    // Insert memory-emotion relations
    if (emotionIds.length > 0) {
      await supabase
        .from('memory_emotions')
        .insert(emotionIds.map(emotion_id => ({
          memory_id: newMemory.id,
          emotion_id
        })))
      
      // Create constellation stars for each emotion
      const starInserts = emotionIds.map(emotion_id => ({
        user_id: user.id,
        emotion_id,
        memory_id: newMemory.id,
        x_pos: (Math.random() - 0.5) * 20,
        y_pos: (Math.random() - 0.5) * 20,
        z_pos: (Math.random() - 0.5) * 10,
        brightness: 0.7 + Math.random() * 0.3
      }))
      
      await supabase
        .from('constellation_stars')
        .insert(starInserts)
    }
    
    // Refresh data
    await fetchMemories()
    await fetchStars()
  },
  
  addLetter: async (letter) => {
    const { user, fetchLetters } = get()
    if (!user) return
    
    const supabase = createClient()
    
    await supabase
      .from('future_letters')
      .insert({ ...letter, user_id: user.id })
    
    await fetchLetters()
  },
  
  updateProfile: async (updates) => {
    const { user, profile } = get()
    if (!user || !profile) return
    
    const supabase = createClient()
    
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (data) {
      set({ profile: data })
    }
  },
  
  initialize: async () => {
    set({ isLoading: true })
    
    const { fetchUserData, fetchEmotions, fetchMemories, fetchStars, fetchLetters, fetchChapters, user } = get()
    
    await fetchUserData()
    await fetchEmotions()
    
    if (get().user) {
      await Promise.all([
        fetchMemories(),
        fetchStars(),
        fetchLetters(),
        fetchChapters()
      ])
    }
    
    set({ isLoading: false })
  },
  
  reset: () => set(initialState)
}))
