import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from './themed-text';

const DARK_BG = '#1a3a3f';
const TEAL_BRIGHT = '#00d4ff';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#a0a0a0';
const SCREEN_WIDTH = Dimensions.get('window').width;

interface CameraComponentProps {
  onPhotoTaken: (uri: string) => void;
  onCancel: () => void;
}

type ViewMode = 'camera' | 'analyzing';

const SCAN_MESSAGES = [
  'Checking skin hydration levels...',
  'Analyzing facial texture...',
  'Detecting skin concerns...',
  'Measuring symmetry...',
  'Assessing skin tone...',
];

export default function CameraComponent({ onPhotoTaken, onCancel }: CameraComponentProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('camera');

  // Animation refs
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const waveAnim1 = useRef(new Animated.Value(0)).current;
  const waveAnim2 = useRef(new Animated.Value(0)).current;
  const [messageIndex, setMessageIndex] = useState(0);

  // Request permission on mount
  useEffect(() => {
    if (!permission?.granted && permission !== null) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCameraReady = () => {
    setIsReady(true);
  };

  const startScanAnimation = (onComplete?: () => void) => {
    // Reset animations
    scanLineAnim.setValue(0);
    progressAnim.setValue(0);
    waveAnim1.setValue(0);
    waveAnim2.setValue(0);
    setMessageIndex(0);

    // Scan line animation (moves down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Wave animations (side to side)
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim1, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(750),
        Animated.timing(waveAnim2, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim2, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Message cycling
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % SCAN_MESSAGES.length);
    }, 600);

    // After 3 seconds, complete the scan
    const timer = setTimeout(() => {
      clearInterval(messageInterval);
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: Platform.OS === 'android',
      });

      if (photo?.uri) {
        setViewMode('analyzing');
        // Pass the actual URI through after animation completes
        const cleanup = startScanAnimation(() => {
          onPhotoTaken(photo.uri);
        });
        return () => cleanup?.();
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ThemedText>Camera permission is loading...</ThemedText>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera" size={48} color={TEAL_BRIGHT} />
        <ThemedText style={styles.permissionTitle}>Camera Access Required</ThemedText>
        <ThemedText style={styles.permissionText}>
          We need permission to access your camera to capture face photos for analysis.
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.permissionButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={requestPermission}
        >
          <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
        </Pressable>
      </View>
    );
  }

  // Analyzing view
  if (viewMode === 'analyzing') {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    const scanLineTranslate = scanLineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 280],
    });

    const waveTranslateX1 = waveAnim1.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-30, 0, 30],
    });

    const waveTranslateX2 = waveAnim2.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-30, 0, 30],
    });

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={onCancel}
          >
            <MaterialIcons name="arrow-back" size={24} color={TEXT_PRIMARY} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Face Scan</ThemedText>
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={onCancel}
          >
            <MaterialIcons name="close" size={24} color={TEXT_PRIMARY} />
          </Pressable>
        </View>

        {/* Camera Preview */}
        <View style={styles.previewContainer}>
          {/* Corner Brackets */}
          <View style={[styles.cornerBracket, styles.topLeft]}>
            <View style={styles.bracketLineH} />
            <View style={styles.bracketLineV} />
          </View>
          <View style={[styles.cornerBracket, styles.topRight]}>
            <View style={[styles.bracketLineH, { alignSelf: 'flex-end' }]} />
            <View style={styles.bracketLineV} />
          </View>
          <View style={[styles.cornerBracket, styles.bottomLeft]}>
            <View style={styles.bracketLineH} />
            <View style={styles.bracketLineV} />
          </View>
          <View style={[styles.cornerBracket, styles.bottomRight]}>
            <View style={[styles.bracketLineH, { alignSelf: 'flex-end' }]} />
            <View style={styles.bracketLineV} />
          </View>

          {/* Scan Line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{ translateY: scanLineTranslate }],
              },
            ]}
          />

          {/* Wave Lines - Top */}
          <Animated.View
            style={[
              styles.waveLine,
              styles.waveLineTop,
              {
                transform: [{ translateX: waveTranslateX1 }],
              },
            ]}
          />

          {/* Wave Lines - Bottom */}
          <Animated.View
            style={[
              styles.waveLine,
              styles.waveLineBottom,
              {
                transform: [{ translateX: waveTranslateX2 }],
              },
            ]}
          />

          {/* Small dots */}
          <View style={[styles.dot, styles.dotTop]} />
          <View style={[styles.dot, styles.dotBottom]} />
        </View>

        {/* Analyzing Status */}
        <View style={styles.analyzeContainer}>
          <ThemedText style={styles.analyzeTitle}>Analyzing Your Scan</ThemedText>
          <ThemedText style={styles.analyzeSubtitle}>{SCAN_MESSAGES[messageIndex]}</ThemedText>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </View>

        {/* Tip Section */}
        <View style={styles.tipSection}>
          <MaterialIcons name="info" size={20} color={TEAL_BRIGHT} />
          <ThemedText style={styles.tipText}>
            Tip: For best results, always take photos in bright, natural light.
          </ThemedText>
        </View>
      </View>
    );
  }

  // Normal camera view
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        autofocus="on"
        onCameraReady={handleCameraReady}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={onCancel}
          >
            <MaterialIcons name="arrow-back" size={24} color={TEXT_PRIMARY} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Face Scan</ThemedText>
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            onPress={onCancel}
          >
            <MaterialIcons name="close" size={24} color={TEXT_PRIMARY} />
          </Pressable>
        </View>

        {/* Face Guide */}
        <View style={styles.guideContainer}>
          {/* Corner Brackets */}
          <View style={[styles.cornerBracket, styles.topLeft]}>
            <View style={styles.bracketLineH} />
            <View style={styles.bracketLineV} />
          </View>
          <View style={[styles.cornerBracket, styles.topRight]}>
            <View style={[styles.bracketLineH, { alignSelf: 'flex-end' }]} />
            <View style={styles.bracketLineV} />
          </View>
          <View style={[styles.cornerBracket, styles.bottomLeft]}>
            <View style={styles.bracketLineH} />
            <View style={styles.bracketLineV} />
          </View>
          <View style={[styles.cornerBracket, styles.bottomRight]}>
            <View style={[styles.bracketLineH, { alignSelf: 'flex-end' }]} />
            <View style={styles.bracketLineV} />
          </View>

          <ThemedText style={styles.guideText}>Center your face</ThemedText>
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          <View style={styles.captureButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                { opacity: pressed || isCapturing ? 0.8 : 1 },
              ]}
              onPress={handleTakePhoto}
              disabled={isCapturing || !isReady}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>
          </View>

          {/* Flip Camera Button */}
          <Pressable
            style={({ pressed }) => [
              styles.flipButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => setCameraType(cameraType === 'front' ? 'back' : 'front')}
          >
            <MaterialIcons name="flip-camera-android" size={24} color={TEAL_BRIGHT} />
          </Pressable>
        </View>

        {/* Loading Indicator */}
        {!isReady && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={TEAL_BRIGHT} />
            <ThemedText style={styles.loadingText}>Initializing camera...</ThemedText>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
  },
  guideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'relative',
  },
  guideText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    fontWeight: '600',
    color: TEAL_BRIGHT,
  },

  // Corner Brackets
  cornerBracket: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  topLeft: {
    top: 60,
    left: 20,
  },
  topRight: {
    top: 60,
    right: 20,
  },
  bottomLeft: {
    bottom: 100,
    left: 20,
  },
  bottomRight: {
    bottom: 100,
    right: 20,
  },
  bracketLineH: {
    width: 30,
    height: 2,
    backgroundColor: TEAL_BRIGHT,
  },
  bracketLineV: {
    width: 2,
    height: 30,
    backgroundColor: TEAL_BRIGHT,
    marginTop: -2,
  },

  // Scanning elements
  scanLine: {
    position: 'absolute',
    width: '80%',
    height: 3,
    backgroundColor: TEAL_BRIGHT,
    left: '10%',
    top: 100,
    shadowColor: TEAL_BRIGHT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  waveLine: {
    position: 'absolute',
    width: 200,
    height: 2,
    backgroundColor: TEAL_BRIGHT,
    left: '50%',
    marginLeft: -100,
  },
  waveLineTop: {
    top: '35%',
  },
  waveLineBottom: {
    top: '60%',
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TEAL_BRIGHT,
  },
  dotTop: {
    left: 40,
    top: '30%',
  },
  dotBottom: {
    right: 40,
    bottom: '30%',
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    gap: 30,
  },
  captureButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: TEAL_BRIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DARK_BG,
  },
  flipButton: {
    padding: 12,
  },

  // Analyzing view
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  analyzeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: DARK_BG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.1)',
  },
  analyzeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TEAL_BRIGHT,
    marginBottom: 8,
    textAlign: 'center',
  },
  analyzeSubtitle: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: TEAL_BRIGHT,
    borderRadius: 3,
    shadowColor: TEAL_BRIGHT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  // Tip section
  tipSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 212, 255, 0.1)',
  },
  tipText: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 18,
  },

  // Permissions
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: DARK_BG,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: TEXT_PRIMARY,
  },
  permissionText: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: TEAL_BRIGHT,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: DARK_BG,
    fontSize: 16,
    fontWeight: '600',
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: TEAL_BRIGHT,
    fontSize: 16,
    fontWeight: '600',
  },
});
