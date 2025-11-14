// Deep scan feature for detailed face health analysis
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemeToggle } from "@/components/theme-toggle";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/context/ThemeContext";
import {
  analyzeFaceHealth,
  analyzeDeepScan,
  FaceHealthAnalysis,
  DeepScanAnalysis,
} from "@/src/services/gemini.service";
import CameraComponent from "@/components/camera-view";

type Status = "idle" | "loading" | "success" | "error";
type ViewMode = "menu" | "camera";
type ScanMode = "standard" | "deep";

const ACCENT_GREEN = "#00d97d";
const DARK_BG = "#1a3a3f";
const TEAL_PRIMARY = "#4a9b8e";
const TEAL_BRIGHT = "#00d4ff";
const TEAL_DARK = "#2a5a5f";
const TEAL_MEDIUM = "#3a7a6f";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "#a0a0a0";

export default function ScanScreen() {
  const router = useRouter();
  const { isDarkMode, theme } = useTheme();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<
    FaceHealthAnalysis | DeepScanAnalysis | null
  >(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("menu");
  const colorScheme = useColorScheme();
  const themeKey = colorScheme ?? "light";

  // Animation state
  const scanAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === "loading") {
      Animated.loop(
        Animated.parallel([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [status, scanAnim, rotateAnim]);

  const tintColor = Colors[themeKey].tint;

  const analyzeImage = useCallback(
    async (uri: string, mimeType?: string, mode: ScanMode = "deep") => {
      try {
        setStatus("loading");
        setErrorMessage(null);

        const base64 = await readFileAsBase64(uri);

        let analysis: FaceHealthAnalysis | DeepScanAnalysis;

        if (mode === "deep") {
          analysis = await analyzeDeepScan({
            imageBase64: base64,
            mimeType: mimeType,
          });
        } else {
          analysis = await analyzeFaceHealth({
            imageBase64: base64,
            mimeType: mimeType,
          });
        }

        setResult(analysis);
        setStatus("success");

        // Navigate to analysis page after a short delay for better UX
        setTimeout(() => {
          router.push({
            pathname: "/(tabs)/analysis" as any,
            params: {
              data: JSON.stringify(analysis),
              image: uri,
              scanType: mode,
            },
          });
        }, 500);
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to analyze face health.";
        setErrorMessage(message);
        setStatus("error");
      }
    },
    [router]
  );

  const handleCameraPhoto = useCallback(
    (uri: string) => {
      setSelectedImageUri(uri);
      setViewMode("menu");
      analyzeImage(uri, undefined, "deep");
    },
    [analyzeImage]
  );

  const handleSelectImage = useCallback(async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "We need access to your photo library to analyze your skin."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });

      if (pickerResult.canceled) {
        return;
      }

      const [asset] = pickerResult.assets;
      if (!asset?.uri) {
        Alert.alert(
          "Something went wrong",
          "Unable to read the selected image."
        );
        return;
      }

      setSelectedImageUri(asset.uri);
      await analyzeImage(asset.uri, asset.mimeType ?? undefined, "deep");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Failed to select image.";
      setErrorMessage(message);
      setStatus("error");
    }
  }, [analyzeImage]);

  // Camera View
  if (viewMode === "camera") {
    return (
      <CameraComponent
        onPhotoTaken={handleCameraPhoto}
        onCancel={() => setViewMode("menu")}
      />
    );
  }

  // Menu View - Redesigned Layout
  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.BG }]}>
         <Pressable onPress={() => router.back()} hitSlop={10}>
           <MaterialIcons name="close" size={28} color={theme.TEXT_PRIMARY} />
         </Pressable>
         <View style={styles.headerRight}>
           <ThemeToggle />
           <Pressable
             onPress={() =>
               Alert.alert(
                 "Help",
                 "Tips: Make sure your face is fully visible and well-lit."
               )
             }
             hitSlop={10}
           >
             <MaterialIcons name="help-outline" size={28} color={theme.TEXT_PRIMARY} />
           </Pressable>
         </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <ThemedText style={styles.title}>Take a photo</ThemedText>

          {/* Subtitle */}
          <ThemedText style={styles.subtitle}>
            Make sure your face is fully visible and well-lit
          </ThemedText>

          {/* Illustration/Image Area */}
          {status === "loading" ? (
            <ScanningAnimation scanAnim={scanAnim} rotateAnim={rotateAnim} />
          ) : (
            <View style={styles.illustrationContainer}>
              <View style={styles.faceIllustration}>
                <MaterialIcons name="face" size={120} color={theme.TEAL_BRIGHT} />
              </View>
            </View>
          )}

          {/* Error Banner */}
          {status === "error" && errorMessage && (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={20} color="#ef4444" />
              <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {status !== "loading" && (
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => setViewMode("camera")}
          >
            <MaterialIcons name="camera-alt" size={20} color={DARK_BG} />
            <ThemedText style={styles.primaryButtonText}>Take Photo</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={handleSelectImage}
          >
            <ThemedText style={styles.secondaryButtonText}>
              Choose from Gallery
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

interface ScanningAnimationProps {
  scanAnim: Animated.Value;
  rotateAnim: Animated.Value;
}

function ScanningAnimation({ scanAnim, rotateAnim }: ScanningAnimationProps) {
  const scanlinePosition = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const rotateZ = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.scanningContainer}>
      <View style={styles.scannerOverlay}>
        <Animated.View
          style={[
            styles.scanningIcon,
            {
              transform: [{ rotate: rotateZ }],
            },
          ]}
        >
          <MaterialIcons
            name="center-focus-strong"
            size={60}
            color={TEAL_BRIGHT}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.scanline,
            {
              top: scanlinePosition,
            },
          ]}
        />

        <View style={styles.scanningCorners}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <ThemedText style={styles.scanningText}>
        Analyzing your skin...
      </ThemedText>
      <ThemedText style={styles.scanningSubtext}>
        Processing image with AI
      </ThemedText>
    </View>
  );
}

