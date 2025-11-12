const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "AIzaSyChMkgEu760aRDbxS7n6QkOztf9WkH9pdk";
const GEMINI_MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL ?? "gemini-2.0-flash";


if (__DEV__ && !GEMINI_API_KEY) {
  console.warn(
    "[env] Missing EXPO_PUBLIC_GEMINI_API_KEY. Update your .env (see env.example)."
  );
}

export const env = {
  geminiApiKey: GEMINI_API_KEY,
  geminiModel: GEMINI_MODEL,
};

