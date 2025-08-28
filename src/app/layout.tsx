import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '@/components/posthog-provider'
import Navigation from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Polydev AI - Multi-LLM MCP Platform',
  description: 'Advanced Model Context Protocol platform with multi-LLM integration, OAuth bridges, and comprehensive tooling for AI development.',
  keywords: 'AI, LLM, MCP, Model Context Protocol, Multi-LLM, OpenAI, Anthropic, Google AI, Meta',
  authors: [{ name: 'Polydev AI' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PostHogProvider>
          <Navigation />
          <main>
            {children}
          </main>
        </PostHogProvider>
      </body>
    </html>
  )
}