'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '../../utils/supabase/client'

interface MCPToken {
  id: string
  token_name: string
  token_preview: string
  active: boolean
  rate_limit_tier: string
  created_at: string
  last_used_at?: string
}

export default function MCPToolsPage() {
  const { user, loading: authLoading } = useAuth()
  const [tokens, setTokens] = useState<MCPToken[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewTokenForm, setShowNewTokenForm] = useState(false)
  const [newTokenName, setNewTokenName] = useState('')
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchTokens()
    }
  }, [user])

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('mcp_user_tokens')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTokens(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateToken = async () => {
    if (!newTokenName.trim()) return

    try {
      setLoading(true)
      
      // Generate a random token
      const token = 'poly_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // Hash for storage
      const tokenHash = btoa(token)

      const { error } = await supabase
        .from('mcp_user_tokens')
        .insert({
          user_id: user?.id,
          token_name: newTokenName,
          token_hash: tokenHash,
          token_preview: `${token.slice(0, 12)}...${token.slice(-4)}`,
          active: true,
          rate_limit_tier: 'standard'
        })

      if (error) throw error

      setGeneratedToken(token)
      setNewTokenName('')
      setShowNewTokenForm(false)
      await fetchTokens()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTokenActive = async (tokenId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('mcp_user_tokens')
        .update({ active: !active })
        .eq('id', tokenId)

      if (error) throw error
      await fetchTokens()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteToken = async (tokenId: string) => {
    if (!confirm('Are you sure you want to delete this token? This cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('mcp_user_tokens')
        .delete()
        .eq('id', tokenId)

      if (error) throw error
      await fetchTokens()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (authLoading || loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          MCP Tools - Agent Integration
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Generate access tokens for your AI agents to use Polydev Perspectives when they get stuck.
          Agents can call our MCP tool to get diverse perspectives from multiple LLMs.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Your agent encounters a difficult problem or gets stuck</li>
            <li>• Agent calls our MCP tool with your token and the problem description</li>
            <li>• Polydev fans out to multiple LLMs (GPT-4, Claude, Gemini) in parallel</li>
            <li>• Agent receives diverse perspectives to overcome the roadblock</li>
            <li>• All API keys managed by Polydev - no setup required</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {generatedToken && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">Token Generated!</h3>
          <p className="text-sm text-green-800 mb-3">
            Copy this token now - it won't be shown again:
          </p>
          <div className="bg-white border rounded p-3 font-mono text-sm">
            <span className="select-all">{generatedToken}</span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedToken)
              alert('Token copied to clipboard!')
            }}
            className="mt-3 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Copy Token
          </button>
          <button
            onClick={() => setGeneratedToken(null)}
            className="mt-3 ml-2 text-sm text-green-600 hover:text-green-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            MCP Access Tokens
          </h2>
          <button
            onClick={() => setShowNewTokenForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generate New Token
          </button>
        </div>

        {showNewTokenForm && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Token Name
                </label>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="e.g., Claude Agent, Production Bot"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <button
                onClick={generateToken}
                disabled={!newTokenName.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Generate
              </button>
              <button
                onClick={() => setShowNewTokenForm(false)}
                className="text-gray-600 dark:text-gray-300 px-4 py-2 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {tokens.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              No tokens generated yet. Create your first token to get started.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Token Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rate Limit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tokens.map((token) => (
                  <tr key={token.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {token.token_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                      {token.token_preview}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        token.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {token.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {token.rate_limit_tier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(token.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleTokenActive(token.id, token.active)}
                        className={`${
                          token.active 
                            ? 'text-red-600 hover:text-red-900 dark:text-red-400'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400'
                        }`}
                      >
                        {token.active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => deleteToken(token.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">MCP Tool Usage</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Server Configuration:</h4>
            <pre className="bg-white dark:bg-gray-900 border rounded p-3 overflow-x-auto text-xs">
{`{
  "mcpServers": {
    "polydev-perspectives": {
      "command": "node",
      "args": ["/path/to/polydev/mcp/server.js"],
      "env": {
        "POLYDEV_API_URL": "https://polydev.ai/api/perspectives"
      }
    }
  }
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Example Tool Call:</h4>
            <pre className="bg-white dark:bg-gray-900 border rounded p-3 overflow-x-auto text-xs">
{`{
  "name": "get_perspectives",
  "arguments": {
    "prompt": "I'm stuck debugging this React performance issue. The component re-renders too often but I can't identify the cause.",
    "user_token": "poly_your_generated_token_here",
    "models": ["gpt-4", "claude-3-sonnet", "gemini-pro"],
    "project_memory": "light"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}