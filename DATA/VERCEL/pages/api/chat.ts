import type { NextApiRequest, NextApiResponse } from 'next';

type ChatResponse = {
  message: string;
}

type ErrorResponse = {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Your chat logic here
    const response = await processChatRequest(req.body);
    
    // Use setHeader instead of direct header manipulation
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function processChatRequest(body: any): Promise<string> {
  // Implement your chat processing logic here
  return "Chat message received";
}
