# Firebase to Supabase Migration Guide

## Overview
This document outlines the migration from Firebase to Supabase for authentication and database operations in FaceHeal AI.

## Changes Made

### 1. **Dependencies**
- ❌ Removed: `firebase` package (v12.6.0)
- ✅ Added: `@supabase/supabase-js` (v2.82.0)

### 2. **Environment Variables**
Updated `.env.example` to use only Supabase configuration:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Feature Flags
EXPO_PUBLIC_ENABLE_EMAIL_AUTH=true
EXPO_PUBLIC_ENABLE_GOOGLE_AUTH=true
EXPO_PUBLIC_ENABLE_PASSWORD_RESET=true
EXPO_PUBLIC_ENABLE_SUPABASE_DATA=true
EXPO_PUBLIC_ENABLE_PROFILE_UPLOAD=true
EXPO_PUBLIC_ENABLE_SKIN_SCAN=true
EXPO_PUBLIC_ENABLE_ONBOARDING=true

# App Configuration
EXPO_PUBLIC_APP_URL=exp://localhost:8081
```

### 3. **Updated Files**

#### **context/authContext.tsx**
- Changed from Firebase User type to Supabase User type
- Updated auth state management to use Supabase `onAuthStateChange`
- Methods now use Supabase auth functions:
  - `signUp()` → Uses Supabase auth.signUp
  - `signIn()` → Uses Supabase auth.signInWithPassword
  - `logout()` → Uses Supabase auth.signOut
- Added `session` state alongside `user` for better session handling

#### **app/_layout.tsx**
- Removed Firebase initialization import (`import '@/services/firebase'`)
- Supabase is initialized automatically when imported from services

#### **app/auth.tsx**
- Changed imports from Firebase to Supabase service
- Removed Google redirect handling (Supabase handles this in auth context)
- Updated error handling to use Supabase error messages

#### **app/(tabs)/settings.tsx**
- Removed direct Firebase import
- Now uses `useAuth()` hook from authContext
- Simplified logout logic - calls `logout()` from auth context

#### **app/(tabs)/analysis.tsx**
- Changed from Firebase `auth` object to `useAuth()` hook
- Replaced Firestore save with Supabase placeholder
- User ID accessed via `user?.id` instead of `auth.currentUser?.uid`

### 4. **Services**

#### **services/firebase.ts**
⚠️ This file is no longer used. It remains in the repository for reference but should be deleted once migration is complete.

#### **services/supabase.ts** (Already exists)
Already contains all Supabase authentication and database functions:
- Authentication: signUp, signIn, signOut, resetPassword, signInWithGoogle
- User Profiles: CRUD operations
- Skin Scans: Upload and retrieval
- Onboarding Data: Save and retrieve
- User Pictures: Upload and retrieve

## Setup Instructions

### 1. **Update Environment Variables**
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

To get these values:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon key

### 2. **Create Database Tables**
Run this SQL in your Supabase SQL Editor:

```sql
-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Skin Scans Table
CREATE TABLE skin_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  analysis_result TEXT,
  skin_type TEXT,
  condition_notes TEXT,
  score NUMERIC,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Onboarding Data Table
CREATE TABLE onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  skin_type TEXT NOT NULL,
  skin_concerns TEXT[] NOT NULL,
  allergies TEXT[],
  medications TEXT[],
  goals TEXT[] NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- User Pictures Table
CREATE TABLE user_pictures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  picture_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_skin_scans_user_id ON skin_scans(user_id);
CREATE INDEX idx_onboarding_data_user_id ON onboarding_data(user_id);
CREATE INDEX idx_user_pictures_user_id ON user_pictures(user_id);
```

### 3. **Enable Row Level Security (RLS)**

```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pictures ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
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

-- Onboarding Data Policies
CREATE POLICY "Users can read their own onboarding" ON onboarding_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own onboarding" ON onboarding_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Pictures Policies
CREATE POLICY "Users can read their own pictures" ON user_pictures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pictures" ON user_pictures
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. **Create Storage Buckets**

In Supabase Dashboard → Storage:

1. **skin-scans**
   - Public access: Yes
   - Max file size: 50MB

2. **user-pictures**
   - Public access: Yes
   - Max file size: 50MB

### 5. **Enable Authentication Methods**

In Supabase Dashboard → Authentication:

1. Providers → Email (should be enabled by default)
2. Providers → Google (optional, if you want Google sign-in)
3. Configure redirect URLs:
   - `exp://localhost:8081/auth/callback`
   - `exp://your-app-name/auth/callback`

## API Reference

### Authentication

```typescript
import { signUp, signIn, signOut, resetPassword, signInWithGoogle } from '@/services/supabase';

// Sign Up
const { data, error } = await signUp(email, password);

// Sign In
const { data, error } = await signIn(email, password);

// Sign Out
const { error } = await signOut();

// Reset Password
const { data, error } = await resetPassword(email);

// Google Sign-In
const { data, error } = await signInWithGoogle();
```

### User Data

```typescript
import { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile,
  uploadSkinScan,
  getSkinScans,
  saveOnboardingData,
  getOnboardingData 
} from '@/services/supabase';

// User Profile
const { data, error } = await createUserProfile(userId, profileData);
const { data, error } = await getUserProfile(userId);
const { data, error } = await updateUserProfile(userId, updates);

// Skin Scans
const { data, error } = await uploadSkinScan(userId, imageFile, analysisData);
const { data, error } = await getSkinScans(userId);

// Onboarding
const { data, error } = await saveOnboardingData(userId, onboardingData);
const { data, error } = await getOnboardingData(userId);
```

## Key Differences from Firebase

| Feature | Firebase | Supabase |
|---------|----------|----------|
| Auth User ID | `user.uid` | `user.id` |
| Auth State | `onAuthStateChanged()` | `onAuthStateChange()` |
| Database | Firestore (NoSQL) | PostgreSQL (SQL) |
| Storage | Google Cloud Storage | S3-compatible |
| RLS | Firestore Rules | PostgreSQL Policies |
| Session Handling | Token-based | JWT-based |

## Cleanup Tasks

1. ✅ Update imports across app (DONE)
2. ✅ Update context/authContext.tsx (DONE)
3. ✅ Update .env.example (DONE)
4. ✅ Install Supabase package (DONE)
5. ⏳ Test authentication flow
6. ⏳ Test sign-up/sign-in/logout
7. ⏳ Test password reset
8. ⏳ Test Google sign-in
9. ⏳ Delete services/firebase.ts (after testing)
10. ⏳ Remove Firebase config files (.firebaserc, firebase.json)
11. ⏳ Run `npm audit fix` to address vulnerabilities

## Testing Checklist

- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign out and verify redirect
- [ ] Password reset flow
- [ ] Google sign-in (if enabled)
- [ ] Create user profile after signup
- [ ] Save and retrieve user data
- [ ] Upload skin scan
- [ ] Save onboarding data
- [ ] Verify RLS policies work correctly

## Troubleshooting

### "Supabase URL or Key not set"
- Ensure `.env.local` has `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Restart the app after updating environment variables

### "User not found" or "Invalid credentials"
- Check that user was created in Supabase Auth
- Verify email/password are correct

### "CORS error" when uploading files
- Check storage bucket permissions
- Ensure bucket is public or has correct RLS policies

### Google sign-in not working
- Verify OAuth provider is enabled in Supabase
- Check redirect URLs are configured correctly
- Test with web browser first before native app

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
