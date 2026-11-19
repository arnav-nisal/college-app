import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";

const DEPARTMENTS = [
  "CSE",
  "IT",
  "ENTC",
  "Mechanical",
  "Civil",
  "AI & DS",
];

const ACADEMIC_YEARS = ["FY", "SY", "TY", "Final"];

export default function OnboardingScreen() {
  const { user, updateProfile, signOut } = useAuth();

  const [collegeId, setCollegeId] = useState("");
  const [department, setDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState<string | null>("FY");
  const [division, setDivision] = useState("");
  const [bio, setBio] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    const trimmedId = collegeId.trim();
    if (!trimmedId || trimmedId.length < 2) {
      setErrorMessage("Please enter a valid PRN or College ID (min 2 characters).");
      return;
    }

    if (!department) {
      setErrorMessage("Please select your academic department.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        college_id: trimmedId,
        department,
        academic_year: academicYear || undefined,
        division: division.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      // Route gate in _layout will automatically route to /(tabs)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setErrorMessage(
            "This College ID / PRN is already registered to another account. Please verify your ID."
          );
          return;
        }
        setErrorMessage(err.message);
        return;
      }
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to complete onboarding. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={28} color="#38BDF8" />
            </View>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Set up your academic credentials for the DESPU campus network
            </Text>
          </View>

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
              <Pressable
                onPress={() => setErrorMessage(null)}
                hitSlop={8}
                style={styles.closeErrorButton}
              >
                <Ionicons name="close" size={16} color="#94A3B8" />
              </Pressable>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Full Name & Email Pre-filled */}
            <View style={styles.readOnlyCard}>
              <View style={styles.readOnlyRow}>
                <Ionicons name="person-circle-outline" size={20} color="#38BDF8" />
                <View style={styles.readOnlyTextGroup}>
                  <Text style={styles.readOnlyLabel}>Google Account Name</Text>
                  <Text style={styles.readOnlyValue}>
                    {user?.full_name || "Verified Student"}
                  </Text>
                </View>
              </View>
              <View style={styles.readOnlyDivider} />
              <View style={styles.readOnlyRow}>
                <Ionicons name="mail-outline" size={20} color="#38BDF8" />
                <View style={styles.readOnlyTextGroup}>
                  <Text style={styles.readOnlyLabel}>Institutional Email</Text>
                  <Text style={styles.readOnlyValue}>{user?.email}</Text>
                </View>
              </View>
            </View>

            {/* College ID / PRN */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                College ID / PRN <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. PRN2024001 or EMP1029"
                placeholderTextColor="#64748B"
                value={collegeId}
                onChangeText={setCollegeId}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Text style={styles.inputHint}>
                Permanent Registration Number for students or Staff ID
              </Text>
            </View>

            {/* Department Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Department <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.chipGrid}>
                {DEPARTMENTS.map((dept) => {
                  const isSelected = department === dept;
                  return (
                    <Pressable
                      key={dept}
                      style={[
                        styles.chip,
                        isSelected && styles.chipSelected,
                      ]}
                      onPress={() => setDepartment(dept)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {dept}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Academic Year Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Academic Year</Text>
              <View style={styles.chipRow}>
                {ACADEMIC_YEARS.map((yr) => {
                  const isSelected = academicYear === yr;
                  return (
                    <Pressable
                      key={yr}
                      style={[
                        styles.yearChip,
                        isSelected && styles.chipSelected,
                      ]}
                      onPress={() => setAcademicYear(yr)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {yr}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Division Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Division / Section</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. A, B, C (Optional)"
                placeholderTextColor="#64748B"
                value={division}
                onChangeText={setDivision}
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>

            {/* Bio Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Bio</Text>
                <Text style={styles.charCount}>{bio.length}/280</Text>
              </View>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Introduce yourself to the campus community..."
                placeholderTextColor="#64748B"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                maxLength={280}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#0F172A" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Complete Setup</Text>
                  <Ionicons name="arrow-forward" size={18} color="#0F172A" />
                </>
              )}
            </Pressable>

            <Pressable
              style={styles.signOutButton}
              onPress={() => signOut()}
            >
              <Ionicons name="log-out-outline" size={16} color="#94A3B8" />
              <Text style={styles.signOutButtonText}>Sign Out & Switch Account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0F1D",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(56, 189, 248, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.25)",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F8FAFC",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
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
  form: {
    gap: 18,
  },
  readOnlyCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  readOnlyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  readOnlyDivider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 10,
  },
  readOnlyTextGroup: {
    flex: 1,
  },
  readOnlyLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  readOnlyValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F1F5F9",
    marginTop: 1,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E2E8F0",
  },
  requiredStar: {
    color: "#38BDF8",
  },
  charCount: {
    fontSize: 11,
    color: "#64748B",
  },
  input: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#F8FAFC",
    fontSize: 14,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  inputHint: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  yearChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  chipSelected: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    borderColor: "#38BDF8",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
  },
  chipTextSelected: {
    color: "#38BDF8",
    fontWeight: "600",
  },
  actionsContainer: {
    marginTop: 28,
    gap: 14,
    alignItems: "center",
  },
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#38BDF8",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  signOutButtonText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
