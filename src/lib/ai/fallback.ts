// Fallback templated generation when no API key is available

interface MythicProseData {
  title: string
  description: string
  emotions: string[]
  date: string
}

interface FutureResponseData {
  letterContent: string
  unlockDate: string
}

// Word replacements for mythic language
const mythicReplacements: Record<string, string[]> = {
  'walked': ['journeyed', 'traversed', 'wandered'],
  'saw': ['beheld', 'witnessed', 'perceived'],
  'felt': ['was stirred by', 'sensed deeply', 'was moved by'],
  'happy': ['illuminated with joy', 'blessed by fortune', 'touched by light'],
  'sad': ['touched by shadow', 'visited by melancholy', 'embraced by twilight'],
  'angry': ['consumed by fire', 'stirred by tempest', 'blazing'],
  'scared': ['gripped by uncertainty', 'facing the unknown', 'tested by shadow'],
  'love': ['sacred bond', 'eternal flame', 'cosmic connection'],
  'friend': ['kindred spirit', 'fellow traveler', 'soul companion'],
  'family': ['ancestral circle', 'sacred bond', 'eternal lineage'],
  'work': ['calling', 'sacred duty', 'destined path'],
  'home': ['sanctuary', 'sacred space', 'fortress of peace'],
  'day': ['cycle of light', 'sun\'s arc', 'golden hours'],
  'night': ['velvet darkness', 'star-crowned hours', 'lunar reign'],
}

// Opening phrases for mythic prose
const mythicOpenings = [
  'In the tapestry of your existence,',
  'When the stars aligned,',
  'As fate\'s thread wove forward,',
  'At the crossroads of destiny,',
  'In the sacred theater of life,',
  'Upon the stage of your journey,',
  'As the cosmos witnessed,',
  'In that eternal moment,',
]

// Emotion-specific patterns
const emotionPhrases: Record<string, string[]> = {
  'Joy': ['the light within you blazed', 'your spirit soared like a phoenix', 'golden radiance filled your soul'],
  'Sorrow': ['twilight touched your spirit', 'you walked through shadow\'s valley', 'tears became rivers of wisdom'],
  'Courage': ['you stood as an unwavering flame', 'your heart beat with warrior\'s resolve', 'you faced the tempest unbowed'],
  'Fear': ['shadows tested your resolve', 'you confronted the unknown depths', 'darkness whispered, yet you listened'],
  'Love': ['your heart expanded like the cosmos', 'sacred bonds were forged', 'two souls recognized their eternal dance'],
  'Anger': ['fire coursed through your veins', 'thunder echoed in your spirit', 'righteous flame burned within'],
  'Peace': ['serenity descended like stardust', 'your soul found its harbor', 'stillness embraced your being'],
  'Wonder': ['the universe revealed its mysteries', 'awe painted your perception', 'magic touched the mundane'],
  'Hope': ['dawn broke upon your horizon', 'tomorrow\'s promise illuminated today', 'light pierced the darkness'],
  'Loneliness': ['you walked solitary paths', 'silence became your companion', 'in isolation, you found your depths'],
  'Gratitude': ['blessings rained upon your awareness', 'abundance revealed itself', 'your heart overflowed with thanksgiving'],
  'Determination': ['iron resolve forged your will', 'you set your course by the stars', 'nothing could deter your path'],
}

export function fallbackMythicProse(data: MythicProseData): string {
  const opening = mythicOpenings[Math.floor(Math.random() * mythicOpenings.length)]
  
  // Get emotion phrase
  let emotionPart = ''
  if (data.emotions.length > 0) {
    const primaryEmotion = data.emotions[0]
    const phrases = emotionPhrases[primaryEmotion] || [`${primaryEmotion.toLowerCase()} stirred within you`]
    emotionPart = phrases[Math.floor(Math.random() * phrases.length)]
  } else {
    emotionPart = 'your spirit was moved by forces unseen'
  }
  
  // Transform description
  let transformedDesc = data.description || data.title
  Object.entries(mythicReplacements).forEach(([word, replacements]) => {
    const replacement = replacements[Math.floor(Math.random() * replacements.length)]
    transformedDesc = transformedDesc.replace(new RegExp(`\\b${word}\\b`, 'gi'), replacement)
  })
  
  // Build the prose
  return `${opening} ${emotionPart}. ${transformedDesc ? `You ${transformedDesc.charAt(0).toLowerCase() + transformedDesc.slice(1)}.` : ''} This moment was inscribed in the eternal ledger of your becoming.`
}

export function fallbackFutureResponse(data: FutureResponseData): string {
  const openings = [
    'Beloved traveler of time,',
    'Dear past self,',
    'To the one I once was,',
    'My cherished former self,',
    'Through the mists of memory, I see you,',
  ]
  
  const middles = [
    'The path you walk leads to places more wondrous than you can imagine.',
    'What seems uncertain now will reveal its purpose in time.',
    'The seeds you plant today bloom in gardens you cannot yet see.',
    'Your struggles forge the strength that will carry you through.',
    'The love you seek is already finding its way to you.',
  ]
  
  const closings = [
    'Trust the journey, for I am proof that you will find your way.',
    'Keep your heart open; the best is yet to unfold.',
    'Walk forward with courage; I await you on the other side.',
    'The person you are becoming is worthy of every dream you hold.',
    'All is well. All will be well. The cosmos holds you gently.',
  ]
  
  const opening = openings[Math.floor(Math.random() * openings.length)]
  const middle = middles[Math.floor(Math.random() * middles.length)]
  const closing = closings[Math.floor(Math.random() * closings.length)]
  
  return `${opening}\n\n${middle}\n\n${closing}`
}
