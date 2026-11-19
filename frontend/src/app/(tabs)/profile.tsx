import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return "#F43F5E";
      case "head":
        return "#A855F7";
      case "staff":
        return "#10B981";
      default:
        return "#38BDF8";
    }
  };

  const roleColor = getRoleColor(user?.role);
  const initials = (user?.full_name || "DP")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Campus Profile</Text>
          <View style={styles.domainBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#10B981" />
            <Text style={styles.domainBadgeText}>despu.edu.in</Text>
          </View>
        </View>

        {/* Profile Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.identityTopRow}>
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: `${roleColor}25` }]}>
                <Text style={[styles.avatarInitials, { color: roleColor }]}>
                  {initials}
                </Text>
              </View>
            )}

            <View style={styles.identityMeta}>
              <Text style={styles.fullName}>{user?.full_name}</Text>
              <Text style={styles.emailText}>{user?.email}</Text>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: `${roleColor}20`, borderColor: `${roleColor}40` },
                ]}
              >
                <Text style={[styles.roleBadgeText, { color: roleColor }]}>
                  {(user?.role || "STUDENT").toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Academic Info Grid */}
          <View style={styles.idDetailsGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>College ID / PRN</Text>
              <Text style={styles.gridValue}>
                {user?.college_id || "Not assigned"}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Department</Text>
              <Text style={styles.gridValue}>
                {user?.department || "Unassigned"}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Academic Year</Text>
              <Text style={styles.gridValue}>
                {user?.academic_year || "N/A"}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Division</Text>
              <Text style={styles.gridValue}>
                {user?.division || "N/A"}
              </Text>
            </View>
          </View>

          {/* Bio */}
          {user?.bio && (
            <View style={styles.bioContainer}>
              <Text style={styles.bioLabel}>About</Text>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          )}
        </View>

        {/* Preferences / Status Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Campus Preferences</Text>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="chatbubbles-outline" size={18} color="#38BDF8" />
              <View>
                <Text style={styles.preferenceTitle}>Direct Messaging</Text>
                <Text style={styles.preferenceSubtitle}>
                  Accept messages from campus peers & faculty
                </Text>
              </View>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>
                {user?.dm_enabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="checkmark-done-circle-outline" size={18} color="#10B981" />
              <View>
                <Text style={styles.preferenceTitle}>Onboarding Status</Text>
                <Text style={styles.preferenceSubtitle}>
                  Profile verified by academic cell
                </Text>
              </View>
            </View>
            <View style={styles.statusPillActive}>
              <Text style={styles.statusPillTextActive}>Complete</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Section */}
        <View style={styles.signOutSection}>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
              isSigningOut && styles.signOutButtonDisabled,
            ]}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.signOutText}>Sign Out of DESPU Account</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.signOutHint}>
            Signing out clears your local session so you can log in with another @despu.edu.in account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0F1D",
  },
  scrollContent: {
    padding: 18,
    gap: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  domainBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  domainBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10B981",
  },
  identityCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  identityTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "#38BDF8",
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#38BDF8",
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: "700",
  },
  identityMeta: {
    flex: 1,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  emailText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  idDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 16,
  },
  gridItem: {
    width: "50%",
  },
  gridLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  gridValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F1F5F9",
    marginTop: 2,
  },
  bioContainer: {
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 12,
    marginTop: 14,
  },
  bioLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  bioText: {
    fontSize: 13,
    color: "#CBD5E1",
    lineHeight: 18,
    marginTop: 3,
  },
  sectionCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 14,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  preferenceTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F1F5F9",
  },
  preferenceSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 12,
  },
  statusPill: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },
  statusPillActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillTextActive: {
    fontSize: 11,
    color: "#10B981",
    fontWeight: "600",
  },
  signOutSection: {
    marginTop: 10,
    alignItems: "center",
    gap: 8,
  },
  signOutButton: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutButtonPressed: {
    opacity: 0.8,
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  signOutHint: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 16,
  },
});
