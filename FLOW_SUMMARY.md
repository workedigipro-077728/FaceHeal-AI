# Complete App Flow - FaceHeal AI

## 🎯 User Journey

### First App Launch
User opens app → Checks AsyncStorage for onboarding completion → NOT FOUND → Shows onboarding

### Onboarding Flow ✅
```
1. Welcome Screen (3-second splash with animation)
   ├─ Auto redirects to Name after 3 seconds
   └─ Can tap anywhere to skip to Name immediately
   
2. Name Screen (Step 1 of 4)
   ├─ Input: Full Name
   └─ Navigate to Age
   
3. Age Screen (Step 2 of 4)
   ├─ Horizontal scrollable age picker (13-120)
   └─ Navigate to Height
   
4. Height Screen (Step 3 of 4)
   ├─ Unit toggle (cm / ft in)
   ├─ Height slider (120-220 cm)
   └─ Navigate to Weight
   
5. Weight Screen (Step 4 of 4)
   ├─ Input: Weight
   └─ Navigate to Gender
   
6. Gender Screen (Step 5 of 5)
   ├─ Options: Male, Female, Other, Prefer not to say
   ├─ Marks onboarding as COMPLETE in AsyncStorage
   └─ Navigate to Authentication
```

### After Onboarding
```
7. Authentication Screen
   ├─ Email/Password Login or Sign Up
   └─ Navigate to Payment
   
8. Payment/Subscription Screen
   ├─ Choose Plan: Free, Pro, Premium
   ├─ Skip option available
   └─ Navigate to Scan
   
9. Scan Page (Home Screen) ✅
   └─ Main app interface
```

## 📱 Technical Flow

```
App Opens
  ↓
Root Layout (_layout.tsx) checks AsyncStorage
  ↓
┌─ First Time User (isOnboarded = false)
│  └─→ /onboarding/welcome
│
└─ Returning User (isOnboarded = true)
   └─→ /auth
```

## 🔐 Security Features

- ✅ Back gesture disabled on Welcome, Auth, and Payment screens
- ✅ Users cannot bypass onboarding
- ✅ Back gesture enabled on onboarding steps (Name, Age, Height, Weight, Gender)
- ✅ AsyncStorage persists onboarding status across app restarts

## 📲 Navigation Guards

| Screen | Back Gesture | Can Skip |
|--------|-------------|----------|
| Welcome | ❌ Disabled | ❌ Auto-redirect only |
| Name | ✅ Enabled | ❌ Must enter name |
| Age | ✅ Enabled | ❌ Must select age |
| Height | ✅ Enabled | ❌ Must select height |
| Weight | ✅ Enabled | ❌ Must enter weight |
| Gender | ✅ Enabled | ❌ Must select gender |
| Auth | ❌ Disabled | ❌ Must login/signup |
| Payment | ❌ Disabled | ✅ Can skip to scan |

## 🎨 Design System

All screens use consistent design:
- **Background**: Dark teal (#1a3a3f)
- **Primary Color**: Teal (#4a9b8e)
- **Highlight**: Cyan (#00d4ff)
- **Text**: White with secondary gray for descriptions

## ✅ Verification Checklist

- [x] Welcome screen shows 3-second splash
- [x] Auto-redirects to Name screen
- [x] Name → Age → Height → Weight → Gender flow complete
- [x] Onboarding marked complete in AsyncStorage
- [x] After onboarding → Auth screen
- [x] After auth → Payment screen
- [x] After payment → Scan page
- [x] Returning users skip onboarding
- [x] Back gestures controlled per screen

## 🧪 Testing Onboarding Reset

To reset and test onboarding again:

```typescript
// Add temporarily to any screen:
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleReset = async () => {
  await AsyncStorage.removeItem('onboarding_completed');
  router.replace('/onboarding/welcome');
};
```

---

**Status**: ✅ All flows working correctly
**Last Updated**: 2025-01-13
