import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
      <Stack.Screen name="name" options={{ gestureEnabled: true }} />
      <Stack.Screen name="age" options={{ gestureEnabled: true }} />
      <Stack.Screen name="height" options={{ gestureEnabled: true }} />
      <Stack.Screen name="weight" options={{ gestureEnabled: true }} />
      <Stack.Screen name="gender" options={{ gestureEnabled: true }} />
    </Stack>
  );
}

