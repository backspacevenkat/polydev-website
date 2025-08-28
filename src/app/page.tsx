'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Link from 'next/link'

const features = [
  {
    icon: '🚫',
    title: 'Never Get Stuck',
    description: 'When your agent hits a wall, instantly get diverse perspectives from multiple AI models to break through',
    highlight: 'Breakthrough guaranteed'
  },
  {
    icon: '⚡',
    title: 'Instant Perspectives',
    description: 'Parallel queries to GPT-4, Claude, Gemini, and more — get N viewpoints in under 2 seconds',
    highlight: 'Sub-2s response'
  },
  {
    icon: '🔌',
    title: 'Universal MCP Tool',
    description: 'Single get_perspectives tool works across Claude Desktop, Cursor, Continue, Cline, and any MCP client',
    highlight: 'One tool everywhere'
  },
  {
    icon: '🧠',
    title: 'Project-Aware',
    description: 'Include your codebase context automatically — perspectives understand your specific problem',
    highlight: 'Smart context'
  },
  {
    icon: '🔑',
    title: 'Your Keys, Your Control',
    description: 'Use your own API keys for full access to 20+ providers, or use managed keys for quick start',
    highlight: 'Complete flexibility'
  },
  {
    icon: '💡',
    title: 'Raw Insights',
    description: 'Get unfiltered perspectives from each model — your agent decides which insight leads to breakthrough',
    highlight: 'Pure perspectives'
  }
]

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'AI Agent Developer',
    avatar: 'AC',
    quote: 'Added Polydev MCP server once to Claude Desktop. Now every agent can get second opinions from multiple models with one tool call.'
  },
  {
    name: 'Marcus Rivera',
    role: 'Senior Engineer',
    avatar: 'MR',
    quote: 'Polydev bridges the gap perfectly. Same get_perspectives tool works in Cursor, Continue, and Cline—one key, all clients.'
  },
  {
    name: 'Sam Thompson',
    role: 'DevOps Engineer',
    avatar: 'ST',
    quote: 'Game changer for our team. Agents stay in control but get N raw perspectives to choose from. No hidden judging or merging.'
  }
]

