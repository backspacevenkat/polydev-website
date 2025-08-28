import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { PostHogProvider } from '@/components/posthog-provider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
})

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}