# Google Authentication Setup

## Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "healface-ai-pt"
3. Navigate to **Authentication** → **Sign-in method** → **Providers**
4. Click **Google** and enable it
5. Select a project support email
6. Click **Save**

## Step 2: Configure OAuth Consent Screen (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **OAuth consent screen**
4. Choose **External** for User Type
5. Fill in the required fields:
   - App name: "FaceHeal AI"
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
6. Click **Save and Continue**

## Step 3: Add Authorized Domains

1. In Firebase Console → **Authentication** → **Settings**
2. Under "Authorized domains", add:
   - `localhost`
   - `127.0.0.1`
   - `localhost:8081`
   - `localhost:19006`
   - Your production domain (when ready)

## Step 4: Add Test Users (During Development)

1. Firebase Console → **Authentication** → **Sign-in method** → **Google**
2. Under "OAuth 2.0 client IDs", click the Web client
3. In Google Cloud Console → **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Add test users by going to **OAuth consent screen** → **Test users** → **Add users**
6. Add your email as a test user

## Step 5: Test in Development

Run your app with `npm run web` and click the Google sign-in button. You should be able to:
- Sign in with a test user account
- Sign up with a test user account (creates new account)

## Troubleshooting

### "Error: popup-blocked" or "popup-closed-by-user"
- Check if popups are blocked in your browser
- The code automatically falls back to redirect if popup fails

### "Error: configuration-not-found"
- Make sure Google is enabled in Firebase Authentication
- Wait a few minutes for Firebase to propagate settings

### "Error: network-request-failed"
- Check internet connection
- Make sure localhost is in Authorized domains in Firebase Console

### Cannot sign in during testing
- Verify you added your email to Test users
- For public availability, change OAuth consent screen to "Production"

## Usage

The Google sign-in is already integrated in your auth screen (`app/auth.tsx`):

```typescript
const handleGoogleSignIn = async () => {
  const { data, error } = await signInWithGoogle();
  
  if (error) {
    setError(error);
  } else {
    // User signed in, navigate to next screen
    router.push('/payment');
  }
};
```

## How It Works

1. User clicks "Google" button
2. Google popup opens (or redirects if popup blocked)
3. User logs in with Google account
4. Firebase creates/updates user in auth
5. User is logged in to your app
6. Navigate to payment screen

The user can sign up or sign in with the same Google account - Firebase handles both automatically.
