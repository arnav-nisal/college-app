import React from "react";
import {
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

const STORIES = [
  { id: "1", title: "Hackathon", icon: "code-slash", color: "#38BDF8" },
  { id: "2", title: "Cult-Fest", icon: "musical-notes", color: "#EC4899" },
  { id: "3", title: "Sports", icon: "football", color: "#10B981" },
  { id: "4", title: "Workshops", icon: "laptop", color: "#F59E0B" },
  { id: "5", title: "Library", icon: "book", color: "#8B5CF6" },
];

const POSTS = [
  {
    id: "p1",
    author: "DESPU Tech Club",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    time: "2h ago",
    department: "Computer Engineering",
    title: "Annual Hackathon 2026 Registration Open!",
    content:
      "Join over 500+ student developers across all branches for a 36-hour code sprint on AI, Web3, and Mobile applications. Prizes worth ₹2,00,000 to be won!",
    likes: 142,
    comments: 28,
  },
  {
    id: "p2",
    author: "Prof. K. R. Joshi (HOD)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    time: "5h ago",
    department: "Academic Dean Office",
    title: "Mid-Term Examination Hall Tickets Released",
    content:
      "All students are advised to verify their seating arrangement and download verified hall tickets from the Exams tab before Monday.",
    likes: 98,
    comments: 12,
  },
];

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.branding}>
          <Ionicons name="school" size={24} color="#38BDF8" />
          <Text style={styles.brandTitle}>DESPU Campus</Text>
        </View>
        <View style={styles.topBarActions}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color="#F1F5F9" />
            <View style={styles.notificationBadge} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Pill */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>
            Welcome back,{" "}
            <Text style={styles.userNameHighlight}>
              {user?.full_name?.split(" ")[0] || "Student"}
            </Text>
          </Text>
          <Text style={styles.greetingSubtext}>
            {user?.department || "DES Pune University"} • {user?.academic_year || "Academic"}
          </Text>
        </View>

        {/* Stories / Highlights Tray */}
        <View style={styles.storiesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScroll}
          >
            {STORIES.map((story) => (
              <View key={story.id} style={styles.storyItem}>
                <View
                  style={[
                    styles.storyRing,
                    { borderColor: story.color },
                  ]}
                >
                  <View style={styles.storyIconCircle}>
                    <Ionicons
                      name={story.icon as unknown as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={story.color}
                    />
                  </View>
                </View>
                <Text style={styles.storyLabel}>{story.title}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Feed Posts */}
        <View style={styles.feedContainer}>
          {POSTS.map((post) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: post.avatar }}
                  style={styles.postAvatar}
                />
                <View style={styles.postAuthorInfo}>
                  <Text style={styles.postAuthorName}>{post.author}</Text>
                  <Text style={styles.postAuthorMeta}>
                    {post.department} • {post.time}
                  </Text>
                </View>
                <Pressable>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={18}
                    color="#64748B"
                  />
                </Pressable>
              </View>

              {/* Post Content */}
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postText}>{post.content}</Text>

              {/* Post Actions */}
              <View style={styles.postActions}>
                <View style={styles.actionItem}>
                  <Ionicons name="heart-outline" size={20} color="#F1F5F9" />
                  <Text style={styles.actionCount}>{post.likes}</Text>
                </View>
                <View style={styles.actionItem}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color="#F1F5F9"
                  />
                  <Text style={styles.actionCount}>{post.comments}</Text>
                </View>
                <View style={styles.actionItem}>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="#F1F5F9"
                  />
                </View>
              </View>
            </View>
          ))}
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  branding: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
    letterSpacing: -0.3,
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#38BDF8",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  greetingCard: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  userNameHighlight: {
    color: "#38BDF8",
  },
  greetingSubtext: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  storiesContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  storiesScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  storyItem: {
    alignItems: "center",
    width: 64,
  },
  storyRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  storyIconCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 26,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  storyLabel: {
    fontSize: 11,
    color: "#CBD5E1",
    marginTop: 4,
    fontWeight: "500",
  },
  feedContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  postCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E293B",
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F1F5F9",
  },
  postAuthorMeta: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 6,
  },
  postText: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 19,
    marginBottom: 14,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 10,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionCount: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
