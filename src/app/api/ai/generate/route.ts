import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateMythicProse, generateFutureResponse } from '@/lib/ai/openrouter'
import { fallbackMythicProse, fallbackFutureResponse } from '@/lib/ai/fallback'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's profile with API key
    const { data: profile } = await supabase
      .from('profiles')
      .select('openrouter_api_key, preferred_model')
      .eq('user_id', user.id)
      .single()
    
    const body = await request.json()
    const { type, data } = body
    
    let result: { prose?: string; response?: string }
    
    // Check if user has API key
    const hasApiKey = !!profile?.openrouter_api_key
    
    if (type === 'mythic_prose') {
      if (hasApiKey) {
        try {
          const prose = await generateMythicProse(
            profile!.openrouter_api_key!,
            profile?.preferred_model || 'meta-llama/llama-3.3-70b-instruct',
            data
          )
          result = { prose }
        } catch (aiError) {
          // Fall back to templated generation on API error
          console.error('AI generation failed, using fallback:', aiError)
          const prose = fallbackMythicProse(data)
          result = { prose }
        }
      } else {
        // Use fallback templated generation
        const prose = fallbackMythicProse(data)
        result = { prose }
      }
    } else if (type === 'future_response') {
      if (hasApiKey) {
        try {
          const response = await generateFutureResponse(
            profile!.openrouter_api_key!,
            profile?.preferred_model || 'meta-llama/llama-3.3-70b-instruct',
            data
          )
          result = { response }
        } catch (aiError) {
          console.error('AI generation failed, using fallback:', aiError)
          const response = fallbackFutureResponse(data)
          result = { response }
        }
      } else {
        const response = fallbackFutureResponse(data)
        result = { response }
      }
    } else {
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
