# Polydev AI Website

Advanced Model Context Protocol platform with multi-LLM integration, OAuth bridges, and comprehensive tooling for AI development.

## Features

- **Multi-LLM Integration**: Support for multiple language models
- **Model Context Protocol (MCP)**: Advanced tooling integration
- **OAuth Bridges**: Secure authentication flows
- **Analytics**: PostHog integration for user tracking
- **Monitoring**: BetterStack integration for system health
- **Caching**: Upstash Redis for performance optimization
- **Authentication**: Supabase integration

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Analytics**: PostHog
- **Monitoring**: BetterStack
- **Caching**: Upstash Redis
- **Auth**: Supabase
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# BetterStack Logging
BETTERSTACK_LOGS_TOKEN=your_betterstack_token
```

## Health Check

The application includes a health check endpoint at `/api/health` for monitoring purposes.# Trigger deployment from new clean repository
