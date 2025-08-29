'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ApiConfiguration, ApiProvider } from '@/types/api-configuration'

// Simple encryption using browser's SubtleCrypto API
class ApiKeyStorage {
  private static STORAGE_KEY = 'polydev_api_config'
  private static ENCRYPTION_KEY = 'polydev_encryption_key'

  private static async getKey(): Promise<CryptoKey> {
    // In a production app, you'd want to derive this from user password or use more secure methods
    // For now, using a consistent key for demo purposes
    const keyData = new TextEncoder().encode('polydev-api-keys-2024-secure')
    return crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    )
  }

  static async encryptAndStore(config: ApiConfiguration): Promise<void> {
    try {
      const key = await this.getKey()
      const data = JSON.stringify(config)
      const iv = crypto.getRandomValues(new Uint8Array(12))
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(data)
      )

      const encryptedData = {
        encrypted: Array.from(new Uint8Array(encrypted)),
        iv: Array.from(iv)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encryptedData))
    } catch (error) {
      console.error('Failed to encrypt and store API configuration:', error)
      // Fallback to unencrypted storage for development
      localStorage.setItem(this.STORAGE_KEY + '_fallback', JSON.stringify(config))
    }
  }

  static async decryptAndLoad(): Promise<ApiConfiguration | null> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        // Try fallback
        const fallback = localStorage.getItem(this.STORAGE_KEY + '_fallback')
        return fallback ? JSON.parse(fallback) : null
      }

      const encryptedData = JSON.parse(stored)
      const key = await this.getKey()
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
        key,
        new Uint8Array(encryptedData.encrypted)
      )

      const data = new TextDecoder().decode(decrypted)
      return JSON.parse(data)
    } catch (error) {
      console.error('Failed to decrypt API configuration:', error)
      // Try fallback
      const fallback = localStorage.getItem(this.STORAGE_KEY + '_fallback')
      return fallback ? JSON.parse(fallback) : null
    }
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.STORAGE_KEY + '_fallback')
  }
}

const DEFAULT_CONFIG: ApiConfiguration = {
  selectedProvider: 'anthropic',
  requestTimeoutMs: 30000,
}

export function useApiConfiguration() {
  const [config, setConfig] = useState<ApiConfiguration>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load configuration on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        const stored = await ApiKeyStorage.decryptAndLoad()
        if (stored) {
          setConfig({ ...DEFAULT_CONFIG, ...stored })
        }
      } catch (err) {
        setError('Failed to load API configuration')
        console.error('Error loading API configuration:', err)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  // Debounced save function
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  const saveConfig = useCallback(async (newConfig: ApiConfiguration) => {
    try {
      await ApiKeyStorage.encryptAndStore(newConfig)
    } catch (err) {
      setError('Failed to save API configuration')
      console.error('Error saving API configuration:', err)
    }
  }, [])

  const updateConfig = useCallback((updates: Partial<ApiConfiguration>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)

    // Debounced save
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    
    const timeout = setTimeout(() => {
      saveConfig(newConfig)
    }, 500)
    
    setSaveTimeout(timeout)
  }, [config, saveConfig, saveTimeout])

  const updateProvider = useCallback((provider: ApiProvider) => {
    updateConfig({ selectedProvider: provider })
  }, [updateConfig])

  const updateApiKey = useCallback((provider: ApiProvider, apiKey: string) => {
    const keyField = `${provider}ApiKey` as keyof ApiConfiguration
    updateConfig({ [keyField]: apiKey })
  }, [updateConfig])

  const updateModel = useCallback((provider: ApiProvider, model: string) => {
    const modelField = `${provider}Model` as keyof ApiConfiguration
    updateConfig({ [modelField]: model })
  }, [updateConfig])

  const getApiKey = useCallback((provider: ApiProvider): string => {
    const keyField = `${provider}ApiKey` as keyof ApiConfiguration
    return (config[keyField] as string) || ''
  }, [config])

  const getModel = useCallback((provider: ApiProvider): string => {
    const modelField = `${provider}Model` as keyof ApiConfiguration
    return (config[modelField] as string) || ''
  }, [config])

  const hasValidConfig = useCallback((provider?: ApiProvider): boolean => {
    const targetProvider = provider || config.selectedProvider
    if (!targetProvider) return false
    
    const apiKey = getApiKey(targetProvider)
    return !!apiKey && apiKey.length > 0
  }, [config.selectedProvider, getApiKey])

  const clearConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
    ApiKeyStorage.clear()
  }, [])

  return {
    config,
    loading,
    error,
    updateConfig,
    updateProvider,
    updateApiKey,
    updateModel,
    getApiKey,
    getModel,
    hasValidConfig,
    clearConfig,
  }
}