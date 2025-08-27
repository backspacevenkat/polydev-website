# Supabase Setup Guide for Polydev AI

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project:
   - Project name: `Polydev AI`
   - Database password: Generate a secure password
   - Region: Choose closest to your users

## 2. Configure Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script to create all tables, policies, and functions

## 3. Configure Authentication

### Enable OAuth Providers

1. Go to Authentication → Providers in your Supabase dashboard

#### GitHub OAuth
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - Application name: `Polydev AI`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-supabase-project.supabase.co/auth/v1/callback`
3. Copy the Client ID and Client Secret
4. In Supabase, enable GitHub provider and paste the credentials

#### Google OAuth  
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Configure consent screen
6. Set authorized redirect URIs: `https://your-supabase-project.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. In Supabase, enable Google provider and paste the credentials

## 4. Update Environment Variables

Update your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Get these from your Supabase project dashboard → Settings → API
```

## 5. Configure Row Level Security (RLS)

The SQL script already sets up RLS policies, but verify:

1. Go to Table Editor in Supabase dashboard
2. Check each table has RLS enabled:
   - `profiles` ✅
   - `api_keys` ✅ 
   - `usage_analytics` ✅

## 6. Test Authentication

1. Run your Next.js app: `npm run dev`
2. Go to `/auth` page
3. Try signing up with email
4. Try OAuth with GitHub/Google
5. Check if user appears in Authentication → Users in Supabase dashboard
6. Verify profile is created in `profiles` table

## 7. Configure Email Templates (Optional)

1. Go to Authentication → Templates
2. Customize email templates for:
   - Confirm signup
   - Reset password
   - Magic link

## 8. Set Up Realtime (Optional)

If you want real-time updates:

1. Go to Database → Replication
2. Enable realtime for tables that need it
3. Update your app to use Supabase realtime subscriptions

## 9. Production Considerations

### Security
- Enable database SSL connections
- Set up proper CORS origins
- Use environment-specific Supabase projects (dev/staging/prod)

### Backup
- Enable automatic backups in Supabase dashboard
- Set up point-in-time recovery

### Monitoring
- Set up alerts for error rates
- Monitor database performance
- Set up log retention

## 10. Deployment to Vercel

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy and test production authentication

## Troubleshooting

### Common Issues

**Authentication redirect not working:**
- Check OAuth callback URLs match exactly
- Verify Supabase project URL in environment variables

**User profile not created:**
- Check if trigger `on_auth_user_created` is working
- Verify RLS policies allow profile insertion

**API keys not showing:**
- Check RLS policies on `api_keys` table
- Verify user authentication state

### Useful SQL Queries

```sql
-- Check if user profiles are being created
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE schemaname = 'public';

-- Reset user queries count (for testing)
UPDATE public.profiles SET queries_used = 0 WHERE id = 'user-uuid-here';
```

## Next Steps

Once Supabase is set up:

1. Test all authentication flows
2. Create API key management functionality
3. Implement usage analytics tracking
4. Set up Stripe for subscription management
5. Deploy to production