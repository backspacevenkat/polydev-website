import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '@/components/posthog-provider'
import Navigation from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Polydev - MCP Router for Multiple AI Perspectives',
  description: 'MCP server that fans out queries to multiple LLMs in parallel. Get diverse perspectives from GPT-4, Claude, Gemini and more. Works with Claude Desktop, Cursor, Continue, Cline.',
  keywords: 'MCP, Model Context Protocol, Multi-LLM, AI perspectives, Claude Desktop, Cursor, Continue, Cline, AI agents, perspectives, breakthrough',
  authors: [{ name: 'Polydev' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Polydev - Bring Second Opinions to Every Agent',
    description: 'MCP server that fans out queries to multiple LLMs in parallel. Add Polydev once; carry it everywhere.',
    url: 'https://polydev.ai',
    siteName: 'Polydev',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polydev - MCP Router for Multiple AI Perspectives',
    description: 'Get diverse perspectives from multiple LLMs. Works with all major MCP clients.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans text-slate-900 bg-white selection:bg-violet-100 selection:text-violet-900">
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