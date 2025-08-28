'use client'

import { useState } from 'react'

interface ApiRequest {
  method: string
  endpoint: string
  headers: Record<string, string>
  body?: string
}

interface ApiResponse {
  status: number
  headers: Record<string, string>
  body: string
  time: number
}

export default function ApiExplorer() {
  const [request, setRequest] = useState<ApiRequest>({
    method: 'GET',
    endpoint: '/api/health',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const endpoints = [
    { method: 'GET', path: '/api/health', description: 'System health check' },
    { method: 'GET', path: '/api/mcp/servers', description: 'List MCP servers' },
    { method: 'POST', path: '/api/mcp/servers', description: 'Create MCP server' },
    { method: 'GET', path: '/api/llm/providers', description: 'List LLM providers' },
    { method: 'POST', path: '/api/llm/chat', description: 'Send chat message' },
    { method: 'GET', path: '/api/analytics/usage', description: 'Get usage analytics' },
    { method: 'GET', path: '/api/auth/session', description: 'Get current session' }
  ]

  const executeRequest = async () => {
    setLoading(true)
    const startTime = Date.now()
    
    try {
      const options: RequestInit = {
        method: request.method,
        headers: request.headers
      }
      
      if (request.body && request.method !== 'GET') {
        options.body = request.body
      }
      
      const response = await fetch(request.endpoint, options)
      const responseText = await response.text()
      const endTime = Date.now()
      
      setResponse({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText,
        time: endTime - startTime
      })
    } catch (error: any) {
      setResponse({
        status: 0,
        headers: {},
        body: `Error: ${error.message}`,
        time: Date.now() - startTime
      })
    } finally {
      setLoading(false)
    }
  }

  const updateHeader = (key: string, value: string) => {
    setRequest(prev => ({
      ...prev,
      headers: { ...prev.headers, [key]: value }
    }))
  }

  const removeHeader = (key: string) => {
    setRequest(prev => {
      const newHeaders = { ...prev.headers }
      delete newHeaders[key]
      return { ...prev, headers: newHeaders }
    })
  }

  const addHeader = () => {
    const key = prompt('Header name:')
    const value = prompt('Header value:')
    if (key && value) {
      updateHeader(key, value)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            API Explorer & Playground
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test and explore the Polydev AI API endpoints interactively
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Request
            </h2>
            
            {/* Quick Endpoints */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Select:
              </h3>
              <div className="space-y-2">
                {endpoints.map((ep, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRequest(prev => ({ ...prev, method: ep.method, endpoint: ep.path }))}
                    className="block w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <span className={`inline-block w-12 text-xs font-mono ${
                      ep.method === 'GET' ? 'text-green-600' : 
                      ep.method === 'POST' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-gray-900 dark:text-white mr-2">{ep.path}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">{ep.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Method and Endpoint */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Method
                </label>
                <select
                  value={request.method}
                  onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endpoint
                </label>
                <input
                  type="text"
                  value={request.endpoint}
                  onChange={(e) => setRequest(prev => ({ ...prev, endpoint: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="/api/endpoint"
                />
              </div>
            </div>

            {/* Headers */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Headers
                </label>
                <button
                  onClick={addHeader}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  + Add Header
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(request.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        removeHeader(key)
                        updateHeader(e.target.value, value)
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Header name"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateHeader(key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Header value"
                    />
                    <button
                      onClick={() => removeHeader(key)}
                      className="px-2 py-2 text-red-600 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Body */}
            {request.method !== 'GET' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Request Body (JSON)
                </label>
                <textarea
                  value={request.body || ''}
                  onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
              </div>
            )}

            <button
              onClick={executeRequest}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>

          {/* Response Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Response
            </h2>
            
            {response ? (
              <div>
                {/* Response Status */}
                <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      response.status >= 200 && response.status < 300 
                        ? 'text-green-600' 
                        : response.status >= 400 
                        ? 'text-red-600' 
                        : 'text-orange-600'
                    }`}>
                      Status: {response.status}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Time: {response.time}ms
                    </span>
                  </div>
                </div>

                {/* Response Headers */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Headers:
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-gray-800 dark:text-gray-200">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Response Body */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Response Body:
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {response.body}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <p>Send a request to see the response here</p>
              </div>
            )}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            API Documentation
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Most endpoints require authentication. Include your API key in the Authorization header:
              </p>
              <code className="block mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                Authorization: Bearer your-api-key-here
              </code>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Rate Limits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                API requests are limited to 1000 requests per hour per API key.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Error Responses</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Errors are returned with appropriate HTTP status codes and JSON error messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}