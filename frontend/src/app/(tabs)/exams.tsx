import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

const TIMETABLE = [
  {
    id: "e1",
    subjectCode: "CS701",
    subjectName: "Cloud Computing & Distributed Systems",
    date: "02 Dec 2026",
    time: "10:30 AM - 01:30 PM",
    room: "Lab 4, Dept of Comp Engg",
    status: "Upcoming",
  },
  {
    id: "e2",
    subjectCode: "CS702",
    subjectName: "Machine Learning & Deep Neural Networks",
    date: "05 Dec 2026",
    time: "10:30 AM - 01:30 PM",
    room: "Room 302, Academic Block A",
    status: "Upcoming",
  },
  {
    id: "e3",
    subjectCode: "CS703",
    subjectName: "Cyber Security & Cryptography",
    date: "09 Dec 2026",
    time: "02:00 PM - 05:00 PM",
    room: "Room 205, Academic Block B",
    status: "Upcoming",
  },
  {
    id: "e4",
    subjectCode: "CS704",
    subjectName: "Software Architecture & Design Patterns",
    date: "12 Dec 2026",
    time: "10:30 AM - 01:30 PM",
    room: "Room 301, Academic Block A",
    status: "Upcoming",
  },
];

export default function ExamsScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Examinations</Text>
        <Text style={styles.headerSubtitle}>
          Winter 2026 Academic Session • Hall Ticket & Schedule
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Digital Hall Ticket Card */}
        <View style={styles.hallTicketCard}>
          <View style={styles.ticketTopRow}>
            <View>
              <Text style={styles.ticketUniversity}>DES PUNE UNIVERSITY</Text>
              <Text style={styles.ticketTitle}>Official Hall Ticket</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>

          <View style={styles.ticketDetailsGrid}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Candidate</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {user?.full_name || "Student"}
              </Text>
            </View>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>PRN / Roll No</Text>
              <Text style={styles.detailValue}>
                {user?.college_id || "PRN Pending"}
              </Text>
            </View>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>
                {user?.department || "CSE"}
              </Text>
            </View>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Year & Div</Text>
              <Text style={styles.detailValue}>
                {user?.academic_year || "TY"} • Div {user?.division || "A"}
              </Text>
            </View>
          </View>

          <Pressable style={styles.downloadTicketButton}>
            <Ionicons name="download-outline" size={16} color="#0F172A" />
            <Text style={styles.downloadTicketText}>
              Download Official PDF
            </Text>
          </Pressable>
        </View>

        {/* Timetable Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exam Timetable</Text>
          <Text style={styles.sectionCount}>{TIMETABLE.length} Papers</Text>
        </View>

        <View style={styles.scheduleList}>
          {TIMETABLE.map((paper) => (
            <View key={paper.id} style={styles.paperCard}>
              <View style={styles.paperTopRow}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{paper.subjectCode}</Text>
                </View>
                <Text style={styles.paperDate}>{paper.date}</Text>
              </View>

              <Text style={styles.paperName}>{paper.subjectName}</Text>

              <View style={styles.paperMetaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#64748B" />
                  <Text style={styles.metaText}>{paper.time}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color="#64748B" />
                  <Text style={styles.metaText}>{paper.room}</Text>
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
  scrollContent: {
    padding: 18,
    gap: 20,
  },
  hallTicketCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  ticketTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  ticketUniversity: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#38BDF8",
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  verifiedBadgeText: {
    color: "#10B981",
    fontSize: 11,
    fontWeight: "600",
  },
  ticketDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
    marginBottom: 16,
  },
  detailBlock: {
    width: "50%",
  },
  detailLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    color: "#F1F5F9",
    fontWeight: "600",
    marginTop: 2,
  },
  downloadTicketButton: {
    backgroundColor: "#38BDF8",
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  downloadTicketText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  sectionCount: {
    fontSize: 12,
    color: "#94A3B8",
  },
  scheduleList: {
    gap: 12,
  },
  paperCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  paperTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  codeBadge: {
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    color: "#38BDF8",
    fontSize: 11,
    fontWeight: "700",
  },
  paperDate: {
    fontSize: 12,
    color: "#F1F5F9",
    fontWeight: "600",
  },
  paperName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 10,
  },
  paperMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 11,
    color: "#94A3B8",
  },
});
