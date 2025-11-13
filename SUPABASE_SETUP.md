# Supabase Setup Guide

This app uses Supabase for authentication. Follow these steps to set up your Supabase database:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: Badan Warisan Malaysia App (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## 3. Create Environment Variables

1. Create a `.env` file in the root directory of your project
2. Add the following variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from step 2.

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
```

## 4. Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings if needed (you can use Supabase's default email service for development)

## 5. (Optional) Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Sign up confirmation
   - Password reset
   - Magic link (if using)

## 6. Test Your Setup

1. Start your development server: `npm run dev`
2. Try signing up with a new account
3. Check your Supabase dashboard → **Authentication** → **Users** to see if the user was created

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- The `anon` key is safe to use in client-side code (it's public)
- For production, consider setting up Row Level Security (RLS) policies in Supabase

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file is in the root directory
- Restart your development server after creating/updating `.env`
- Check that variable names start with `VITE_`

### Authentication not working
- Verify your Supabase URL and anon key are correct
- Check the browser console for error messages
- Ensure Email authentication is enabled in Supabase dashboard

### Users not appearing in database
- Check Supabase dashboard → Authentication → Users
- Verify email confirmation settings (you may need to disable email confirmation for testing)

