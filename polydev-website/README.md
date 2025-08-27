# 🚀 Polydev AI - Modern Website

> **Modern, responsive website for Polydev AI - the Multi-LLM Orchestration Platform**

Beautiful landing page with authentication, dashboard, and API key management for accessing 100+ AI models with intelligent routing.

## ✨ Features

### 🎨 **Modern Design**
- **Animated backgrounds** - Mouse-following gradients and smooth transitions
- **Framer Motion animations** - Smooth page transitions and micro-interactions
- **Dark theme** - Professional dark UI with gradients and glassmorphism
- **Mobile responsive** - Optimized for all screen sizes

### 🔐 **Complete Authentication**
- **Email/Password signup** - Traditional authentication flow
- **OAuth providers** - GitHub and Google OAuth integration
- **Supabase Auth** - Secure authentication with row-level security
- **Protected routes** - Middleware-based route protection

### 📊 **User Dashboard**
- **Usage analytics** - Track queries, costs, and model usage
- **Subscription management** - Free, Pro, Enterprise tiers
- **API key management** - Secure key storage and management
- **Real-time updates** - Live usage tracking and notifications

### 🔧 **Technical Stack**
- **Next.js 15** - App Router with React Server Components
- **TypeScript** - Full type safety throughout
- **Supabase** - Database, authentication, and real-time subscriptions
- **Tailwind CSS** - Utility-first styling with custom animations
- **Framer Motion** - Smooth animations and gestures

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Set up Supabase**
1. Create a new Supabase project
2. Run the SQL from `supabase-schema.sql`
3. Configure OAuth providers (GitHub, Google)
4. Update environment variables

### 3. **Configure Environment Variables**
Copy `.env.local` and fill in your values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. **Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## 📱 Pages & Features

### **Landing Page (`/`)**
- Hero section with animated backgrounds
- Feature highlights with icons and descriptions  
- Pricing tiers with clear value propositions
- Stats showcase (100+ models, 10K+ developers, 99.9% uptime)

### **Authentication (`/auth`)**
- Toggle between Sign Up and Sign In
- Email/password authentication with validation
- GitHub and Google OAuth buttons
- Error handling and success messages
- Responsive split-screen design

### **Dashboard (`/dashboard`)**
- **Overview Tab**: Usage stats, subscription info, quick actions
- **API Keys Tab**: Manage OpenRouter, OpenAI, Anthropic, Google keys
- **Analytics Tab**: Usage metrics, cost tracking, model performance
- **Settings Tab**: Profile management, preferences

## 🗄️ Database Schema

### **Subscription Tiers**
| Tier | Monthly Queries | Price | Features |
|------|----------------|-------|----------|
| **Free** | 50 | $0 | Basic routing, 3 models |
| **Pro** | 1,000 | $29 | All models, analytics |
| **Enterprise** | 10,000 | $99 | Priority support, teams |

## 🚀 Deployment

### **Vercel Deployment**
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

## 📚 Documentation

- `SUPABASE_SETUP.md` - Complete Supabase configuration guide
- `supabase-schema.sql` - Database schema and policies
- Component documentation in code comments

## 🔗 Integration with Multi-LLM Platform

This website serves as the frontend for the larger Polydev AI platform at `/Users/venkat/Documents/jarvis/multi-llm-platform/`.

---

**The future of AI orchestration starts here! 🌟**

*Built with ❤️ by the Polydev team*

*Powered by Next.js • Supabase • Vercel • OpenRouter*
