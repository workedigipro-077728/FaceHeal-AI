# Feature Flags - Enable/Disable Features

Control which features are active in your app using environment variables. This is useful during development to disable features while building others.

## Quick Start

Add these to your `.env.local` file:

```bash
# Enable all authentication
EXPO_PUBLIC_ENABLE_FIREBASE_AUTH=true
EXPO_PUBLIC_ENABLE_EMAIL_AUTH=true
EXPO_PUBLIC_ENABLE_GOOGLE_AUTH=true
EXPO_PUBLIC_ENABLE_PASSWORD_RESET=true

# Enable Supabase data features
EXPO_PUBLIC_ENABLE_SUPABASE_DATA=true
EXPO_PUBLIC_ENABLE_PROFILE_UPLOAD=true
EXPO_PUBLIC_ENABLE_SKIN_SCAN=true
EXPO_PUBLIC_ENABLE_ONBOARDING=true
```

## Feature Flags

### Authentication

| Flag | Default | Purpose |
|------|---------|---------|
| `EXPO_PUBLIC_ENABLE_FIREBASE_AUTH` | `false` | Enable/disable all Firebase auth |
| `EXPO_PUBLIC_ENABLE_EMAIL_AUTH` | `false` | Enable email/password login |
| `EXPO_PUBLIC_ENABLE_GOOGLE_AUTH` | `false` | Enable Google sign-in |
| `EXPO_PUBLIC_ENABLE_PASSWORD_RESET` | `false` | Enable password reset email |

### Data Features

| Flag | Default | Purpose |
|------|---------|---------|
| `EXPO_PUBLIC_ENABLE_SUPABASE_DATA` | `false` | Enable user data storage |
| `EXPO_PUBLIC_ENABLE_PROFILE_UPLOAD` | `false` | Enable profile picture upload |
| `EXPO_PUBLIC_ENABLE_SKIN_SCAN` | `false` | Enable skin scan feature |
| `EXPO_PUBLIC_ENABLE_ONBOARDING` | `false` | Enable onboarding flow |

## Usage Examples

### Disable During Development
```bash
# Disable auth while building UI
EXPO_PUBLIC_ENABLE_EMAIL_AUTH=false
EXPO_PUBLIC_ENABLE_GOOGLE_AUTH=false
```

### Enable When Ready for Testing
```bash
# Enable everything for testing
EXPO_PUBLIC_ENABLE_FIREBASE_AUTH=true
EXPO_PUBLIC_ENABLE_EMAIL_AUTH=true
EXPO_PUBLIC_ENABLE_GOOGLE_AUTH=true
EXPO_PUBLIC_ENABLE_PASSWORD_RESET=true
EXPO_PUBLIC_ENABLE_SUPABASE_DATA=true
EXPO_PUBLIC_ENABLE_PROFILE_UPLOAD=true
EXPO_PUBLIC_ENABLE_SKIN_SCAN=true
EXPO_PUBLIC_ENABLE_ONBOARDING=true
```

### Production Ready
```bash
# Enable all features for production
EXPO_PUBLIC_ENABLE_FIREBASE_AUTH=true
EXPO_PUBLIC_ENABLE_EMAIL_AUTH=true
EXPO_PUBLIC_ENABLE_GOOGLE_AUTH=true
EXPO_PUBLIC_ENABLE_PASSWORD_RESET=true
EXPO_PUBLIC_ENABLE_SUPABASE_DATA=true
EXPO_PUBLIC_ENABLE_PROFILE_UPLOAD=true
EXPO_PUBLIC_ENABLE_SKIN_SCAN=true
EXPO_PUBLIC_ENABLE_ONBOARDING=true
```

## How It Works

When a feature flag is disabled, the function returns an error:

```typescript
// Example: Disabled email auth
const { data, error } = await signIn('user@example.com', 'password');
// error = "Email authentication is currently disabled"
```

Your UI should handle this gracefully by showing disabled states or hiding buttons.

## Check Feature Status

To check if features are enabled in your component:

```typescript
import { FEATURE_FLAGS } from '@/config/featureFlags';

export default function MyComponent() {
  if (!FEATURE_FLAGS.ENABLE_EMAIL_AUTH) {
    return <Text>Auth is disabled</Text>;
  }

  return <AuthForm />;
}
```

## Development Workflow

1. **Start**: All flags `false` (no features enabled)
2. **Build UI**: Enable flags as you complete features
3. **Test**: Enable all flags to test integration
4. **Deploy**: Keep flags enabled for production

## Important Notes

- Feature flags are set from `.env.local` (not committed to git)
- Flags must be prefixed with `EXPO_PUBLIC_` to be accessible in code
- Changes to `.env.local` require restarting the dev server
- Flags are evaluated at runtime, not build time

## Next Steps

1. Copy `.env.example` to `.env.local`
2. Set feature flags to `true` for features you want to enable
3. Restart dev server: `npm run web` or `npm start`
4. Test your features
