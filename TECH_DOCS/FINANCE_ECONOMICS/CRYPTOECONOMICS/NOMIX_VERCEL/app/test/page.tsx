'use client'
import { useState } from 'react'
import type { ChatResponse } from '@/types/chat'

export default function TestPage() {
  const [response, setResponse] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setError('')
    setResponse('')
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'Hello, how are you?'
            }
          ]
        })
      })
      
      const data = await response.json() as ChatResponse
      console.log('API Response:', data)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const formattedResponse = {
        message: data.choices[0].message.content,
        model: data.model,
        tokens: data.usage.total_tokens
      }
      
      setResponse(JSON.stringify(formattedResponse, null, 2))
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">API Test Page</h1>
      <button 
        onClick={testApi}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:bg-gray-300"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {response && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {response}
        </pre>
      )}
    </div>
  )
}
