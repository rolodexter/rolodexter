'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map(m => (
          <div key={m.id} className={`whitespace-pre-wrap ${m.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
            <strong>{m.role === 'user' ? 'User: ' : 'AI: '}</strong>
            {m.content}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl">
          <input
            className="w-full p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </main>
  );
}
