export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterCompletionRequest {
  model: string;
  messages: OpenRouterMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface OpenRouterCompletionResponse {
  id: string;
  choices: {
    message: OpenRouterMessage;
    finish_reason: string | null;
  }[];
  model: string;
}