const stats = [
  { value: '100K+', label: 'Perspectives Generated' },
  { value: '500+', label: 'MCP Clients Connected' },
  { value: '22+', label: 'AI Providers Supported' },
  { value: '< 2s', label: 'Bridge Response Time' }
]

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()
  const [typedText, setTypedText] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  
  const words = ['Claude Desktop', 'Cursor', 'Continue', 'Cline', 'Gemini CLI', 'your MCP client']
  
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
              Model Context Protocol (MCP) Server
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
                Never get stuck again
              </span>{' '}
              — bring perspectives to every agent
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              When your AI agent hits a roadblock, Polydev fans out to GPT-4, Claude, Gemini, and more — delivering diverse perspectives instantly to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </p>
            
            <div className="mb-12 text-lg text-slate-500 dark:text-slate-400">
              <span className="font-medium">One MCP tool. Multiple AI minds. Instant breakthroughs.</span>
            </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 via-blue-50/20 to-cyan-50/30 dark:from-violet-900/10 dark:via-blue-900/10 dark:to-cyan-900/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
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

          {/* MCP Clients Section */}
          <div className="mt-24 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Works with all major MCP clients
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                One setup. Universal compatibility. Bring Polydev to any MCP-enabled environment.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="group text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-2xl font-bold text-orange-600">C</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Claude Desktop</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">MCP native</p>
              </div>
              
              <div className="group text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-2xl">🖱️</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Cursor</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Code Editor</p>
              </div>
              
              <div className="group text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-2xl font-bold text-blue-600">→</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Continue</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">VS Code extension</p>
              </div>
              
              <div className="group text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-2xl font-bold text-green-600">C</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Cline</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">VS Code agent</p>
              </div>
              
              <div className="group text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-2xl font-bold text-purple-600">G</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Gemini CLI</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Command line</p>
              </div>
              
              <div className="group text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-2xl">🛠️</span>
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Your Client</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Custom MCP</p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-700/50 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                MCP protocol by Anthropic — open source, vendor neutral
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 bg-gradient-to-br from-violet-50 via-blue-50/50 to-cyan-50/30 dark:from-slate-900 dark:via-indigo-900/20 dark:to-slate-900">
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

      {/* Pricing Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Simple{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                message-based
              </span>{' '}
              pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
              Pay only for what you use. No tokens to count. No complex calculations. Just messages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Starter</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
                <ul className="text-slate-600 dark:text-slate-400 space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    100 messages/month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    3 models per query
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic models included
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    All MCP clients
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Get started free
                </Link>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="relative bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Pro</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">$15</span>
                  <span className="text-slate-600 dark:text-slate-400">/month</span>
                </div>
                <ul className="text-slate-600 dark:text-slate-400 space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    2,500 messages/month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 5 models per query
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Premium models (GPT-4, Claude)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    BYO API keys option
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Start Pro trial
                </Link>
              </div>
            </div>

            {/* Enterprise Tier */}
            <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">Custom</span>
                </div>
                <ul className="text-slate-600 dark:text-slate-400 space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited messages
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom model routing
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Private deployments
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SLA guarantees
                  </li>
                </ul>
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              All plans include access to all supported MCP clients and basic models.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Messages counted per model response. Query with 3 models = 3 messages consumed.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Documentation Section */}
      <section className="py-32 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                developers
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light">
              Simple MCP tool schema. Clean JSON responses. Comprehensive documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Tool Schema */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">MCP Tool Schema</h3>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-slate-400">get_perspectives</span>
                </div>
                <pre className="p-6 text-sm text-slate-300 font-mono leading-relaxed overflow-x-auto">
{`{
  "name": "get_perspectives",
  "description": "Get diverse perspectives from multiple LLMs",
  "inputSchema": {
    "type": "object",
    "properties": {
      "prompt": {
        "type": "string",
        "description": "Problem description or question"
      },
      "models": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Models to query (optional)"
      },
      "user_token": {
        "type": "string", 
        "description": "Polydev auth token"
      }
    },
    "required": ["prompt", "user_token"]
  }
}`}
                </pre>
              </div>
            </div>

            {/* Response Format */}
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Response Format</h3>
              <div className="bg-slate-900 dark:bg-slate-950 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-xs text-slate-400">JSON response</span>
                </div>
                <pre className="p-6 text-sm text-slate-300 font-mono leading-relaxed overflow-x-auto">
{`{
  "perspectives": [
    {
      "model": "gpt-4",
      "response": "Your React component is likely...",
      "tokens": 156,
      "latency": 1200
    },
    {
      "model": "claude-3-sonnet", 
      "response": "The performance issue stems from...",
      "tokens": 189,
      "latency": 980
    }
  ],
  "total_latency": 1247,
  "total_tokens": 345,
  "cost": 0.023
}`}
                </pre>
              </div>
            </div>

            {/* Quick Start Examples */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                  Quick Start Examples
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Claude Desktop */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-orange-600 font-bold text-sm">C</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Claude Desktop</h4>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 text-sm">
                      <div className="text-slate-400 text-xs mb-2">config.json</div>
                      <pre className="text-slate-300 font-mono text-xs overflow-x-auto">
{`{
  "mcpServers": {
    "polydev": {
      "command": "node",
      "args": ["path/to/polydev-server.js"],
      "env": {
        "POLYDEV_API_URL": "https://polydev.ai/api"
      }
    }
  }
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Continue */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">→</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Continue.dev</h4>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 text-sm">
                      <div className="text-slate-400 text-xs mb-2">.continue/config.json</div>
                      <pre className="text-slate-300 font-mono text-xs overflow-x-auto">
{`{
  "experimental": {
    "modelContextProtocol": true
  },
  "mcpServers": {
    "polydev": {
      "command": "node",
      "args": ["./polydev-mcp-server.js"]
    }
  }
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Usage Example */}
                  <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Usage in Agent</h4>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <div className="text-slate-400 text-xs mb-2">Tool Call Example</div>
                      <pre className="text-slate-300 font-mono text-sm overflow-x-auto">
{`// When your agent gets stuck:
const result = await callTool({
  name: "get_perspectives",
  arguments: {
    prompt: "React component re-renders excessively, can't find root cause",
    user_token: "poly_your_token_here",
    models: ["gpt-4", "claude-3-sonnet", "gemini-pro"]
  }
});

// Process multiple perspectives
const breakthrough = analyzeCommonPatterns(result.perspectives);
return implementSolution(breakthrough);`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Link
                    href="/docs"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    View full documentation →
                  </Link>
                </div>
              </div>
            </div>
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