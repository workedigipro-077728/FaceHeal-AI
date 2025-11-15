import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/authContext';
import { signIn, signUp, resetPassword, signInWithGoogle } from '@/services/firebase';

// Colors
const DARK_BG = '#0f172a';
const SURFACE = '#1e293b';
const TEAL_PRIMARY = '#06b6d4';
const TEAL_DARK = '#0891b2';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const ERROR_COLOR = '#ef4444';
const SUCCESS_COLOR = '#10b981';

export default function AuthScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = isValidEmail(email) && password.length >= 6 && (!isSignUp || password === confirmPassword);

  const handleSignUp = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (!isValidEmail(email)) {
        setError('Please enter a valid email');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const { data, error: signUpError } = await signUp(email, password);

      if (signUpError) {
        setError(signUpError);
        setIsLoading(false);
        return;
      }

      router.push('/payment');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (!isValidEmail(email)) {
        setError('Please enter a valid email');
        setIsLoading(false);
        return;
      }

      if (password.length === 0) {
        setError('Please enter your password');
        setIsLoading(false);
        return;
      }

      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError);
        setIsLoading(false);
        return;
      }

      router.push('/payment');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const { data, error: googleError } = await signInWithGoogle();

      if (googleError) {
        setError(googleError);
        setIsLoading(false);
        return;
      }

      router.push('/payment');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotError('');
    setForgotSuccess(false);
    setForgotLoading(true);

    try {
      if (!isValidEmail(forgotEmail)) {
        setForgotError('Please enter a valid email');
        setForgotLoading(false);
        return;
      }

      const { error: resetError } = await resetPassword(forgotEmail);

      if (resetError) {
        setForgotError(resetError);
        setForgotLoading(false);
        return;
      }

      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setForgotSuccess(false);
      }, 2000);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset email');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <MaterialIcons name="face" size={56} color={TEAL_PRIMARY} />
              </View>
            </View>
            <ThemedText style={styles.title}>FaceHeal AI</ThemedText>
            <ThemedText style={styles.subtitle}>Your Personal Face Health Analyst</ThemedText>
          </View>

          {/* Tab Buttons */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, !isSignUp && styles.activeTab]}
              onPress={() => {
                setIsSignUp(false);
                setError('');
              }}
              disabled={isLoading}
            >
              <ThemedText style={[styles.tabText, !isSignUp && styles.activeTabText]}>Sign In</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.tab, isSignUp && styles.activeTab]}
              onPress={() => {
                setIsSignUp(true);
                setError('');
              }}
              disabled={isLoading}
            >
              <ThemedText style={[styles.tabText, isSignUp && styles.activeTabText]}>Sign Up</ThemedText>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View>
              <ThemedText style={styles.label}>Email Address</ThemedText>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={TEXT_SECONDARY}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={TEXT_SECONDARY}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={TEXT_SECONDARY}
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Input (Sign Up Only) */}
            {isSignUp && (
              <View>
                <ThemedText style={styles.label}>Confirm Password</ThemedText>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="lock" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor={TEXT_SECONDARY}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                </View>
              </View>
            )}

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error" size={16} color={ERROR_COLOR} />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            ) : null}

            {/* Forgot Password Link */}
            {!isSignUp && (
              <Pressable onPress={() => setShowForgotPassword(true)} disabled={isLoading}>
                <ThemedText style={styles.forgotLink}>Forgot Password?</ThemedText>
              </Pressable>
            )}

            {/* Main Action Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  opacity: pressed && isFormValid ? 0.8 : isFormValid ? 1 : 0.6,
                },
              ]}
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={TEXT_PRIMARY} size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>{isSignUp ? 'Create Account' : 'Sign In'}</ThemedText>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <ThemedText style={styles.dividerText}>or continue with</ThemedText>
              <View style={styles.divider} />
            </View>

            {/* Google Sign In Button */}
            <Pressable
              style={({ pressed }) => [styles.googleButton, { opacity: pressed ? 0.8 : 1 }]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <MaterialIcons name="verified-user" size={20} color={TEXT_PRIMARY} />
              <ThemedText style={styles.googleButtonText}>Google</ThemedText>
            </Pressable>

            {/* Terms & Privacy */}
            <ThemedText style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal visible={showForgotPassword} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Reset Password</ThemedText>
              <Pressable onPress={() => setShowForgotPassword(false)} disabled={forgotLoading}>
                <MaterialIcons name="close" size={24} color={TEXT_PRIMARY} />
              </Pressable>
            </View>

            <ThemedText style={styles.modalDescription}>
              Enter your email address and we'll send you a link to reset your password.
            </ThemedText>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={TEXT_SECONDARY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={TEXT_SECONDARY}
                value={forgotEmail}
                onChangeText={(text) => {
                  setForgotEmail(text);
                  setForgotError('');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!forgotLoading}
              />
            </View>

            {/* Error Message */}
            {forgotError ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error" size={16} color={ERROR_COLOR} />
                <ThemedText style={styles.errorText}>{forgotError}</ThemedText>
              </View>
            ) : null}

            {/* Success Message */}
            {forgotSuccess ? (
              <View style={styles.successContainer}>
                <MaterialIcons name="check-circle" size={16} color={SUCCESS_COLOR} />
                <ThemedText style={styles.successText}>Check your email for reset link</ThemedText>
              </View>
            ) : null}

            {/* Send Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { marginTop: 24, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleForgotPassword}
              disabled={!isValidEmail(forgotEmail) || forgotLoading}
            >
              {forgotLoading ? (
                <ActivityIndicator color={TEXT_PRIMARY} size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>Send Reset Link</ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: TEAL_PRIMARY,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: SURFACE,
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: TEAL_PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_SECONDARY,
  },
  activeTabText: {
    color: TEXT_PRIMARY,
  },
  formContainer: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: SURFACE,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: TEXT_PRIMARY,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: ERROR_COLOR,
  },
  errorText: {
    color: ERROR_COLOR,
    fontSize: 14,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: SUCCESS_COLOR,
  },
  successText: {
    color: SUCCESS_COLOR,
    fontSize: 14,
    flex: 1,
  },
  forgotLink: {
    color: TEAL_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: -8,
  },
  primaryButton: {
    backgroundColor: TEAL_PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: TEAL_PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonText: {
    color: TEAL_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    marginHorizontal: 12,
    color: TEXT_SECONDARY,
    fontSize: 13,
  },
  termsText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  modalDescription: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 24,
    lineHeight: 20,
  },
});
