'use client'

import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/perspectives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: query,
          n: 3,
          models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.5-pro']
        })
      })
      
      const data = await response.json()
      setResponses(data.perspectives || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 <span className="text-primary">Poly</span><span className="text-secondary">dev</span>
          </h1>
          <p className="text-xl text-gray-600">
            Get multiple AI perspectives instantly
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by OpenRouter • Built with Next.js & FastAPI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Getting Perspectives...' : 'Ask'}
            </button>
          </div>
        </form>

        {responses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Multiple Perspectives</h2>
            {responses.map((response, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {response.model || `Perspective ${index + 1}`}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {response.tokens_used} tokens • ${response.cost?.toFixed(4)}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {response.content || response.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}