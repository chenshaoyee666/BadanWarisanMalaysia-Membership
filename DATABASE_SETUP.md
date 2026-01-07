# Database Setup Guide for Profile Data

This guide explains how profile data is stored in your Supabase database.

## Current Implementation

Profile data (name, phone number) is stored in Supabase's **auth.users** table in the `raw_user_meta_data` column (accessible via `user_metadata` in the app).

## How It Works

1. **Sign Up**: When a user signs up, their name and phone number are stored in `user_metadata`
2. **Profile Update**: When a user updates their profile, the data is saved using `supabase.auth.updateUser()`
3. **Data Persistence**: All updates are immediately saved to Supabase and persist across sessions

## Viewing Data in Supabase Dashboard

To view the updated profile data:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click on any user to see their details
4. Scroll down to see **User Metadata** which contains:
   - `full_name`: The user's full name
   - `phone_number`: The user's phone number

## Data Structure

The user metadata is stored as JSON:
```json
{
  "full_name": "John Doe",
  "phone_number": "+60 12-345 6789"
}
```

## Verifying Updates

After updating a profile:
1. The data is immediately saved to Supabase
2. The user session is refreshed automatically
3. The updated data appears in the profile screen
4. You can verify in Supabase dashboard → Authentication → Users

## Optional: Creating a Separate Profiles Table

If you want to store profile data in a separate table for easier querying, you can create a `profiles` table:

### SQL to Create Profiles Table

Run this in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### If You Use a Profiles Table

You would need to update the `updateProfile` function in `AuthContext.tsx` to also update the profiles table:

```typescript
const updateProfile = async (updates: { full_name?: string; phone_number?: string }) => {
  // Update auth user metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: updates,
  });
  
  if (authError) return { error: authError };
  
  // Also update profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user?.id);
  
  return { error: profileError };
};
```

## Current Setup (Recommended for Simple Apps)

The current implementation using `user_metadata` is:
- ✅ Simple and works out of the box
- ✅ No additional tables needed
- ✅ Automatically synced with authentication
- ✅ Perfect for basic profile data

You only need a separate `profiles` table if you:
- Need complex queries on profile data
- Want to store additional profile fields
- Need to join profile data with other tables
- Want more control over profile data structure

