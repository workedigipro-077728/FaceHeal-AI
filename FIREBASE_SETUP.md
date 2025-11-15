# Firebase Authentication Setup

## Prerequisites
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Authentication in your Firebase project

## Environment Variables

Add these to your `.env.local` file:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### How to find these values:

1. Go to Firebase Console → Your Project → Settings (⚙️)
2. Scroll to "Your apps" section
3. Click on your web app (or create one)
4. Copy the config object - it will look like:

```javascript
{
  "apiKey": "AIzaSy...",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "1:123456789:web:abcdef123456"
}
```

Map these to the `.env.local` variables above.

## Enable Authentication Methods

In Firebase Console:
1. Go to Authentication → Sign-in method
2. Enable:
   - ✅ Email/Password
   - ✅ Google (optional, for social login)

## Available Functions

### `signUp(email, password)`
Create a new user account with email and password

### `signIn(email, password)`
Sign in existing user with email and password

### `signOut()`
Sign out the current user and clear local storage

### `getCurrentUser()`
Get the currently authenticated user

### `resetPassword(email)`
Send password reset email to user

### `signInWithGoogle()`
Sign in with Google account (requires additional setup with expo-auth-session)

## Firebase Security Rules

Update your Firestore security rules if using Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own documents
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

## Testing

Test the authentication with:
- Email: test@example.com
- Password: Test123!

You can also create test users in Firebase Console → Authentication → Users

## Troubleshooting

### "CORS error" or "Network error"
- Check that your Firebase API key is correct
- Make sure Authentication is enabled in Firebase

### "Too many login attempts"
- Firebase temporarily blocks accounts after multiple failed login attempts
- Wait a few minutes and try again

### Password reset email not received
- Check spam folder
- Make sure your email address is registered with the account
- Verify SMTP settings in Firebase

## Google Sign-In Setup (Optional)

To enable Google sign-in in your app:

1. Go to Firebase → Authentication → Sign-in methods
2. Enable Google sign-in
3. Install and setup `expo-auth-session`:
   ```bash
   expo install expo-auth-session expo-web-browser
   ```
4. Update the `signInWithGoogle()` function in `services/firebase.ts`

## Next Steps

- Test sign up/sign in functionality
- Set up password reset email templates
- Configure user profile data storage (Firestore or Realtime DB)
- Implement additional auth methods (phone, social login)
