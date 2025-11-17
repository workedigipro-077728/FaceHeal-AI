# Supabase Setup Guide

## Database Tables

Run this SQL in your Supabase SQL Editor to create the required tables:

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

-- Create indexes for better query performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_skin_scans_user_id ON skin_scans(user_id);
CREATE INDEX idx_onboarding_data_user_id ON onboarding_data(user_id);
CREATE INDEX idx_user_pictures_user_id ON user_pictures(user_id);
```

## Storage Buckets

Create these storage buckets in Supabase:

1. **skin-scans** - For skin scan images
   - Public access: Yes
   - Max file size: 50MB

2. **user-pictures** - For user profile and other pictures
   - Public access: Yes
   - Max file size: 50MB

## Row Level Security (RLS) Policies

Enable RLS on all tables and add policies:

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

## Usage Example

```typescript
import { useUserData } from '@/hooks/useUserData';

export default function MyComponent() {
  const { uploadScan, getScans, saveOnboarding } = useUserData();

  // Upload a scan
  const handleUploadScan = async (imageFile: File) => {
    const { data, error } = await uploadScan(imageFile, {
      skin_type: 'oily',
      condition_notes: 'Some acne',
      score: 75,
    });
    
    if (error) {
      console.error('Upload failed:', error);
    } else {
      console.log('Scan uploaded:', data);
    }
  };

  // Get all scans
  const handleGetScans = async () => {
    const { data, error } = await getScans();
    if (error) {
      console.error('Failed to fetch scans:', error);
    } else {
      console.log('Scans:', data);
    }
  };

  // Save onboarding data
  const handleSaveOnboarding = async () => {
    const { data, error } = await saveOnboarding({
      skin_type: 'combination',
      skin_concerns: ['acne', 'dryness'],
      goals: ['clear skin', 'hydration'],
    });
    
    if (error) {
      console.error('Save failed:', error);
    } else {
      console.log('Onboarding saved:', data);
    }
  };

  return (
    <View>
      {/* Your UI here */}
    </View>
  );
}
```

## Summary

- **Firebase**: Authentication only (email/password, Google login)
- **Supabase**: User data, scans, onboarding, pictures
- All data is private (RLS enforced per user)
- Images stored in public buckets for fast access