async function readFileAsBase64(uri: string): Promise<string> {
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blobToBase64(blob);
  }

  return FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file data."));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const base64 = result.split(",")[1];
        resolve(base64 ?? "");
      } else {
        reject(new Error("Unsupported file reader result."));
      }
    };
    reader.readAsDataURL(blob);
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  illustrationContainer: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  faceIllustration: {
    width: "100%",
    aspectRatio: 0.75,
    backgroundColor: TEAL_MEDIUM,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3,
  },
  scanningContainer: {
    alignItems: "center",
    gap: 24,
    paddingVertical: 20,
    width: "100%",
  },
  scannerOverlay: {
    width: 240,
    height: 320,
    borderRadius: 20,
    backgroundColor: `${TEAL_MEDIUM}15`,
    borderWidth: 2,
    borderColor: TEAL_BRIGHT,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  scanningIcon: {
    opacity: 0.8,
  },
  scanline: {
    position: "absolute",
    width: "100%",
    height: 3,
    backgroundColor: TEAL_BRIGHT,
    shadowColor: TEAL_BRIGHT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanningCorners: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  corner: {
    position: "absolute",
    borderColor: TEAL_BRIGHT,
    width: 30,
    height: 30,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanningText: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT_PRIMARY,
  },
  scanningSubtext: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(239,68,68,0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_PRIMARY,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: ACCENT_GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: DARK_BG,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },
  scanOptionsContainer: {
    gap: 16,
    marginTop: 32,
  },
  scanOption: {
    backgroundColor: TEAL_DARK,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "rgba(0, 212, 255, 0.2)",
    alignItems: "center",
  },
  scanOptionActive: {
    borderColor: TEAL_BRIGHT,
    backgroundColor: `${TEAL_BRIGHT}15`,
  },
  scanOptionBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: TEAL_BRIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: DARK_BG,
  },
  scanOptionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: `${TEAL_BRIGHT}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scanOptionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  scanOptionDescription: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 18,
  },
  scanOptionDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  durationText: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },
});
