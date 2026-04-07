import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';

export default function GPSStatusBar() {
  const { gpsStatus } = useAppContext();
  const isConnected = gpsStatus === 'connected';

  return (
    <View style={[styles.bar, isConnected ? styles.barConnected : styles.barDisconnected]}>
      <View style={[styles.dot, isConnected ? styles.dotGreen : styles.dotRed]} />
      <Text style={styles.text}>
        {isConnected ? 'GPS CONNECTED' : 'GPS DISCONNECTED'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  barConnected: {
    backgroundColor: '#dcfce7',
  },
  barDisconnected: {
    backgroundColor: Colors.dangerLight,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGreen: {
    backgroundColor: Colors.gpsOnline,
  },
  dotRed: {
    backgroundColor: Colors.gpsOffline,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 1,
  },
});
