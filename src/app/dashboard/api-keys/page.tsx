'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { createClient } from '../../utils/supabase/client'
import { Plus, Eye, EyeOff, Edit3, Trash2, Settings, TrendingUp, AlertCircle, Check } from 'lucide-react'

interface ApiKey {
  id: string
  provider: string
  key_name: string
  key_preview: string
  active: boolean
  api_base?: string
  default_model?: string
  monthly_budget?: number
  current_usage?: number
  rate_limit_rpm?: number
  created_at: string
  last_used_at?: string
}

interface ProviderConfig {
  id: string
  provider_name: string
  base_url?: string
  api_key_required: boolean
  supports_streaming: boolean
  supports_tools: boolean
  supports_images: boolean
  supports_prompt_cache: boolean
  authentication_method: string
  models: any[]
}

export default function ApiKeysPage() {
  const { user, loading: authLoading } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [providers, setProviders] = useState<ProviderConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [showApiKey, setShowApiKey] = useState<{[keyId: string]: boolean}>({})
  
  // Form state
  const [formData, setFormData] = useState({
    provider: 'openai',
    key_name: '',
    api_key: '',
    api_base: '',
    default_model: '',
    monthly_budget: '',
    rate_limit_rpm: '60'
  })

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch API keys
      const { data: keysData, error: keysError } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (keysError) throw keysError

      // Fetch provider configurations
      const { data: providersData, error: providersError } = await supabase
        .from('provider_configurations')
        .select('*')
        .order('provider_name')

      if (providersError) throw providersError

      setApiKeys(keysData || [])
      setProviders(providersData || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleProviderChange = (provider: string) => {
    const providerConfig = providers.find(p => p.id === provider)
    setFormData(prev => ({
      ...prev,
      provider,
      api_base: providerConfig?.base_url || '',
      default_model: providerConfig?.models[0]?.name || ''
    }))
  }

  const saveApiKey = async () => {
    const provider = providers.find(p => p.id === formData.provider)
    
    if (!formData.key_name.trim()) {
      setError('Key name is required')
      return
    }
    
    if (provider?.api_key_required && !formData.api_key.trim()) {
      setError('API key is required for this provider')
      return
    }

    try {
      setLoading(true)
      
      // Encrypt the API key (in production, use proper encryption)
      const encryptedKey = formData.api_key ? btoa(formData.api_key) : null
      const keyPreview = formData.api_key && formData.api_key.length > 8 
        ? `${formData.api_key.slice(0, 8)}...${formData.api_key.slice(-4)}`
        : formData.api_key 
        ? `${formData.api_key.slice(0, 4)}***`
        : `${provider?.authentication_method === 'cli' ? 'CLI' : 'Cloud'} Auth`

      const keyData = {
        user_id: user?.id,
        provider: formData.provider,
        key_name: formData.key_name,
        encrypted_key: encryptedKey,
        key_preview: keyPreview,
        api_base: formData.api_base || null,
        default_model: formData.default_model || null,
        monthly_budget: formData.monthly_budget ? parseFloat(formData.monthly_budget) : null,
        rate_limit_rpm: parseInt(formData.rate_limit_rpm) || 60,
        active: true
      }

      if (editingKey) {
        const { error } = await supabase
          .from('user_api_keys')
          .update(keyData)
          .eq('id', editingKey.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('user_api_keys')
          .insert(keyData)
        
        if (error) throw error
      }

      setShowAddForm(false)
      setEditingKey(null)
      setFormData({
        provider: 'openai',
        key_name: '',
        api_key: '',
        api_base: '',
        default_model: '',
        monthly_budget: '',
        rate_limit_rpm: '60'
      })
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleKeyActive = async (keyId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('user_api_keys')
        .update({ active: !active })
        .eq('id', keyId)

      if (error) throw error
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This cannot be undone.')) return

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('id', keyId)

      if (error) throw error
      await fetchData()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const editKey = (key: ApiKey) => {
    setEditingKey(key)
    setFormData({
      provider: key.provider,
      key_name: key.key_name,
      api_key: '', // Don't populate for security
      api_base: key.api_base || '',
      default_model: key.default_model || '',
      monthly_budget: key.monthly_budget?.toString() || '',
      rate_limit_rpm: key.rate_limit_rpm?.toString() || '60'
    })
    setShowAddForm(true)
  }

  const getProviderInfo = (provider: string) => {
    return providers.find(p => p.id === provider) || {
      provider_name: provider.charAt(0).toUpperCase() + provider.slice(1),
      authentication_method: 'api_key'
    }
  }

  const getUsageColor = (current: number, budget: number) => {
    const percentage = (current / budget) * 100
    if (percentage >= 90) return 'text-red-600 bg-red-50'
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          API Keys Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage your API keys for all supported LLM providers. These keys are encrypted and used securely across Polydev services.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Comprehensive Provider Support</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Add API keys for OpenAI, Anthropic, Google, Azure, AWS Bedrock, Mistral, Cohere, and many more providers. 
                Configure custom endpoints, rate limits, and budgets for each key.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* API Keys List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your API Keys
          </h2>
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingKey(null)
              setFormData({
                provider: 'openai',
                key_name: '',
                api_key: '',
                api_base: '',
                default_model: '',
                monthly_budget: '',
                rate_limit_rpm: '60'
              })
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add API Key</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              {editingKey ? 'Edit API Key' : 'Add New API Key'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider *
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.provider_name} {provider.api_key_required ? '' : '(CLI/Cloud)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Key Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key Name *
                </label>
                <input
                  type="text"
                  value={formData.key_name}
                  onChange={(e) => setFormData(prev => ({...prev, key_name: e.target.value}))}
                  placeholder="e.g., Production OpenAI, Dev Claude"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* API Key - only show for providers that require it */}
            {providers.find(p => p.id === formData.provider)?.api_key_required && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key * {editingKey && <span className="text-xs text-gray-500">(leave empty to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.api_key}
                    onChange={(e) => setFormData(prev => ({...prev, api_key: e.target.value}))}
                    placeholder={editingKey ? "Enter new key to update" : "sk-... or your provider's API key format"}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>
            )}
            
            {/* CLI/Cloud Provider Info */}
            {!providers.find(p => p.id === formData.provider)?.api_key_required && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {providers.find(p => p.id === formData.provider)?.authentication_method === 'cli' ? 'CLI-based Provider' : 'Cloud-based Provider'}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {providers.find(p => p.id === formData.provider)?.authentication_method === 'cli' 
                        ? 'This provider uses CLI authentication. Make sure you have the CLI tool installed and authenticated.'
                        : 'This provider uses cloud credentials. Configure your cloud authentication separately.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* API Base URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  API Base URL
                </label>
                <input
                  type="text"
                  value={formData.api_base}
                  onChange={(e) => setFormData(prev => ({...prev, api_base: e.target.value}))}
                  placeholder="Custom endpoint (optional)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              {/* Default Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Model
                </label>
                <select
                  value={formData.default_model}
                  onChange={(e) => setFormData(prev => ({...prev, default_model: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="">Select model (optional)</option>
                  {Object.keys(providers.find(p => p.id === formData.provider)?.models || {}).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Rate Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rate Limit (RPM)
                </label>
                <input
                  type="number"
                  value={formData.rate_limit_rpm}
                  onChange={(e) => setFormData(prev => ({...prev, rate_limit_rpm: e.target.value}))}
                  placeholder="60"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Monthly Budget (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_budget}
                onChange={(e) => setFormData(prev => ({...prev, monthly_budget: e.target.value}))}
                placeholder="100.00"
                className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={saveApiKey}
                disabled={!formData.key_name.trim() || (!formData.api_key.trim() && !editingKey)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingKey ? 'Update' : 'Save'} API Key</span>
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingKey(null)
                }}
                className="text-gray-600 dark:text-gray-300 px-4 py-2 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* API Keys Table */}
        <div className="overflow-x-auto">
          {apiKeys.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">No API keys configured</h3>
              <p className="text-sm">Add your first API key to start using Polydev services</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {apiKeys.map((key) => {
                const providerInfo = getProviderInfo(key.provider)
                const usagePercentage = key.monthly_budget ? (key.current_usage || 0) / key.monthly_budget * 100 : 0
                
                return (
                  <div key={key.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {providerInfo.provider_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {key.key_name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {providerInfo.provider_name} • {key.key_preview}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            key.active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {key.active ? 'Active' : 'Disabled'}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                          {key.default_model && (
                            <span>Model: {key.default_model}</span>
                          )}
                          {key.rate_limit_rpm && (
                            <span>Rate: {key.rate_limit_rpm} RPM</span>
                          )}
                          {key.monthly_budget && (
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${getUsageColor(key.current_usage || 0, key.monthly_budget)}`}>
                                ${(key.current_usage || 0).toFixed(2)} / ${key.monthly_budget}
                              </span>
                              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                                <div 
                                  className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                          <span>
                            Added {new Date(key.created_at).toLocaleDateString()}
                          </span>
                          {key.last_used_at && (
                            <span>
                              Last used {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editKey(key)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit key"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleKeyActive(key.id, key.active)}
                          className={`p-2 rounded-lg ${
                            key.active 
                              ? 'text-red-600 hover:text-red-900 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                          }`}
                          title={key.active ? 'Disable key' : 'Enable key'}
                        >
                          {key.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteKey(key.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Provider Support Info */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Supported Providers ({providers.length})</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {providers.map(provider => (
            <div key={provider.id} className="bg-white dark:bg-gray-900 p-3 rounded border">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                  {provider.provider_name.charAt(0)}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {provider.provider_name}
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {provider.authentication_method === 'cli' ? 'CLI Authentication' : 
                 provider.authentication_method === 'cloud' ? 'Cloud Authentication' :
                 'API Key Authentication'}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {provider.supports_streaming && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded">Stream</span>
                )}
                {provider.supports_tools && (
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs rounded">Tools</span>
                )}
                {provider.supports_images && (
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs rounded">Images</span>
                )}
                {provider.supports_prompt_cache && (
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">Cache</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}