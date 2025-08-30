'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Github, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { signInWithEmail, signUpWithEmail, signInWithGithub, signInWithGoogle } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name)
        setError('Please check your email for verification instructions.')
      } else {
        await signInWithEmail(email, password)
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
    
    setIsLoading(false)
  }

  const handleGithubAuth = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await signInWithGithub()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-teal-900/30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12">
          <Link href="/" className="flex items-center space-x-2 mb-12 group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-gray-400 group-hover:text-white transition-colors">Back to home</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Polydev AI
              </h1>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Access 100+ AI Models
              <br />
              with Intelligent Routing
            </h2>

            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of developers using Polydev AI to get the best answers 
              from GPT-5, Claude 4.1, Gemini 2.5 Pro and more.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-gray-300">Intelligent query routing</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-gray-300">Real-time cost optimization</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-teal-400 rounded-full" />
                <span className="text-gray-300">Enterprise-grade security</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-12">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-6 group">
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-gray-400 group-hover:text-white transition-colors">Back to home</span>
            </Link>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Polydev AI
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h3>
              <p className="text-gray-400">
                {mode === 'signup' 
                  ? 'Start your free trial today. No credit card required.' 
                  : 'Sign in to your Polydev AI account'
                }
              </p>
              {error && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  error.includes('check your email') 
                    ? 'bg-green-900/20 border border-green-500/20 text-green-300'
                    : 'bg-red-900/20 border border-red-500/20 text-red-300'
                }`}>
                  {error}
                </div>
              )}
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-gray-900 rounded-lg p-1 mb-8">
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'signup'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  mode === 'signin'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Social Auth */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGithubAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </button>
              
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-700 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-black text-xs font-bold">G</span>
                </div>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="px-3 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors pr-12"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <p className="text-sm text-gray-400 mt-1">
                    Must be at least 8 characters
                  </p>
                )}
              </div>

              {mode === 'signin' && (
                <div className="flex justify-end">
                  <Link href="/auth/reset" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {mode === 'signup' && (
              <p className="text-sm text-gray-400 mt-6 text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}