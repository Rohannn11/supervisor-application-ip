import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, languages } = useAppContext();

  if (compact) {
    // Compact version for headers — shows current + cycles on tap
    const currentIdx = languages.findIndex(l => l.code === language);
    const displayCodes = languages.map(l => l.code).join('/');

    return (
      <TouchableOpacity
        style={styles.compactBtn}
        onPress={() => {
          const nextIdx = (currentIdx + 1) % languages.length;
          setLanguage(languages[nextIdx].code);
        }}
      >
        <Text style={styles.compactBtnText}>{displayCodes.substring(0, 8)}</Text>
      </TouchableOpacity>
    );
  }

  // Full version for settings/profile
  return (
    <View style={styles.fullContainer}>
      <Text style={styles.sectionTitle}>SELECT LANGUAGE</Text>
      <View style={styles.langRow}>
        {languages.map(lang => {
          const isActive = language === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={styles.langOption}
              onPress={() => setLanguage(lang.code)}
            >
              <View style={[styles.langCircle, isActive && styles.langCircleActive]}>
                <Text style={[styles.langCode, isActive && styles.langCodeActive]}>
                  {lang.code}
                </Text>
              </View>
              <Text style={[styles.langName, isActive && styles.langNameActive]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactBtn: {
    borderWidth: 2,
    borderColor: Colors.borderMuted,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  compactBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  fullContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(68, 70, 82, 0.6)',
    letterSpacing: 2,
    marginBottom: 16,
  },
  langRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  langOption: {
    alignItems: 'center',
    gap: 4,
  },
  langCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.borderMuted,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  langCircleActive: {
    borderColor: Colors.primary,
    opacity: 1,
  },
  langCode: {
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  langCodeActive: {
    color: Colors.primary,
  },
  langName: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 4,
    opacity: 0.6,
  },
  langNameActive: {
    color: Colors.primary,
    opacity: 1,
  },
});
