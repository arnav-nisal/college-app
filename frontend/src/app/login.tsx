import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (Platform.OS !== "web") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });

        // Ensure clean sign-in prompt
        try {
          await GoogleSignin.signOut();
        } catch {
          // Ignore
        }

        const response = await GoogleSignin.signIn();
        const idToken =
          response.data?.idToken ||
          (response as unknown as { idToken?: string }).idToken;

        if (!idToken) {
          throw new Error("Could not retrieve Google ID Token.");
        }

        await signInWithGoogle(idToken);
      } else {
        // Web fallback instructions or mock trigger
        setErrorMessage(
          "Native Google Sign-In is configured for mobile devices. Use Expo Dev Client on iOS/Android to authenticate with Google."
        );
      }
    } catch (err: unknown) {
      if (isErrorWithCode(err)) {
        if (err.code === statusCodes.SIGN_IN_CANCELLED) {
          // User cancelled sign in dialog, do nothing
          return;
        }
        if (err.code === statusCodes.IN_PROGRESS) {
          setErrorMessage("Sign-in is already in progress.");
          return;
        }
        if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          setErrorMessage(
            "Google Play Services is not available or outdated on this device."
          );
          return;
        }
      }

      if (err instanceof ApiError) {
        if (err.status === 403) {
          setErrorMessage(
            "Access Restricted: Only verified @despu.edu.in accounts are permitted to sign in."
          );
          return;
        }
        setErrorMessage(err.message);
        return;
      }

      const msg =
        err instanceof Error ? err.message : "Failed to sign in with Google.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header & Emblem */}
        <View style={styles.header}>
          <View style={styles.emblemContainer}>
            <Ionicons name="school" size={40} color="#38BDF8" />
          </View>
          <Text style={styles.universityName}>DES Pune University</Text>
          <Text style={styles.tagline}>Official Campus Platform</Text>
          <View style={styles.domainPill}>
            <Ionicons name="shield-checkmark" size={14} color="#0284C7" />
            <Text style={styles.domainPillText}>@despu.edu.in Only</Text>
          </View>
        </View>

        {/* Dismissible Error Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable
              onPress={() => setErrorMessage(null)}
              hitSlop={10}
              style={styles.closeErrorButton}
            >
              <Ionicons name="close" size={18} color="#94A3B8" />
            </Pressable>
          </View>
        )}

        {/* Feature Highlights */}
        <View style={styles.highlightsContainer}>
          <View style={styles.highlightRow}>
            <View style={styles.highlightIcon}>
              <Ionicons name="notifications" size={18} color="#38BDF8" />
            </View>
            <View style={styles.highlightTextContainer}>
              <Text style={styles.highlightTitle}>Official Circulars</Text>
              <Text style={styles.highlightSubtitle}>
                Instant exam, department, and campus notifications
              </Text>
            </View>
          </View>

          <View style={styles.highlightRow}>
            <View style={styles.highlightIcon}>
              <Ionicons name="id-card" size={18} color="#38BDF8" />
            </View>
            <View style={styles.highlightTextContainer}>
              <Text style={styles.highlightTitle}>Digital Campus Pass</Text>
              <Text style={styles.highlightSubtitle}>
                Verified student & staff profile with PRN sync
              </Text>
            </View>
          </View>

          <View style={styles.highlightRow}>
            <View style={styles.highlightIcon}>
              <Ionicons name="chatbubbles" size={18} color="#38BDF8" />
            </View>
            <View style={styles.highlightTextContainer}>
              <Text style={styles.highlightTitle}>Secure Direct Messaging</Text>
              <Text style={styles.highlightSubtitle}>
                Encrypted communication with faculty office-hour controls
              </Text>
            </View>
          </View>
        </View>

        {/* Sign In Action Area */}
        <View style={styles.actionSection}>
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.googleButtonPressed,
              isSubmitting && styles.googleButtonDisabled,
            ]}
            onPress={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#0F172A" />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#0F172A" />
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </>
            )}
          </Pressable>

          <Text style={styles.disclaimerText}>
            Sign in using your institutional{" "}
            <Text style={styles.boldText}>@despu.edu.in</Text> credentials.
            Personal Gmail accounts will be automatically rejected.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0F1D",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 24,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  emblemContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.25)",
  },
  universityName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F8FAFC",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 4,
    fontWeight: "500",
  },
  domainPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(2, 132, 199, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(2, 132, 199, 0.3)",
  },
  domainPillText: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "600",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 10,
  },
  errorText: {
    flex: 1,
    color: "#FCA5A5",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  closeErrorButton: {
    padding: 4,
  },
  highlightsContainer: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1E293B",
    gap: 18,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  highlightIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.2)",
  },
  highlightTextContainer: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F1F5F9",
  },
  highlightSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
    lineHeight: 16,
  },
  actionSection: {
    alignItems: "center",
    gap: 14,
  },
  googleButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimerText: {
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  boldText: {
    color: "#94A3B8",
    fontWeight: "600",
  },
});
