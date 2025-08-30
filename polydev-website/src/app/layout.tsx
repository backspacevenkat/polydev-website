import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/posthog-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Polydev AI - Multi-LLM Orchestration Platform",
  description: "Access 100+ AI models with intelligent routing. Get the best answer from GPT-5, Claude 4.1, Gemini 2.5 Pro and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
