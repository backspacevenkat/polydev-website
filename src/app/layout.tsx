import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '@/components/posthog-provider'

export const metadata: Metadata = {
  title: 'Polydev AI - Multi-LLM MCP Platform',
  description: 'Advanced Model Context Protocol platform with multi-LLM integration, OAuth bridges, and comprehensive tooling for AI development.',
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
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}