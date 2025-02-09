export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  refusal?: null;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  id: string;
  provider: string;
  model: string;
  object: string;
  created: number;
  choices: {
    logprobs: null;
    finish_reason: string;
    native_finish_reason: string;
    index: number;
    message: ChatMessage;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
