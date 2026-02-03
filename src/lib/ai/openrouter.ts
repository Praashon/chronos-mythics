// OpenRouter API integration for AI-powered mythic prose generation

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

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

const MYTHIC_SYSTEM_PROMPT = `You are a mythic narrator who transforms ordinary life experiences into epic, poetic prose. 
Your writing style is:
- Second person ("you") perspective
- Poetic and symbolic, using metaphors from mythology and the cosmos
- Deeply meaningful without being pretentious
- Concise but evocative (2-4 sentences)
- References emotions as cosmic forces or mythic elements

Transform the given memory/event into a mythic narrative passage. Do not use quotation marks around your response.`

const FUTURE_SELF_SYSTEM_PROMPT = `You are the user's future mythic self - a wiser, more evolved version of them looking back through time.
Your voice is:
- Warm, understanding, and gently encouraging
- Speaks with the wisdom of hindsight
- References the user's hopes and dreams with knowing compassion
- Uses poetic but accessible language
- Concise (3-5 sentences)
- Speaks as if responding to a letter from the past

Respond to their letter as if you are their future self who has already lived through what they're about to experience.
Do not use quotation marks. Speak directly to them.`

export async function generateMythicProse(
  apiKey: string,
  model: string,
  data: MythicProseData
): Promise<string> {
  const userPrompt = `Memory Title: ${data.title}
Description: ${data.description}
Emotions: ${data.emotions.join(', ')}
Date: ${data.date}

Transform this memory into a short mythic narrative passage.`

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://chronos-mythica.app',
      'X-Title': 'Chronos Mythica'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: MYTHIC_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.8
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${error}`)
  }
  
  const result = await response.json()
  return result.choices[0]?.message?.content || ''
}

export async function generateFutureResponse(
  apiKey: string,
  model: string,
  data: FutureResponseData
): Promise<string> {
  const userPrompt = `Letter from past self:
"${data.letterContent}"

This letter was written to be read on ${data.unlockDate}.

Respond as their future mythic self, offering wisdom and perspective.`

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://chronos-mythica.app',
      'X-Title': 'Chronos Mythica'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: FUTURE_SELF_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.9
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${error}`)
  }
  
  const result = await response.json()
  return result.choices[0]?.message?.content || ''
}
