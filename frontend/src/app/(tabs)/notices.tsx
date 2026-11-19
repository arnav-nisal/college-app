import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const CATEGORIES = ["All", "Academic", "Exams", "Events", "Urgent"];

const NOTICES = [
  {
    id: "n1",
    tag: "URGENT",
    tagColor: "#EF4444",
    title: "End-Semester Practical Exam Timetable Submission",
    department: "Dean Academics",
    date: "19 Nov 2026",
    summary:
      "All laboratory and project viva-voce examinations must be concluded by Nov 30. Check individual department schedules.",
  },
  {
    id: "n2",
    tag: "EXAMS",
    tagColor: "#F59E0B",
    title: "Winter 2026 Regular & Backlog Examination Schedule",
    department: "Examination Cell",
    date: "18 Nov 2026",
    summary:
      "Detailed branch-wise timetable has been uploaded on the university portal. Hall tickets can be downloaded starting tomorrow.",
  },
  {
    id: "n3",
    tag: "ACADEMIC",
    tagColor: "#38BDF8",
    title: "Final Year Capstone Project Review - Phase 1",
    department: "Computer Engineering",
    date: "16 Nov 2026",
    summary:
      "Panel review for Phase 1 project deliverables will commence next Wednesday. PPT and synopsis must be submitted to project guides.",
  },
  {
    id: "n4",
    tag: "EVENTS",
    tagColor: "#10B981",
    title: "DESPU National Conference on Artificial Intelligence",
    department: "Research & Development",
    date: "14 Nov 2026",
    summary:
      "Call for research papers across student and faculty tracks. Best paper awards and IEEE digital library indexing available.",
  },
];

export default function NoticesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNotices = NOTICES.filter((n) => {
    if (selectedCategory === "All") return true;
    return n.tag.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Official Circulars</Text>
        <Text style={styles.headerSubtitle}>
          Verified notices and university broadcasts
        </Text>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Notices List */}
      <ScrollView
        contentContainerStyle={styles.noticesList}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotices.map((notice) => (
          <View key={notice.id} style={styles.noticeCard}>
            <View style={styles.cardTopRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: `${notice.tagColor}20` },
                ]}
              >
                <Text style={[styles.badgeText, { color: notice.tagColor }]}>
                  {notice.tag}
                </Text>
              </View>
              <Text style={styles.noticeDate}>{notice.date}</Text>
            </View>

            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeDepartment}>
              Issued by: {notice.department}
            </Text>
            <Text style={styles.noticeSummary}>{notice.summary}</Text>

            <View style={styles.cardFooter}>
              <Pressable style={styles.viewCircularButton}>
                <Ionicons name="document-text-outline" size={16} color="#38BDF8" />
                <Text style={styles.viewCircularText}>View Circular PDF</Text>
              </Pressable>
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  filterScroll: {
    paddingHorizontal: 18,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  filterChipSelected: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    borderColor: "#38BDF8",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
  },
  filterChipTextSelected: {
    color: "#38BDF8",
    fontWeight: "600",
  },
  noticesList: {
    padding: 18,
    gap: 16,
  },
  noticeCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noticeDate: {
    fontSize: 11,
    color: "#64748B",
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 4,
  },
  noticeDepartment: {
    fontSize: 12,
    color: "#38BDF8",
    fontWeight: "500",
    marginBottom: 8,
  },
  noticeSummary: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 10,
  },
  viewCircularButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewCircularText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#38BDF8",
  },
});
