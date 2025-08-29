'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, ExternalLink } from 'lucide-react'

interface ApiKeyFieldProps {
  provider: string
  providerName: string
  value: string
  onChange: (value: string) => void
  signupUrl?: string
  placeholder?: string
  helpText?: string
}

export function ApiKeyField({
  provider,
  providerName,
  value,
  onChange,
  signupUrl,
  placeholder,
  helpText
}: ApiKeyFieldProps) {
  const [localValue, setLocalValue] = useState(value)
  const [showKey, setShowKey] = useState(false)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced onChange
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    const timeout = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, 500)

    setDebounceTimeout(timeout)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [localValue, onChange, value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {providerName} API Key
        </label>
        {signupUrl && (
          <a
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
          >
            Get API Key
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      
      <div className="relative">
        <input
          type={showKey ? 'text' : 'password'}
          value={localValue}
          onChange={handleInputChange}
          placeholder={placeholder || `Enter your ${providerName} API key...`}
          className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
        />
        
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showKey ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}

      {localValue && (
        <div className="text-xs text-green-600 dark:text-green-400">
          ✓ API key configured
        </div>
      )}
    </div>
  )
}