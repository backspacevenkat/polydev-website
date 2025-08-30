'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Key, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles,
  Brain,
  Zap,
  CreditCard
} from 'lucide-react'
import { signOut } from '@/lib/auth'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardClientProps {
  user: {
    id: string
    email?: string
    user_metadata?: Record<string, unknown>
  }
  profile: Profile
}

export function DashboardClient({ profile }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'api-keys' | 'analytics' | 'settings'>('overview')

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const getUsageColor = () => {
    const percentage = (profile.queries_used / profile.monthly_queries) * 100
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getSubscriptionColor = () => {
    switch (profile.subscription_tier) {
      case 'enterprise': return 'from-purple-500 to-pink-500'
      case 'pro': return 'from-blue-500 to-purple-600'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Polydev AI
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium">{profile.full_name || 'User'}</div>
              <div className="text-xs text-gray-400">{profile.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'api-keys', label: 'API Keys', icon: Key },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'api-keys' | 'analytics' | 'settings')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Subscription Card */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getSubscriptionColor()} rounded-lg flex items-center justify-center`}>
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold capitalize">{profile.subscription_tier} Plan</div>
                    <div className="text-sm text-gray-400">Current subscription</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2">
                  {profile.subscription_tier === 'free' && '$0'}
                  {profile.subscription_tier === 'pro' && '$29'}
                  {profile.subscription_tier === 'enterprise' && '$99'}
                  <span className="text-sm font-normal text-gray-400">/month</span>
                </div>
              </div>

              {/* Usage Card */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Query Usage</div>
                    <div className="text-sm text-gray-400">This month</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-3">
                  {profile.queries_used} / {profile.monthly_queries}
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getUsageColor()}`}
                    style={{ width: `${Math.min((profile.queries_used / profile.monthly_queries) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Models Card */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Models</div>
                    <div className="text-sm text-gray-400">Available</div>
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2">100+</div>
                <div className="text-sm text-gray-400">GPT-5, Claude 4.1, Gemini 2.5 Pro</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-left">
                  <Key className="w-6 h-6 text-blue-400 mb-2" />
                  <div className="font-medium">Add API Key</div>
                  <div className="text-sm text-gray-400">Connect OpenRouter, OpenAI, etc.</div>
                </button>
                <button className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-left">
                  <BarChart3 className="w-6 h-6 text-green-400 mb-2" />
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-gray-400">Usage stats and insights</div>
                </button>
                <button className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-left">
                  <CreditCard className="w-6 h-6 text-purple-400 mb-2" />
                  <div className="font-medium">Upgrade Plan</div>
                  <div className="text-sm text-gray-400">Get more queries and features</div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="text-gray-400 text-center py-8">
                No recent activity to display
              </div>
            </div>
          </motion.div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'api-keys' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">API Keys</h2>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                Add API Key
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-gray-400 text-center py-8">
                No API keys configured yet. Add your first API key to get started.
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Analytics</h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="text-gray-400 text-center py-8">
                Analytics data will appear here once you start making queries.
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Settings</h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg opacity-50 cursor-not-allowed"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}