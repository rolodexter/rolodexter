import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const apiUrl = 'https://openrouter.ai/api/v1';  // Updated URL

  if (!apiKey || !apiUrl) {
    console.error('API configuration missing');
    return NextResponse.json(
      { error: 'OpenRouter API configuration is missing' },
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

    console.log('API Key:', apiKey?.substring(0, 10) + '...');
    console.log('API URL:', apiUrl);
    console.log('Sending request to OpenRouter:', openRouterBody);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : 'https://yourdomain.com',
        'X-Title': 'Chat Sample'
      },
      body: JSON.stringify(openRouterBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    // Add response structure logging
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('OpenRouter response:', data);

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'API request failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      cause: error.cause,
      code: error.cause?.code,
      syscall: error.cause?.syscall
    });

    if (error.cause?.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Unable to connect to API server. Please check your internet connection.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
