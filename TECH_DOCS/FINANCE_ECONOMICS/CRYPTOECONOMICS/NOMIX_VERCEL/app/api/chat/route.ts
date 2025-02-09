import { NextResponse } from 'next/server'
import type { ChatRequest, ChatResponse } from '@/types/chat'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as ChatRequest
    
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    console.log('Sending request to OpenRouter with messages:', messages)
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://nomix-three.vercel.app',
        'X-Title': 'rolodexter'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-2',
        messages: messages
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json() as ChatResponse
    console.log('Received response from OpenRouter:', data)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
