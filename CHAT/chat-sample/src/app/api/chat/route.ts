import { StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000', // Required for OpenRouter
      'X-Title': 'Chat Sample' // Optional, but helps OpenRouter identify your app
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct', // You can change this to any model available on OpenRouter
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return new StreamingTextResponse(response.body!);
}
