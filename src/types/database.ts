export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          openrouter_api_key: string | null
          preferred_model: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          openrouter_api_key?: string | null
          preferred_model?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          openrouter_api_key?: string | null
          preferred_model?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      emotions: {
        Row: {
          id: string
          name: string
          color: string
          symbol: string | null
          is_custom: boolean
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          symbol?: string | null
          is_custom?: boolean
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          symbol?: string | null
          is_custom?: boolean
          user_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          memory_date: string
          mythic_prose: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          memory_date: string
          mythic_prose?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          memory_date?: string
          mythic_prose?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      memory_emotions: {
        Row: {
          id: string
          memory_id: string
          emotion_id: string
          created_at: string
        }
        Insert: {
          id?: string
          memory_id: string
          emotion_id: string
          created_at?: string
        }
        Update: {
          id?: string
          memory_id?: string
          emotion_id?: string
          created_at?: string
        }
        Relationships: []
      }
      constellation_stars: {
        Row: {
          id: string
          user_id: string
          emotion_id: string | null
          memory_id: string | null
          x_pos: number
          y_pos: number
          z_pos: number
          brightness: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          emotion_id?: string | null
          memory_id?: string | null
          x_pos?: number
          y_pos?: number
          z_pos?: number
          brightness?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          emotion_id?: string | null
          memory_id?: string | null
          x_pos?: number
          y_pos?: number
          z_pos?: number
          brightness?: number
          created_at?: string
        }
        Relationships: []
      }
      constellation_connections: {
        Row: {
          id: string
          user_id: string
          star_id_1: string
          star_id_2: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          star_id_1: string
          star_id_2: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          star_id_1?: string
          star_id_2?: string
          created_at?: string
        }
        Relationships: []
      }
      future_letters: {
        Row: {
          id: string
          user_id: string
          content: string
          unlock_date: string
          voice_note_url: string | null
          response: string | null
          is_unlocked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          unlock_date: string
          voice_note_url?: string | null
          response?: string | null
          is_unlocked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          unlock_date?: string
          voice_note_url?: string | null
          response?: string | null
          is_unlocked?: boolean
          created_at?: string
        }
        Relationships: []
      }
      manuscript_chapters: {
        Row: {
          id: string
          user_id: string
          chapter_number: number
          title: string | null
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chapter_number: number
          title?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chapter_number?: number
          title?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Utility types for easier access
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Emotion = Database['public']['Tables']['emotions']['Row']
export type Memory = Database['public']['Tables']['memories']['Row']
export type MemoryEmotion = Database['public']['Tables']['memory_emotions']['Row']
export type ConstellationStar = Database['public']['Tables']['constellation_stars']['Row']
export type ConstellationConnection = Database['public']['Tables']['constellation_connections']['Row']
export type FutureLetter = Database['public']['Tables']['future_letters']['Row']
export type ManuscriptChapter = Database['public']['Tables']['manuscript_chapters']['Row']

// Extended types with relations
export type MemoryWithEmotions = Memory & {
  memory_emotions: (MemoryEmotion & {
    emotions: Emotion
  })[]
}

export type StarWithMemory = ConstellationStar & {
  memories?: Memory
  emotions?: Emotion
}
