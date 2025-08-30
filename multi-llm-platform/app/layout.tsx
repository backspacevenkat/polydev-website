import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polydev - Multi-LLM Platform',
  description: 'Get multiple AI perspectives instantly with OpenRouter integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}