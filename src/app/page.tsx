'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Link from 'next/link'

const features = [
  {
    icon: '🧠',
    title: 'Multi-Model Perspectives',
    description: 'When agents get stuck, get diverse perspectives from 22+ AI models simultaneously',
    highlight: 'GPT-4, Claude, Gemini, Groq+'
  },
  {
    icon: '🔗',
    title: 'MCP Native',
    description: 'Purpose-built MCP server for Model Context Protocol agent frameworks',
    highlight: 'Claude Code, Cursor, Codex'
  },
  {
    icon: '⚡',
    title: 'Agent Breakthrough',
    description: 'Help agents overcome roadblocks with collective AI intelligence',
    highlight: 'Parallel processing'
  },
  {
    icon: '🔑',
    title: 'Comprehensive Keys',
    description: 'Support for 22+ providers with custom endpoints and budget controls',
    highlight: 'All major providers'
  },
  {
    icon: '🎯',
    title: 'Context-Aware',
    description: 'TF-IDF project memory for contextual debugging assistance',
    highlight: 'Smart context selection'
  },
  {
    icon: '📊',
    title: 'Agent Analytics',
    description: 'Track which perspectives help agents most effectively',
    highlight: 'Success metrics'
  }
]

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'AI Agent Developer',
    avatar: 'AC',
    quote: 'My Claude Code agent was stuck on a complex React issue. Polydev gave it 3 different expert perspectives and it immediately found the solution.'
  },
  {
    name: 'Marcus Rivera',
    role: 'Senior Engineer',
    avatar: 'MR',
    quote: 'Our Cursor agents are 3x more effective now. When they hit roadblocks, Polydev\'s multi-model bridge gets them unstuck instantly.'
  },
  {
    name: 'Sam Thompson',
    role: 'DevOps Engineer',
    avatar: 'ST',
    quote: 'Perfect for agentic workflows. My agents call Polydev whenever they need diverse AI perspectives to solve complex problems.'
  }
]

const stats = [
  { value: '10M+', label: 'Agent Queries Resolved' },
  { value: '500+', label: 'Connected Clients' },
  { value: '22+', label: 'AI Providers Supported' },
  { value: '< 2s', label: 'Multi-Model Response Time' }
]

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()
  const [typedText, setTypedText] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  
  const words = ['AI agents', 'agentic workflows', 'Claude Code', 'Cursor AI', 'agent developers']
  
  useEffect(() => {
    const word = words[currentWordIndex]
    let charIndex = 0
    const typingInterval = setInterval(() => {
      if (charIndex <= word.length) {
        setTypedText(word.substring(0, charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          const erasingInterval = setInterval(() => {
            if (charIndex > 0) {
              setTypedText(word.substring(0, charIndex - 1))
              charIndex--
            } else {
              clearInterval(erasingInterval)
              setCurrentWordIndex((prev) => (prev + 1) % words.length)
            }
          }, 50)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [currentWordIndex])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200/60 dark:border-blue-700/60">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Ship faster with Multiple AI
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Never get{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
                stuck
              </span>{' '}
              again
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              The open-source MCP server that gives AI agents breakthrough perspectives. 
              When stuck, get diverse solutions from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="mr-2">Open Dashboard</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/chat"
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Try MCP Tool
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="mr-2">Get started for free</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/docs"
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Read docs
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              The MCP server that{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                never gives up
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
              When your AI agents hit roadblocks, our MCP bridge connects them to the collective intelligence 
              of multiple frontier models for instant breakthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    {feature.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Integration Preview */}
          <div className="mt-24 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                One MCP server, endless possibilities
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Integrate with any MCP-compatible client in minutes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Claude Code</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Desktop AI assistant</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Cursor AI</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Code editor agent</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛠️</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Your Agent</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Custom MCP client</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Watch the magic{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                happen
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light mb-12">
              See how agents call our MCP tool to get breakthrough perspectives from multiple AI models in real-time.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-2 max-w-5xl mx-auto">
            <div className="bg-slate-950 dark:bg-slate-900 rounded-2xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-800 dark:bg-slate-800 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-slate-400 text-sm font-medium">Claude Code MCP Call</div>
                </div>
                <div className="text-xs text-slate-500 font-mono">polydev.ai</div>
              </div>
              
              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm space-y-3 text-white">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-400 shrink-0">Agent</span>
                  <span className="text-slate-300">Calling MCP tool get_perspectives...</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span className="text-slate-300">Connected to Polydev Perspectives server</span>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4 my-4">
                  <div className="text-slate-400 text-xs mb-2">PROMPT</div>
                  <div className="text-white">"React component re-renders excessively, can't find the root cause despite using useMemo"</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-400 shrink-0 font-semibold">GPT-4</span>
                    <div className="text-slate-300">
                      <div className="mb-1">Check useMemo dependencies and props spreading patterns...</div>
                      <div className="text-xs text-slate-500">•••</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-cyan-400 shrink-0 font-semibold">Claude</span>
                    <div className="text-slate-300">
                      <div className="mb-1">Look for object recreations in parent component renders...</div>
                      <div className="text-xs text-slate-500">•••</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 shrink-0 font-semibold">Groq</span>
                    <div className="text-slate-300">
                      <div className="mb-1">Consider React.memo and callback optimization patterns...</div>
                      <div className="text-xs text-slate-500">•••</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 pt-4 border-t border-slate-700">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span className="text-green-300 font-medium">Breakthrough achieved in 1.8s</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <span>3 perspectives • 847 tokens • $0.023</span>
                  <span className="text-green-400">●  Connected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href={isAuthenticated ? "/chat" : "/auth"}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mr-4"
            >
              <span className="mr-2">Try it yourself</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/docs"
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View integration guide
            </Link>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Built by developers,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                for developers
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
              See how teams are shipping faster with our MCP server in their agentic workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/5 dark:to-purple-900/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Rating stars */}
                  <div className="flex mt-6 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Join 500+ developers already shipping faster
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
              Stop getting{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
                stuck
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
              Give your AI agents the superpower of multiple perspectives. 
              <br className="hidden md:block" />
              Integrate our MCP server and never hit a roadblock again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/auth"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-medium text-slate-900 bg-white rounded-2xl hover:bg-slate-100 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              <span className="mr-3">Start building for free</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              href="/docs"
              className="group inline-flex items-center justify-center px-10 py-5 text-xl font-medium text-white bg-white/10 border-2 border-white/30 rounded-2xl hover:bg-white/20 hover:border-white/40 transition-all duration-200 backdrop-blur-sm"
            >
              View integration docs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-slate-400">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Open source</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No vendor lock-in</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>2-minute setup</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}