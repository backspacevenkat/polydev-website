'use client'

import { ChevronDown } from 'lucide-react'
import { ApiProvider, PROVIDERS } from '@/types/api-configuration'

interface ProviderSelectorProps {
  selectedProvider: ApiProvider | undefined
  onProviderChange: (provider: ApiProvider) => void
  className?: string
}

export function ProviderSelector({ 
  selectedProvider, 
  onProviderChange,
  className = ''
}: ProviderSelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        AI Provider
      </label>
      
      <div className="relative">
        <select
          value={selectedProvider || ''}
          onChange={(e) => onProviderChange(e.target.value as ApiProvider)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
        >
          <option value="">Select a provider...</option>
          {Object.entries(PROVIDERS).map(([key, provider]) => (
            <option key={key} value={key}>
              {provider.displayName}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute inset-y-0 right-0 mr-3 h-full w-4 text-gray-400 pointer-events-none" />
      </div>

      {selectedProvider && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {PROVIDERS[selectedProvider].description}
        </div>
      )}
    </div>
  )
}