# Supabase Quick Start

## 1. Get Your Supabase Credentials

1. Go to [Supabase](https://supabase.com) and sign in
2. Create a new project or use existing
3. Go to **Settings → API** to find:
   - **Project URL**: Copy this
   - **anon public key**: Copy this

## 2. Update Environment File

Create/update `.env.local` in your project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
EXPO_PUBLIC_APP_URL=exp://localhost:8081
```

## 3. Create Database Tables

In Supabase Dashboard, go to **SQL Editor** and paste:

```sql
-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  profile_picture_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Skin Scans
CREATE TABLE skin_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  analysis_result JSONB,
  skin_type TEXT,
  score NUMERIC,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Onboarding Data
CREATE TABLE onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  skin_type TEXT,
  skin_concerns TEXT[],
  goals TEXT[],
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- User Pictures
CREATE TABLE user_pictures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  picture_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_skin_scans_user_id ON skin_scans(user_id);
CREATE INDEX idx_onboarding_data_user_id ON onboarding_data(user_id);
CREATE INDEX idx_user_pictures_user_id ON user_pictures(user_id);
```

Click **Run** button to execute.

## 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pictures ENABLE ROW LEVEL SECURITY;

-- User Profile Policies
CREATE POLICY "Users can read their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Skin Scans Policies
CREATE POLICY "Users can read their own scans" ON skin_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans" ON skin_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Onboarding Policies
CREATE POLICY "Users can manage their onboarding" ON onboarding_data
  FOR ALL USING (auth.uid() = user_id);

-- User Pictures Policies
CREATE POLICY "Users can manage their pictures" ON user_pictures
  FOR ALL USING (auth.uid() = user_id);
```

## 5. Create Storage Buckets

In **Storage**, create two buckets:

### skin-scans
- **Public**: Toggle ON
- **Max file size**: 50MB

### user-pictures
- **Public**: Toggle ON
- **Max file size**: 50MB

## 6. Configure Authentication

In **Authentication → Providers**:
- ✅ Email (enabled by default)
- Optional: Enable Google for social login

In **Authentication → URL Configuration**:
Add these redirect URLs:
- `exp://localhost:8081/auth/callback`
- `exp://your-app/auth/callback`

## 7. Test It Out

Start your app:
```bash
npm start
```

Try to:
1. **Sign up** with an email and password
2. **Sign in** with the same credentials
3. **Logout** 
4. Verify data in Supabase tables

## Usage Examples

### Sign Up
```typescript
import { signUp } from '@/services/supabase';

const { data, error } = await signUp('user@example.com', 'password123');
if (error) {
  console.error('Sign up failed:', error);
} else {
  console.log('User created:', data.user.id);
}
```

### Sign In
```typescript
import { signIn } from '@/services/supabase';
import { useAuth } from '@/context/authContext';

const { signin } = useAuth();
await signin('user@example.com', 'password123');
// User is now signed in - redirected in auth flow
```

### Save User Profile
```typescript
import { createUserProfile } from '@/services/supabase';

const { data, error } = await createUserProfile(userId, {
  email: 'user@example.com',
  full_name: 'John Doe'
});
```

### Get User Profile
```typescript
import { getUserProfile } from '@/services/supabase';

const { data: profile } = await getUserProfile(userId);
console.log('Profile:', profile);
```

## Common Issues

### ❌ "No env variables"
Make sure `.env.local` is in the root directory and restart the app.

### ❌ "Invalid login credentials"
Double-check email and password match what you signed up with.

### ❌ "Failed to fetch" or CORS errors
Check that your URL/key are correct and the table exists in Supabase.

### ❌ "Permission denied" when accessing data
Enable RLS policies or check your policies match the user ID.

## Next Steps

- Read full [migration guide](./FIREBASE_TO_SUPABASE_MIGRATION.md)
- Check [Supabase docs](https://supabase.com/docs)
- Implement remaining data operations
- Test all auth flows
