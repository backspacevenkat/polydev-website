'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { createClient } from '../utils/supabase/client'

interface UserProfile {
  id: string
  email: string
  display_name?: string
  company?: string
  role?: string
  timezone?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}

interface UserStats {
  totalChats: number
  totalTokens: number
  favoriteModel: string
  joinedDays: number
  lastActive: string
}

export default function Profile() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadProfile()
      loadStats()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (data) {
        setProfile({
          ...data,
          email: user?.email || data.email
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const loadStats = async () => {
    try {
      // Simulate loading user stats
      // In production, these would come from actual usage data
      const joinedDate = user?.created_at ? new Date(user.created_at) : new Date()
      const daysSinceJoined = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))
      
      setStats({
        totalChats: Math.floor(Math.random() * 100) + 25,
        totalTokens: Math.floor(Math.random() * 50000) + 10000,
        favoriteModel: ['GPT-4', 'Claude 3 Sonnet', 'Gemini Pro'][Math.floor(Math.random() * 3)],
        joinedDays: Math.max(daysSinceJoined, 0),
        lastActive: 'Just now'
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your profile.
          </p>
          <a
            href="/auth"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {profile?.display_name?.charAt(0)?.toUpperCase() || 
                   user.email?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {profile?.display_name || 'User Profile'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {user.email}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
                  {profile?.company && (
                    <>
                      <span>•</span>
                      <span>{profile.company}</span>
                    </>
                  )}
                  {profile?.role && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{profile.role}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Chats</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalChats || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tokens Used</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalTokens?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorite Model</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.favoriteModel || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Days Active</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.joinedDays || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">Started a new chat session</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">Updated profile settings</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">Explored new model comparisons</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                </div>
                {profile?.display_name && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Name</label>
                    <p className="text-sm text-gray-900 dark:text-white">{profile.display_name}</p>
                  </div>
                )}
                {profile?.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</label>
                    <p className="text-sm text-gray-900 dark:text-white">{profile.company}</p>
                  </div>
                )}
                {profile?.role && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                    <p className="text-sm text-gray-900 dark:text-white capitalize">{profile.role}</p>
                  </div>
                )}
                {profile?.timezone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</label>
                    <p className="text-sm text-gray-900 dark:text-white">{profile.timezone}</p>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <a
                  href="/settings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </a>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/chat"
                  className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start New Chat
                </a>
                <a
                  href="/dashboard"
                  className="block w-full px-4 py-2 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  View Dashboard
                </a>
                <a
                  href="/explorer"
                  className="block w-full px-4 py-2 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Explore Models
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}