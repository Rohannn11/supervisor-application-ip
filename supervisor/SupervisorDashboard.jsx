import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SupervisorDashboard() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color="#002e85" />
          <Text style={styles.headerTitle}>PatrolGuard</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.langBtn}>
            <Text style={styles.langBtnText}>EN/HI</Text>
          </TouchableOpacity>
          <MaterialIcons name="notifications" size={24} color="#64748b" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>नमस्ते, Rohan (Supervisor)</Text>
          <Text style={styles.greetingSubtitle}>Welcome back to your duty station.</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Active Site</Text>
              <Text style={styles.heroTitle}>Tech Park - Sector 4</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDotWrapper}>
                <View style={styles.statusDotPing} />
                <View style={styles.statusDot} />
              </View>
              <Text style={styles.statusText}>Online  GPS Active</Text>
            </View>
          </View>
          <View style={styles.heroBottomRow}>
            <View style={styles.heroInfoPill}>
              <MaterialIcons name="schedule" size={16} color="#b4c5ff" />
              <Text style={styles.heroInfoText}>08:00 AM - 04:00 PM</Text>
            </View>
            <View style={styles.heroInfoPill}>
              <MaterialIcons name="group" size={16} color="#b4c5ff" />
              <Text style={styles.heroInfoText}>12 Guards</Text>
            </View>
          </View>
          <MaterialIcons name="map" size={120} color="rgba(255,255,255,0.1)" style={styles.heroBgIcon} />
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity 
            style={styles.fullWidthCard}
            onPress={() => navigation.navigate('ActivePatrolMap')}
          >
            <View style={styles.fwCardLeft}>
              <View style={styles.fwIconWrapper}>
                <MaterialIcons name="my-location" size={24} color="#002e85" />
              </View>
              <View>
                <Text style={styles.fwCardTitle}>Real-Time Tracking</Text>
                <Text style={styles.fwCardSubtitle}>Live guard positions & routes</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>

          <View style={styles.halfGrid}>
            <TouchableOpacity 
              style={styles.halfCard}
              onPress={() => navigation.navigate('PatrolChecklist')}
            >
              <View style={styles.halfCardIconFact}>
                <MaterialIcons name="fact-check" size={24} color="#525c7f" />
              </View>
              <View>
                <Text style={styles.halfCardTitle}>Pending Checklists</Text>
                <Text style={styles.halfCardValuePrimary}>04</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.halfCard}
              onPress={() => navigation.navigate('PatrolHistory')}
            >
              <View style={styles.halfCardIconError}>
                <MaterialIcons name="assessment" size={24} color="#93000a" />
              </View>
              <View>
                <Text style={styles.halfCardTitle}>Incident Reports</Text>
                <Text style={styles.halfCardValueError}>02</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.feedSection}>
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>Live Site Feed</Text>
            <Text style={styles.feedViewAll}>VIEW ALL</Text>
          </View>
          <View style={styles.feedImageContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaJ3jphvfZ2-MtCX0BeysIYVTLYd6eekZZ_EJ5O-caf18b0wpW5_H4hUlhYByk6L-D0YErokBIn8Be_pyy9cSkmciw3m6fEk9144GNiOU2h0rTuiLoqvvJtI-UA0KJCzqe8uOn5c6da8ntdOlbqrBXuYgbthGYy5piHUfxuz6ioWGofpzvxbC9HW3IMSRKDDHw997r5I7fTMRcj5BSW7sKZjmH-W1lWtFXWQzZuvHfKmMq3cOYwfQGoKAqhMbyjhhJOsOWUk09fpE' }} 
              style={styles.feedImage}
            />
            <View style={styles.feedOverlay}>
              <MaterialIcons name="videocam" size={14} color="#ffffff" />
              <Text style={styles.feedOverlayText}>CAM-04: Main Entrance North</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.sosBtn}>
        <MaterialIcons name="emergency" size={28} color="#ffffff" />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <MaterialIcons name="home" size={24} color="#002e85" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="assignment-turned-in" size={24} color="#64748b" />
          <Text style={styles.navText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="fact-check" size={24} color="#64748b" />
          <Text style={styles.navText}>Checklist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="assessment" size={24} color="#64748b" />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#64748b" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, height: 56, backgroundColor: '#ffffff',
    borderBottomWidth: 1, borderBottomColor: '#e2e8f0', zIndex: 50
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002e85', marginLeft: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  langBtn: {
    borderWidth: 2, borderColor: '#cbd5e1', borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 4
  },
  langBtnText: { fontSize: 12, fontWeight: 'bold', color: '#002e85' },
  container: { padding: 16, paddingBottom: 100 },
  greetingSection: { marginBottom: 16 },
  greetingTitle: { fontSize: 24, fontWeight: '900', color: '#0f1623' },
  greetingSubtitle: { fontSize: 14, color: '#444652', marginTop: 4 },
  heroCard: {
    backgroundColor: '#002e85', borderRadius: 12, padding: 20,
    marginBottom: 16, overflow: 'hidden', position: 'relative',
    elevation: 6, shadowColor: '#002e85', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  heroLabel: { color: '#dbe1ff', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  heroTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16
  },
  statusDotWrapper: { position: 'relative', width: 8, height: 8 },
  statusDotPing: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80', opacity: 0.7 },
  statusDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#ffffff' },
  heroBottomRow: { flexDirection: 'row', gap: 16 },
  heroInfoPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8
  },
  heroInfoText: { color: '#b4c5ff', fontSize: 14, fontWeight: '500' },
  heroBgIcon: { position: 'absolute', right: -30, bottom: -30, opacity: 0.1 },
  quickGrid: { marginBottom: 16 },
  fullWidthCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginBottom: 16,
    borderBottomWidth: 4, borderBottomColor: '#002e85', elevation: 2
  },
  fwCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  fwIconWrapper: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#e0e7ff',
    alignItems: 'center', justifyContent: 'center'
  },
  fwCardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623' },
  fwCardSubtitle: { fontSize: 12, color: '#444652', marginTop: 2 },
  halfGrid: { flexDirection: 'row', gap: 16 },
  halfCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 2
  },
  halfCardIconFact: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: '#ccd6ff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12
  },
  halfCardIconError: {
    width: 40, height: 40, borderRadius: 8, backgroundColor: '#ffdad6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12
  },
  halfCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f1623' },
  halfCardValuePrimary: { fontSize: 24, fontWeight: '900', color: '#002e85', marginTop: 4 },
  halfCardValueError: { fontSize: 24, fontWeight: '900', color: '#ba1a1a', marginTop: 4 },
  feedSection: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, elevation: 2 },
  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  feedTitle: { fontSize: 14, fontWeight: 'bold', color: '#444652' },
  feedViewAll: { fontSize: 10, fontWeight: 'bold', color: '#002e85' },
  feedImageContainer: { height: 160, borderRadius: 8, overflow: 'hidden', position: 'relative' },
  feedImage: { width: '100%', height: '100%' },
  feedOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  feedOverlayText: { color: '#ffffff', fontSize: 10, fontWeight: '500' },
  sosBtn: {
    position: 'absolute', right: 24, bottom: 96, zIndex: 100,
    width: 64, height: 64, padding: 0, borderRadius: 32, backgroundColor: '#ba1a1a',
    alignItems: 'center', justifyContent: 'center', elevation: 12,
    borderWidth: 4, borderColor: '#ffdad6', shadowColor: '#ba1a1a', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.4, shadowRadius: 8
  },
  sosText: { color: '#ffffff', fontSize: 10, fontWeight: '900', marginTop: -2 },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
    backgroundColor: 'rgba(255,255,255,0.95)', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#f1f5f9', borderTopLeftRadius: 16, borderTopRightRadius: 16
  },
  navItemActive: {
    alignItems: 'center', justifyContent: 'center', width: 64, height: 60,
    backgroundColor: '#eff6ff', borderRadius: 12
  },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 64, height: 60 },
  navTextActive: { fontSize: 12, fontWeight: '600', color: '#002e85', marginTop: 4 },
  navText: { fontSize: 12, fontWeight: '500', color: '#64748b', marginTop: 4 }
});
