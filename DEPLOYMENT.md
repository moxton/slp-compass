# SLP Compass Deployment Guide

This guide will walk you through deploying SLP Compass to Vercel with Supabase integration.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)
- OpenAI API key

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `slp-compass`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Set Up Database Schema

Once your project is created, go to the SQL Editor and run the following migrations:

```sql
-- Create therapy_plans table
CREATE TABLE therapy_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  patient_data JSONB NOT NULL,
  long_term_goal TEXT NOT NULL,
  objectives JSONB NOT NULL,
  treatment_protocol JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE therapy_plans ENABLE ROW LEVEL SECURITY;

-- Users can only see their own therapy plans
CREATE POLICY "Users can view own therapy plans" ON therapy_plans
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own therapy plans
CREATE POLICY "Users can insert own therapy plans" ON therapy_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own therapy plans
CREATE POLICY "Users can update own therapy plans" ON therapy_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_therapy_plans_updated_at
  BEFORE UPDATE ON therapy_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 1.3 Set Up Authentication (Optional)

If you want user authentication:

1. Go to Authentication > Settings
2. Configure your site URL (will be your Vercel domain)
3. Add redirect URLs for your Vercel domain
4. Configure email templates if needed

### 1.4 Deploy Edge Functions

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. Deploy the Edge Functions:
   ```bash
   supabase functions deploy generate-therapy-plan
   supabase functions deploy generate-treatment-protocol
   ```

### 1.5 Set Environment Variables in Supabase

Go to Settings > API and copy:
- Project URL
- Anon public key

Then go to Settings > Edge Functions and add:
- `OPENAI_API_KEY`: Your OpenAI API key

## Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.2 Set Environment Variables

In your Vercel project settings, add these environment variables:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_URL=https://api.openai.com/v1
VITE_APP_NAME=SLP Compass
VITE_APP_VERSION=1.0.0
```

### 2.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Step 3: Configure Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update your Supabase authentication settings with the new domain

## Step 4: Test the Deployment

1. Visit your deployed app
2. Test the patient input form
3. Verify therapy plan generation works
4. Check that data is being saved to Supabase

## Troubleshooting

### Common Issues

**Edge Functions not found**
- Make sure you've deployed the Edge Functions to Supabase
- Check that the function names match exactly

**CORS errors**
- Verify your Supabase project URL is correct
- Check that CORS headers are properly set in Edge Functions

**OpenAI API errors**
- Verify your OpenAI API key is set in Supabase Edge Functions
- Check your OpenAI account has sufficient credits

**Build failures**
- Check that all dependencies are in package.json
- Verify TypeScript compilation passes locally

### Environment Variables Checklist

**Vercel:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_URL`
- `VITE_APP_NAME`
- `VITE_APP_VERSION`

**Supabase Edge Functions:**
- `OPENAI_API_KEY`

### Performance Optimization

1. **Enable Vercel Analytics** (optional)
2. **Set up caching headers** in vercel.json
3. **Optimize images** using Vercel's image optimization
4. **Monitor performance** using Vercel Analytics

## Security Considerations

1. **API Keys**: Never expose OpenAI API keys in client-side code
2. **Row Level Security**: Ensure RLS policies are properly configured
3. **CORS**: Configure CORS settings appropriately
4. **HTTPS**: Vercel provides HTTPS by default
5. **Environment Variables**: Use Vercel's environment variable encryption

## Monitoring and Maintenance

1. **Set up Vercel Analytics** for performance monitoring
2. **Configure error tracking** (e.g., Sentry)
3. **Set up Supabase monitoring** for database performance
4. **Regular backups** of your Supabase database
5. **Monitor API usage** for OpenAI costs

## Next Steps

After successful deployment:

1. **Set up monitoring and analytics**
2. **Configure error tracking**
3. **Set up automated backups**
4. **Plan for scaling** as user base grows
5. **Prepare for monetization** (Stripe integration)

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Check the [Supabase documentation](https://supabase.com/docs)
3. Review the application logs in Vercel dashboard
4. Check Supabase logs in the dashboard
5. Create an issue in the GitHub repository 