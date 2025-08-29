'use client'

import React, { useState, useEffect } from 'react'
import { CliProvider, CLI_PROVIDERS, ApiConfiguration } from '@/types/api-configuration'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, ExternalLink, Terminal, Settings } from 'lucide-react'

interface CliProviderConfigurationProps {
  configuration: ApiConfiguration
  onConfigurationChange: (config: ApiConfiguration) => void
}

export function CliProviderConfiguration({
  configuration,
  onConfigurationChange
}: CliProviderConfigurationProps) {
  const [cliStatuses, setCliStatuses] = useState<Record<CliProvider, 'checking' | 'available' | 'unavailable'>>({
    'codex': 'checking',
    'claude-code': 'checking',
    'gemini-cli': 'checking',
    'github-copilot': 'checking'
  })

  const [customPaths, setCustomPaths] = useState({
    codex: configuration.cliProviders?.codexPath || '',
    'claude-code': configuration.cliProviders?.claudeCodePath || '',
    'gemini-cli': configuration.cliProviders?.geminiPath || ''
  })

  useEffect(() => {
    checkCliAvailability()
  }, [])

  const checkCliAvailability = async () => {
    // In a real implementation, this would check if CLI tools are available
    // For now, we'll simulate the check
    setTimeout(() => {
      setCliStatuses({
        'codex': Math.random() > 0.7 ? 'available' : 'unavailable',
        'claude-code': Math.random() > 0.7 ? 'available' : 'unavailable',
        'gemini-cli': Math.random() > 0.8 ? 'available' : 'unavailable',
        'github-copilot': Math.random() > 0.6 ? 'available' : 'unavailable'
      })
    }, 1500)
  }

  const handlePathChange = (provider: CliProvider, path: string) => {
    const newPaths = { ...customPaths }
    
    if (provider === 'codex') {
      newPaths.codex = path
    } else if (provider === 'claude-code') {
      newPaths['claude-code'] = path
    } else if (provider === 'gemini-cli') {
      newPaths['gemini-cli'] = path
    }
    
    setCustomPaths(newPaths)
    
    const updatedConfig = {
      ...configuration,
      cliProviders: {
        ...configuration.cliProviders,
        codexPath: newPaths.codex || undefined,
        claudeCodePath: newPaths['claude-code'] || undefined,
        geminiPath: newPaths['gemini-cli'] || undefined
      }
    }
    
    onConfigurationChange(updatedConfig)
  }

  const toggleProvider = (provider: CliProvider, enabled: boolean) => {
    const currentProviders = configuration.cliProviders?.enabledProviders || []
    const updatedProviders = enabled 
      ? [...currentProviders.filter(p => p !== provider), provider]
      : currentProviders.filter(p => p !== provider)
    
    const updatedConfig = {
      ...configuration,
      cliProviders: {
        ...configuration.cliProviders,
        enabledProviders: updatedProviders
      }
    }
    
    onConfigurationChange(updatedConfig)
  }

  const isProviderEnabled = (provider: CliProvider) => {
    return configuration.cliProviders?.enabledProviders?.includes(provider) || false
  }

  const getStatusIcon = (provider: CliProvider) => {
    const status = cliStatuses[provider]
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'unavailable':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    }
  }

  const getStatusText = (provider: CliProvider) => {
    const status = cliStatuses[provider]
    switch (status) {
      case 'available':
        return 'Available'
      case 'unavailable':
        return 'Not Found'
      default:
        return 'Checking...'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Terminal className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Subscription-Based Access</h3>
            <p className="text-sm text-blue-700 mt-1">
              CLI providers use your existing subscriptions (ChatGPT Plus, Claude Pro, etc.) instead of API keys.
              This means no additional costs beyond your existing subscriptions!
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {(Object.entries(CLI_PROVIDERS) as [CliProvider, typeof CLI_PROVIDERS[CliProvider]][]).map(([providerId, provider]) => (
          <Card key={providerId} className={`transition-all ${isProviderEnabled(providerId) ? 'ring-2 ring-blue-200 bg-blue-50/50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(providerId)}
                  <div>
                    <CardTitle className="text-sm font-medium">{provider.displayName}</CardTitle>
                    <CardDescription className="text-xs">{provider.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={cliStatuses[providerId] === 'available' ? 'default' : 'secondary'} className="text-xs">
                    {getStatusText(providerId)}
                  </Badge>
                  {cliStatuses[providerId] === 'available' && (
                    <Button
                      variant={isProviderEnabled(providerId) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleProvider(providerId, !isProviderEnabled(providerId))}
                    >
                      {isProviderEnabled(providerId) ? 'Enabled' : 'Enable'}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Setup Instructions */}
                {cliStatuses[providerId] === 'unavailable' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div className="flex items-start space-x-2">
                      <Settings className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-900">Setup Required</p>
                        <p className="text-amber-700 mt-1">
                          Install and authenticate {provider.displayName} to use this provider.
                        </p>
                        <div className="flex space-x-2 mt-2">
                          {provider.setupUrl && (
                            <a
                              href={provider.setupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-700 hover:text-amber-900 text-xs flex items-center space-x-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Get Started</span>
                            </a>
                          )}
                          <a
                            href={provider.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 hover:text-amber-900 text-xs flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Documentation</span>
                          </a>
                        </div>
                        {provider.authCommand && (
                          <div className="mt-2 bg-amber-100 rounded px-2 py-1">
                            <code className="text-xs text-amber-900">{provider.authCommand}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Path Configuration */}
                {providerId !== 'github-copilot' && (
                  <div className="space-y-2">
                    <Label htmlFor={`${providerId}-path`} className="text-xs font-medium">
                      Custom Path (Optional)
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id={`${providerId}-path`}
                        type="text"
                        placeholder={`/path/to/${provider.defaultExecutableName}`}
                        value={customPaths[providerId as keyof typeof customPaths] || ''}
                        onChange={(e) => handlePathChange(providerId, e.target.value)}
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => checkCliAvailability()}
                        disabled={cliStatuses[providerId] === 'checking'}
                        className="text-xs"
                      >
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use default installation path
                    </p>
                  </div>
                )}

                {/* GitHub Copilot Special Notice */}
                {providerId === 'github-copilot' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">VS Code Integration Required</p>
                      <p className="text-gray-700 mt-1">
                        GitHub Copilot integration requires VS Code extension environment and uses the Language Model API.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Configuration Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-medium">Available Providers:</span>
            <span className="ml-2">
              {Object.values(cliStatuses).filter(status => status === 'available').length}
            </span>
          </div>
          <div>
            <span className="font-medium">Enabled Providers:</span>
            <span className="ml-2">
              {configuration.cliProviders?.enabledProviders?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}