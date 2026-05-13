import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export default function SOSFloatingButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('EmergencySOSActive')}
      activeOpacity={0.85}
    >
      <MaterialIcons name="emergency" size={20} color={Colors.textWhite} />
      <Text style={styles.label}>SOS</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 106 : 90,
    right: 20,
    backgroundColor: Colors.danger,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    zIndex: 999,
    gap: 2,
  },
  label: {
    color: Colors.textWhite,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
