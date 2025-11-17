// User Profile
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  profile_picture_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// Skin Scan
export interface SkinScan {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url?: string;
  analysis_result?: string;
  skin_type?: string;
  condition_notes?: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

// Onboarding Data
export interface OnboardingData {
  id: string;
  user_id: string;
  skin_type: string;
  skin_concerns: string[];
  allergies?: string[];
  medications?: string[];
  goals: string[];
  completed_at: string;
  created_at: string;
  updated_at: string;
}

// User Pictures
export interface UserPicture {
  id: string;
  user_id: string;
  picture_url: string;
  thumbnail_url?: string;
  category?: string;
  description?: string;
  created_at: string;
}
