'use client'
import { useState } from 'react'
import type { ChatMessage } from '@/types/chat'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    const newMessage: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, newMessage])
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMessage] })
      })
      
      const data = await response.json()
      if (data.choices?.[0]?.message) {
        setMessages(prev => [...prev, data.choices[0].message])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
      setInput('')
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with rolodexter</h1>
      
      <div className="mb-4 h-[400px] overflow-y-auto border p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="inline-block p-2 bg-gray-100 rounded">
              {msg.content}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center">Loading...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Send
        </button>
      </form>
    </main>
  )
}
