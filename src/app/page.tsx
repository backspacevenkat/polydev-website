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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8">
              MCP Bridge for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              When AI agents get stuck, Polydev bridges the gap with diverse perspectives from 22+ models. 
              Purpose-built MCP server for agentic workflows and agent breakthroughs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Go to Dashboard →
                  </Link>
                  <Link
                    href="/chat"
                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200"
                  >
                    Start Chatting
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Get Started Free →
                  </Link>
                  <Link
                    href="/docs"
                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200"
                  >
                    View Documentation
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              When agents get stuck, we bridge the gap
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Polydev Perspectives is the MCP server that helps AI agents overcome roadblocks 
              with diverse perspectives from multiple frontier models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <div className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {feature.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Agent breakthrough in action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
              See how agents call our MCP tool to get multiple expert perspectives when stuck on complex problems.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white font-mono text-sm">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 text-gray-400">Agent MCP Tool Call</div>
              </div>
              <div className="space-y-3">
                <div className="text-blue-400">Agent: Calling get_perspectives MCP tool...</div>
                <div className="text-green-400">✓ Connected to Polydev Perspectives server</div>
                <div className="text-white">Prompt: "React component re-renders excessively, can't find cause"</div>
                <div className="text-purple-400">GPT-4: Check useMemo dependencies and props spreading...</div>
                <div className="text-cyan-400">Claude: Look for object recreations in parent components...</div>
                <div className="text-yellow-400">Groq: Consider React.memo and callback optimization...</div>
                <div className="text-green-400">✓ Agent breakthrough achieved in 1.8s</div>
                <div className="text-gray-400">3 perspectives | 847 tokens | $0.023</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href={isAuthenticated ? "/chat" : "/auth"}
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
            >
              Try it now →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by developers worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers and teams who are building the future with Polydev AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to supercharge your AI workflow?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Join thousands of developers who are building faster, smarter, and more efficiently with Polydev AI.
            Get started in minutes, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200"
            >
              View Pricing
            </Link>
          </div>

          <div className="mt-12 text-blue-100 text-sm">
            ✓ Free 14-day trial  ✓ No setup fees  ✓ Cancel anytime
          </div>
        </div>
      </section>
    </div>
  )
}