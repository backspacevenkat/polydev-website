# 🚀 Polydev AI - Complete Deployment Guide

## 📋 Prerequisites Checklist

- [ ] Supabase account ([supabase.com](https://supabase.com))
- [ ] Vercel account ([vercel.com](https://vercel.com)) 
- [ ] GitHub account (for OAuth)
- [ ] Google Cloud Console access (for OAuth)
- [ ] OpenRouter API key (for production)
- [ ] Stripe account (for payments) - optional

## 🗄️ Step 1: Create Supabase Project

### 1.1 Create New Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `Polydev AI`
   - **Database Password**: Generate a secure password (save it!)
   - **Region**: Choose closest to your users (e.g., `US East (N. Virginia)`)
4. Click "Create new project"
5. Wait for project to be ready (~2 minutes)

### 1.2 Get API Keys
1. Go to Settings → API
2. Copy these values (you'll need them later):
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon (public) key**: `eyJ...` 
   - **service_role (secret) key**: `eyJ...`

### 1.3 Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Create a "New query"
3. Copy the entire contents of `supabase-schema.sql` and paste it
4. Click "Run" to execute
5. Verify tables were created in Table Editor:
   - ✅ profiles
   - ✅ api_keys  
   - ✅ usage_analytics

## 🔐 Step 2: Configure OAuth Providers

### 2.1 GitHub OAuth
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Polydev AI`
   - **Homepage URL**: `https://polydev-ai.vercel.app` (or your domain)
   - **Authorization callback URL**: `https://your-project-id.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. In Supabase → Authentication → Providers:
   - Enable GitHub provider
   - Add Client ID and Client Secret
   - Save

### 2.2 Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google+ API (or Google Identity API)
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Configure OAuth consent screen (External, add your email)
6. Create credentials:
   - **Application type**: Web application
   - **Name**: `Polydev AI`
   - **Authorized redirect URIs**: `https://your-project-id.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. In Supabase → Authentication → Providers:
   - Enable Google provider
   - Add Client ID and Client Secret  
   - Save

## 🚀 Step 3: Deploy to Vercel

### 3.1 Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `backspacevenkat/polydev`
4. Select the `polydev-website` folder as root directory
5. Framework preset should auto-detect as "Next.js"

### 3.2 Configure Environment Variables
Add these environment variables in Vercel dashboard:

```bash
# Supabase (from Step 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# OpenRouter (the key you mentioned)
OPENROUTER_API_KEY=sk-or-v1-...your-openrouter-key

# NextAuth (generate random 32+ char string)
NEXTAUTH_SECRET=your-random-32-plus-character-secret
NEXTAUTH_URL=https://your-vercel-app.vercel.app

# Stripe (optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3.3 Deploy
1. Click "Deploy" 
2. Wait for build to complete (~2-3 minutes)
3. Visit your live site!

## 🧪 Step 4: Test Everything

### 4.1 Test Authentication
1. Visit `/auth` on your deployed site
2. Try email signup - should send verification email
3. Try GitHub OAuth - should redirect and work
4. Try Google OAuth - should redirect and work
5. Check Supabase → Authentication → Users to see new users
6. Check Table Editor → profiles to see profile creation

### 4.2 Test Dashboard
1. After signing in, visit `/dashboard`
2. Should see user info and usage stats
3. Try API Keys tab - should be empty initially
4. Try Analytics tab - should show zero usage

## 🔧 Step 5: Production Configuration

### 5.1 Update Site URL in Supabase
1. Go to Authentication → Settings
2. Update Site URL to your Vercel domain: `https://your-app.vercel.app`
3. Add additional redirect URLs if needed

### 5.2 Configure Email Templates
1. Go to Authentication → Templates
2. Customize:
   - Confirm signup email
   - Reset password email
   - Magic link email (optional)

### 5.3 Security Settings
1. Go to Settings → API
2. Enable RLS (Row Level Security) - should already be on
3. Go to Authentication → Settings
4. Configure:
   - Session timeout (default 604800 seconds = 7 days)
   - Refresh token rotation (recommended: enabled)

## 🎯 Step 6: Test Production OpenRouter Integration

Once deployed, you can test the full flow:

1. Sign up for an account
2. Go to Dashboard → API Keys
3. Add your OpenRouter API key
4. The system should now be able to:
   - Route queries to multiple LLM providers
   - Track usage and costs
   - Display analytics

## 🚨 Troubleshooting

### Common Issues

**❌ "Invalid JWT" errors**
- Check that NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Verify site URL in Supabase matches deployed URL

**❌ OAuth redirect not working**
- Double-check callback URLs in GitHub/Google match Supabase exactly
- Ensure no trailing slashes in URLs

**❌ Users not appearing in profiles table**
- Check if the `on_auth_user_created` trigger is working
- Verify RLS policies allow profile insertion

**❌ Vercel build fails**
- Check all environment variables are set
- Verify TypeScript types are correct

### Useful Supabase Queries

```sql
-- Check recent users and profiles
SELECT u.email, u.created_at as user_created, p.created_at as profile_created 
FROM auth.users u 
LEFT JOIN public.profiles p ON u.id = p.id 
ORDER BY u.created_at DESC LIMIT 10;

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public';

-- Reset user query count (testing)
UPDATE public.profiles SET queries_used = 0 WHERE email = 'your-email@example.com';
```

## 🎉 Success! 

Your Polydev AI platform should now be live with:
- ✅ Modern landing page with animations
- ✅ Email + OAuth authentication  
- ✅ Protected user dashboard
- ✅ API key management
- ✅ Usage analytics tracking
- ✅ Subscription management (Free/Pro/Enterprise)

Next steps:
- Add your OpenRouter API key to start routing queries
- Configure Stripe for paid subscriptions
- Set up monitoring and error tracking
- Add custom domain (optional)

---

**Need help?** Check the console logs in your browser developer tools for any errors, or the Vercel function logs for server-side issues.