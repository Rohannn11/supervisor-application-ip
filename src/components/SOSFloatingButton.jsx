import React, { useRef, useState } from 'react';
import {
  Animated, PanResponder, Text, StyleSheet, Platform,
  Vibration, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const INITIAL_BOTTOM = Platform.OS === 'ios' ? 106 : 90;
const INITIAL_RIGHT = 20;

/**
 * Floating SOS button:
 *  - Drag to reposition anywhere on screen
 *  - Long press (800ms) to trigger SOS → navigates to EmergencySOSActive
 *  - Single tap shows hold-to-activate hint
 */
export default function SOSFloatingButton() {
  const navigation = useNavigation();
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressing, setIsPressing] = useState(false);
  const longPressTimer = useRef(null);
  const didDrag = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > 4 || Math.abs(gs.dy) > 4,

      onPanResponderGrant: () => {
        didDrag.current = false;
        // Start long-press timer
        longPressTimer.current = setTimeout(() => {
          if (!didDrag.current) {
            Vibration.vibrate(200);
            // Navigate to SOS screen
            navigation.navigate('HomeTab', { screen: 'EmergencySOSActive' });
          }
        }, 800);

        // Pulse animation while pressing
        setIsPressing(true);
        Animated.spring(scaleAnim, {
          toValue: 1.18,
          useNativeDriver: true,
        }).start();

        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: (_, gs) => {
        if (Math.abs(gs.dx) > 6 || Math.abs(gs.dy) > 6) {
          didDrag.current = true;
          clearTimeout(longPressTimer.current);
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
          setIsPressing(false);
        }
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(null, gs);
      },

      onPanResponderRelease: () => {
        clearTimeout(longPressTimer.current);
        setIsPressing(false);
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        pan.flattenOffset();

        if (!didDrag.current) {
          // Single tap – hint
          Alert.alert('SOS', 'Hold the SOS button for 1 second to activate emergency alert.');
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scaleAnim },
          ],
        },
        isPressing && styles.fabPressing,
      ]}
      {...panResponder.panHandlers}
    >
      <MaterialIcons name="emergency" size={22} color={Colors.textWhite} />
      <Text style={styles.label}>SOS</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: INITIAL_BOTTOM,
    right: INITIAL_RIGHT,
    backgroundColor: Colors.danger,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 14,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 9999,
    gap: 2,
  },
  fabPressing: {
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 20,
  },
  label: {
    color: Colors.textWhite,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
