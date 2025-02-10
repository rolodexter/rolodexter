import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    console.error('API configuration missing');
    return NextResponse.json(
      { error: 'OpenRouter API key is missing' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    // Ensure proper request format for OpenRouter
    const openRouterBody = {
      model: "mistralai/mistral-7b-instruct", // Default model, can be changed
      messages: body.messages || [],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    console.log('Request details:', {
      headers: {
        auth: apiKey.substring(0, 20) + '...',
        referer: 'http://localhost:3000'
      }
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,  // Remove Bearer prefix
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Chat Sample',
        'OpenAI-Organization': 'OpenRouter',
        'Origin': 'http://localhost:3000'
      },
      body: JSON.stringify(openRouterBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Log raw response details
    console.log('Raw response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API Error:', {
        status: response.status,
        data
      });
      return NextResponse.json(
        { error: data.error?.message || 'API request failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Request failed:', {
      error: error.message,
      details: error.cause?.message || 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to connect to OpenRouter API. Please try again.' },
      { status: 503 }
    );
  }
}
