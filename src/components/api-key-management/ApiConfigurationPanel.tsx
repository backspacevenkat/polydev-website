'use client'

import { useState } from 'react'
import { Settings, Shield, AlertCircle, CheckCircle, Terminal } from 'lucide-react'
import { useApiConfiguration } from '@/hooks/useApiConfiguration'
import { PROVIDERS, ApiProvider } from '@/types/api-configuration'
import { ProviderSelector } from './ProviderSelector'
import { ApiKeyField } from './ApiKeyField'

interface ApiConfigurationPanelProps {
  className?: string
}

export function ApiConfigurationPanel({ className = '' }: ApiConfigurationPanelProps) {
  const {
    config,
    loading,
    error,
    updateProvider,
    updateApiKey,
    updateModel,
    getApiKey,
    getModel,
    hasValidConfig,
    updateConfig
  } = useApiConfiguration()

  const [expandedProvider, setExpandedProvider] = useState<ApiProvider | null>(
    config.selectedProvider || null
  )
  const [activeTab, setActiveTab] = useState<'api-keys' | 'cli-providers'>('api-keys')

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading configuration...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              LLM Provider Configuration
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configure AI providers using API keys or subscription-based CLI tools
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('api-keys')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'api-keys'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>API Keys</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('cli-providers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cli-providers'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>CLI Subscriptions</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'api-keys' && (
          <>
            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Your API keys are encrypted
                  </div>
                  <div className="text-blue-700 dark:text-blue-300">
                    All API keys are encrypted using browser-based cryptography before being stored locally. 
                    Your keys never leave your device.
                  </div>
                </div>
              </div>
            </div>

        {/* Provider Selection */}
        <ProviderSelector
          selectedProvider={config.selectedProvider}
          onProviderChange={(provider) => {
            updateProvider(provider)
            setExpandedProvider(provider)
          }}
        />

        {/* Provider Configuration */}
        {config.selectedProvider && (
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {PROVIDERS[config.selectedProvider].displayName} Configuration
                  </h3>
                  {hasValidConfig(config.selectedProvider) ? (
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs">Configured</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">API Key Required</span>
                    </div>
                  )}
                </div>

                <ApiKeyField
                  provider={config.selectedProvider}
                  providerName={PROVIDERS[config.selectedProvider].displayName}
                  value={getApiKey(config.selectedProvider)}
                  onChange={(apiKey) => updateApiKey(config.selectedProvider!, apiKey)}
                  signupUrl={PROVIDERS[config.selectedProvider].signupUrl}
                  helpText={`Your ${PROVIDERS[config.selectedProvider].displayName} API key is encrypted and stored securely in your browser.`}
                />

                {/* Model Selection */}
                {PROVIDERS[config.selectedProvider].models && PROVIDERS[config.selectedProvider].models!.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Model Selection
                    </label>
                    <select
                      value={getModel(config.selectedProvider) || ''}
                      onChange={(e) => updateModel(config.selectedProvider!, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select a model...</option>
                      {PROVIDERS[config.selectedProvider].models!.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                          {model.contextWindow && ` (${model.contextWindow.toLocaleString()} tokens)`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Documentation Link */}
                <div className="text-sm">
                  <a
                    href={PROVIDERS[config.selectedProvider].docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1"
                  >
                    <span>View {PROVIDERS[config.selectedProvider].displayName} Documentation</span>
                    <Settings className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

            {/* Configuration Summary */}
            {hasValidConfig() && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-green-900 dark:text-green-100">
                      Configuration Complete
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Your Polydev MCP server is ready to use {PROVIDERS[config.selectedProvider!].displayName} 
                      {getModel(config.selectedProvider!) && ` with ${getModel(config.selectedProvider!)}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* CLI Providers Tab */}
        {activeTab === 'cli-providers' && (
          <div className="text-center py-8 text-gray-500">
            CLI providers configuration coming soon
          </div>
        )}
      </div>
    </div>
  )
}