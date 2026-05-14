import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LanguageSwitcher from '../src/components/LanguageSwitcher';
import { Colors } from '../src/theme/colors';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Mock data for calendar dots
const CALENDAR_EVENTS = {};

const REPORTS = [];

export default function PatrolHistory() {
  const navigation = useNavigation();
  const [selectedMonth, setSelectedMonth] = useState(9); // October (0-indexed)
  const [selectedYear] = useState(2023);
  const [selectedDay, setSelectedDay] = useState(5);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ day: null, key: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, key: `day-${d}`, event: CALENDAR_EVENTS[d] });
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return { bg: '#dcfce7', text: Colors.success, label: 'APPROVED' };
      case 'pending': return { bg: '#fef3c7', text: '#92400e', label: 'PENDING' };
      case 'sent-back': return { bg: Colors.dangerLight, text: Colors.danger, label: 'SENT BACK' };
      default: return { bg: Colors.border, text: Colors.textMuted, label: status };
    }
  };

  const getDotColor = (event) => {
    switch (event) {
      case 'approved': return Colors.success;
      case 'pending': return '#f59e0b';
      case 'sent-back': return Colors.danger;
      default: return 'transparent';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="location-on" size={22} color={Colors.primary} />
          <Text style={styles.headerTitle}>PatrolGuard</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <MaterialIcons name="tune" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <LanguageSwitcher compact />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>My Reports</Text>
        <Text style={styles.pageSubtitle}>{MONTHS[selectedMonth]} {selectedYear} Overview</Text>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <View style={styles.calendarMonthRow}>
              <MaterialIcons name="calendar-today" size={18} color={Colors.primary} />
              <Text style={styles.calendarMonth}>{MONTHS[selectedMonth]} {selectedYear}</Text>
            </View>
            <View style={styles.calendarNav}>
              <TouchableOpacity onPress={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}>
                <MaterialIcons name="chevron-left" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}>
                <MaterialIcons name="chevron-right" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Day Headers */}
          <View style={styles.dayHeaderRow}>
            {DAYS.map((d, i) => (
              <Text key={i} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map(item => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.dayCell,
                  item.day === selectedDay && styles.dayCellSelected,
                ]}
                onPress={() => item.day && setSelectedDay(item.day)}
                disabled={!item.day}
              >
                {item.day && (
                  <>
                    <Text style={[
                      styles.dayText,
                      item.event && styles.dayTextBold,
                      item.day === selectedDay && styles.dayTextSelected,
                    ]}>
                      {item.day}
                    </Text>
                    {item.event && (
                      <View style={[styles.eventDot, { backgroundColor: getDotColor(item.event) }]} />
                    )}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>APPROVED</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>PENDING</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.legendText}>SENT BACK</Text>
            </View>
          </View>
        </View>

        {/* Recent Patrols */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Patrols</Text>
          <TouchableOpacity>
            <Text style={styles.historyLink}>HISTORY</Text>
          </TouchableOpacity>
        </View>

        {REPORTS.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="folder-open" size={64} color={Colors.border} />
            <Text style={styles.emptyStateTitle}>No Recent Reports</Text>
            <Text style={styles.emptyStateSub}>You haven't submitted any patrol reports yet.</Text>
          </View>
        ) : (
          REPORTS.map(report => {
            const status = getStatusStyle(report.status);
            return (
              <View key={report.id} style={styles.reportCard}>
                <View style={styles.reportImageContainer}>
                  <Image source={{ uri: report.image }} style={styles.reportImageActual} resizeMode="cover" />
                </View>

                <View style={styles.reportContent}>
                  <View style={styles.reportTitleRow}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <View style={[styles.reportStatusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.reportStatusText, { color: status.text }]}>{status.label}</Text>
                    </View>
                  </View>
                  <View style={styles.reportMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="calendar-today" size={13} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{report.date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={13} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{report.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="timer" size={13} color={Colors.textMuted} />
                      <Text style={styles.metaText}>{report.duration}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.viewReportLink}>
                    <Text style={styles.viewReportText}>View Report →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 56, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  container: { padding: 16 },
  pageTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary },
  pageSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 16 },
  calendarCard: {
    backgroundColor: Colors.surface, borderRadius: 16, padding: 18, marginBottom: 24,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  calendarMonthRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calendarMonth: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  calendarNav: { flexDirection: 'row', gap: 8 },
  dayHeaderRow: { flexDirection: 'row', marginBottom: 8 },
  dayHeader: {
    flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: Colors.textMuted,
  },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%', height: 44, alignItems: 'center', justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: Colors.primary, borderRadius: 10,
  },
  dayText: { fontSize: 14, color: Colors.textPrimary },
  dayTextBold: { fontWeight: '700' },
  dayTextSelected: { color: Colors.textWhite, fontWeight: '700' },
  eventDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 2 },
  legendRow: {
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 16,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  recentHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
  },
  recentTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  historyLink: { fontSize: 13, fontWeight: '700', color: Colors.danger },
  reportCard: {
    backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 16,
    elevation: 2, overflow: 'hidden',
  },
  reportImageContainer: { height: 140, backgroundColor: '#d1d5db' },
  reportImageActual: { width: '100%', height: '100%' },
  reportContent: { padding: 16 },
  reportTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8,
  },
  reportTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  reportStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  reportStatusText: { fontSize: 10, fontWeight: '800' },
  reportMeta: { flexDirection: 'row', gap: 14, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  viewReportLink: { paddingTop: 8 },
  viewReportText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 16 },
  emptyStateSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
});
