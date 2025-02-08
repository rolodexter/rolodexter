import { NextResponse } from 'next/server'
import type { ChatRequest, ChatResponse } from '@/types/chat'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as ChatRequest
    
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

    const data = await response.json() as ChatResponse
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to communicate with bot' },
      { status: 500 }
    )
  }
}
