import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';

// Colors
const DARK_BG = '#1a3a3f';
const TEAL_PRIMARY = '#4a9b8e';
const TEAL_BRIGHT = '#00d4ff';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'Forever',
    description: 'Get started with basic features',
    features: [
      '1 scan per day',
      'Basic analysis',
      'View history',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Unlock advanced features',
    features: [
      'Unlimited scans',
      'Advanced AI analysis',
      'Detailed reports',
      'Progress tracking',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    period: '/month',
    description: 'Complete skincare solution',
    features: [
      'Everything in Pro',
      'Custom recommendations',
      'Dermatologist access',
      'Product integration',
      '24/7 support',
    ],
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to scan page
      router.replace('/(tabs)/scan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    // Go to scan with free plan
    router.replace('/(tabs)/scan');
  };

  const selectedPlanData = plans.find((p) => p.id === selectedPlan);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Choose Your Plan</ThemedText>
          <ThemedText style={styles.subtitle}>
            Unlock powerful skincare analysis and personalized recommendations
          </ThemedText>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <Pressable
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.isPopular && styles.planCardPopular,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <ThemedText style={styles.popularText}>Most Popular</ThemedText>
                </View>
              )}

              <ThemedText style={styles.planName}>{plan.name}</ThemedText>
              <View style={styles.priceContainer}>
                <ThemedText style={styles.price}>{plan.price}</ThemedText>
                <ThemedText style={styles.period}>{plan.period}</ThemedText>
              </View>
              <ThemedText style={styles.description}>{plan.description}</ThemedText>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <MaterialIcons name="check-circle" size={16} color={TEAL_BRIGHT} />
                    <ThemedText style={styles.featureText}>{feature}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Selection Indicator */}
              {selectedPlan === plan.id && (
                <View style={styles.selectedIndicator}>
                  <MaterialIcons name="check-circle" size={24} color={TEAL_BRIGHT} />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info" size={20} color={TEAL_BRIGHT} />
          <ThemedText style={styles.infoText}>
            Start with a free trial. Cancel anytime, no questions asked.
          </ThemedText>
        </View>

        {/* Security Info */}
        <View style={styles.securityContainer}>
          <MaterialIcons name="lock" size={18} color={TEXT_SECONDARY} />
          <ThemedText style={styles.securityText}>
            Secure payment processing with Stripe
          </ThemedText>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.skipButton,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={handleSkip}
          disabled={isProcessing}
        >
          <ThemedText style={styles.skipButtonText}>Skip for now</ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            {
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={handleContinue}
          disabled={!selectedPlan || isProcessing}
        >
          {isProcessing ? (
            <ThemedText style={styles.continueButtonText}>Processing...</ThemedText>
          ) : (
            <ThemedText style={styles.continueButtonText}>
              Continue with {selectedPlanData?.name}
            </ThemedText>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 40,
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#3a5a5f',
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(74, 155, 142, 0.05)',
  },
  planCardSelected: {
    borderColor: TEAL_BRIGHT,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
  },
  planCardPopular: {
    borderColor: TEAL_PRIMARY,
  },
  popularBadge: {
    backgroundColor: TEAL_PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: TEAL_BRIGHT,
  },
  period: {
    fontSize: 14,
    color: TEXT_SECONDARY,
  },
  description: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: TEXT_PRIMARY,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_PRIMARY,
    lineHeight: 18,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  securityText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
    gap: 12,
  },
  skipButton: {
    borderWidth: 2,
    borderColor: '#3a5a5f',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipButtonText: {
    color: TEXT_SECONDARY,
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: DARK_BG,
    fontSize: 16,
    fontWeight: '600',
  },
});
