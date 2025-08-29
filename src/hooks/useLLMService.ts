'use client'

import { useEffect, useMemo } from 'react'
import { useApiConfiguration } from '@/hooks/useApiConfiguration'
import { llmService } from '@/lib/llm/llm-service'
import { LLMMessage, ApiStream } from '@/types/llm'
import { ApiProvider } from '@/types/api-configuration'

export function useLLMService() {
  const { config, hasValidConfig } = useApiConfiguration()

  // Update LLM service when configuration changes
  useEffect(() => {
    llmService.updateConfiguration(config)
  }, [config])

  const isConfigured = useMemo(() => {
    return llmService.isCurrentProviderConfigured()
  }, [config])

  const currentProvider = useMemo(() => {
    return llmService.getCurrentProvider()
  }, [config])

  const configuredProviders = useMemo(() => {
    return llmService.getConfiguredProviders()
  }, [config])

  const createMessage = async (
    systemPrompt: string,
    messages: LLMMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      provider?: ApiProvider
      model?: string
    }
  ): Promise<ApiStream> => {
    return llmService.createMessage(systemPrompt, messages, options)
  }

  const generateText = async (
    prompt: string,
    options?: {
      systemPrompt?: string
      temperature?: number
      maxTokens?: number
      provider?: ApiProvider
      model?: string
    }
  ): Promise<string> => {
    return llmService.generateText(prompt, options)
  }

  const validateApiKey = async (provider: ApiProvider, apiKey: string): Promise<boolean> => {
    return llmService.validateApiKey(provider, apiKey)
  }

  return {
    // State
    isConfigured,
    currentProvider,
    configuredProviders,
    hasAnyValidConfig: hasValidConfig(),
    
    // Actions
    createMessage,
    generateText,
    validateApiKey,
    
    // Service instance for direct access if needed
    service: llmService
  }
}