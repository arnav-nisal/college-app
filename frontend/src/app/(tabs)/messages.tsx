import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const CONVERSATIONS = [
  {
    id: "c1",
    name: "Dr. Sandeep Patil (Guide)",
    role: "Staff • Project Guide",
    lastMessage: "Please share the updated system architecture diagram by 4 PM.",
    time: "10:45 AM",
    unread: 2,
    online: true,
  },
  {
    id: "c2",
    name: "BE CSE - Div A (Official)",
    role: "Departmental Group",
    lastMessage: "Assignment 3 submission link has been posted on Moodle.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "c3",
    name: "Prof. S. N. Deshmukh",
    role: "Staff • Operating Systems",
    lastMessage: "Office hours tomorrow 11 AM - 1 PM in room 304.",
    time: "Tuesday",
    unread: 0,
    online: false,
  },
  {
    id: "c4",
    name: "Rohan Kulkarni (Class Rep)",
    role: "Student • Peer",
    lastMessage: "Are you attending the guest lecture on distributed systems?",
    time: "Monday",
    unread: 0,
    online: true,
  },
];

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Messages</Text>
        <Pressable style={styles.composeButton}>
          <Ionicons name="create-outline" size={20} color="#38BDF8" />
        </Pressable>
      </View>

      {/* Anti-Spam / Office Hours Notice */}
      <View style={styles.policyNotice}>
        <Ionicons name="time-outline" size={18} color="#F59E0B" />
        <Text style={styles.policyText}>
          Faculty DMs are subject to working hours (9 AM - 5 PM). Messages sent after hours are queued for delivery.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students, staff or groups..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={16} color="#64748B" />
          </Pressable>
        )}
      </View>

      {/* Conversations List */}
      <ScrollView
        contentContainerStyle={styles.conversationList}
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.map((item) => (
          <Pressable key={item.id} style={styles.chatRow}>
            {/* Avatar Circle with Online Dot */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={20} color="#94A3B8" />
              </View>
              {item.online && <View style={styles.onlineDot} />}
            </View>

            {/* Chat Details */}
            <View style={styles.chatDetails}>
              <View style={styles.chatTopRow}>
                <Text style={styles.chatName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>

              <Text style={styles.chatRole}>{item.role}</Text>
              <Text style={styles.chatLastMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            {/* Unread Badge */}
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unread}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0F1D",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  composeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  policyNotice: {
    flexDirection: "row",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.25)",
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  policyText: {
    flex: 1,
    color: "#FDE68A",
    fontSize: 11,
    lineHeight: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    marginHorizontal: 18,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 13,
  },
  conversationList: {
    paddingHorizontal: 18,
    gap: 4,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#0A0F1D",
  },
  chatDetails: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F1F5F9",
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 11,
    color: "#64748B",
  },
  chatRole: {
    fontSize: 11,
    color: "#38BDF8",
    marginTop: 1,
    fontWeight: "500",
  },
  chatLastMessage: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 3,
  },
  unreadBadge: {
    backgroundColor: "#38BDF8",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: "#0F172A",
    fontSize: 11,
    fontWeight: "700",
  },
});
