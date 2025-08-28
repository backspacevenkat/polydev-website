'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  timestamp: Date
}

interface ModelConfig {
  id: string
  name: string
  provider: string
  enabled: boolean
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4'])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const models: ModelConfig[] = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', enabled: true },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', enabled: true },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', enabled: true },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', enabled: true },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', enabled: true },
    { id: 'llama-2-70b', name: 'Llama 2 70B', provider: 'Meta', enabled: true }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate API calls to multiple models
    try {
      const responses = await Promise.all(
        selectedModels.map(async (modelId) => {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
          
          const model = models.find(m => m.id === modelId)
          
          // Simulate different responses based on model
          let simulatedResponse = ''
          switch (modelId) {
            case 'gpt-4':
              simulatedResponse = `As GPT-4, I can provide a comprehensive analysis of your question: "${input}". This is a detailed response that considers multiple perspectives and provides actionable insights.`
              break
            case 'claude-3-sonnet':
              simulatedResponse = `From Claude 3 Sonnet's perspective: I'll approach "${input}" by breaking it down systematically and providing a thoughtful, nuanced response with clear reasoning.`
              break
            case 'gemini-pro':
              simulatedResponse = `Gemini Pro here: Let me analyze "${input}" from multiple angles and provide you with a structured response that covers the key points effectively.`
              break
            default:
              simulatedResponse = `${model?.name} response to: "${input}". This is a simulated response from the ${model?.provider} model.`
          }

          return {
            id: `${Date.now()}-${modelId}`,
            role: 'assistant' as const,
            content: simulatedResponse,
            model: model?.name,
            timestamp: new Date()
          }
        })
      )

      setMessages(prev => [...prev, ...responses])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Multi-LLM Chat
        </h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Active Models ({selectedModels.length})
          </h3>
          <div className="space-y-2">
            {models.map((model) => (
              <label key={model.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={() => toggleModel(model.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {model.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {model.provider}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={clearChat}
            className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Clear Chat
          </button>
          <button className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Export Chat
          </button>
          <button className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Multi-Model Comparison Chat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chat with multiple AI models simultaneously and compare their responses
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
              <h3 className="text-lg font-medium mb-2">Welcome to Multi-LLM Chat</h3>
              <p>Select models from the sidebar and start chatting to compare responses.</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Compare Models
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See how different AI models respond to the same prompt
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Real-time Responses
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get responses from multiple models simultaneously
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Export & Share
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Save and share your multi-model conversations
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  {message.role === 'assistant' && message.model && (
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {message.model}
                    </div>
                  )}
                  <div className={`${
                    message.role === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Getting responses from {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''}...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              disabled={selectedModels.length === 0 || isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || selectedModels.length === 0 || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          
          {selectedModels.length === 0 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Please select at least one model to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}