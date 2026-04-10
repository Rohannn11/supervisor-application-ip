import React, { useRef, useState, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text, View, Vibration } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme/colors';

export default function SOSFloatingButton() {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [pressing, setPressing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const pressTimer = useRef(null);
  const countdownTimer = useRef(null);

  useEffect(() => {
    // Continuous subtle pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handlePressIn = () => {
    setPressing(true);
    setCountdown(3);
    Vibration.vibrate(100);

    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();

    let count = 3;
    countdownTimer.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownTimer.current);
      }
    }, 1000);

    pressTimer.current = setTimeout(() => {
      Vibration.vibrate([0, 200, 100, 200]);
      navigation.navigate('HomeTab', { screen: 'EmergencySOSActive' });
      setPressing(false);
      setCountdown(0);
    }, 3000);
  };

  const handlePressOut = () => {
    setPressing(false);
    setCountdown(0);
    clearTimeout(pressTimer.current);
    clearInterval(countdownTimer.current);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
      <Animated.View style={[styles.btnWrapper, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={styles.btn}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          {pressing ? (
            <Text style={styles.countdownText}>{countdown}</Text>
          ) : (
            <>
              <MaterialIcons name="emergency" size={26} color={Colors.textWhite} />
              <Text style={styles.sosText}>SOS</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    zIndex: 999,
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(186, 26, 26, 0.25)',
  },
  btnWrapper: {
    width: 64,
    height: 64,
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: Colors.dangerLight,
  },
  sosText: {
    color: Colors.textWhite,
    fontSize: 10,
    fontWeight: '900',
    marginTop: -2,
  },
  countdownText: {
    color: Colors.textWhite,
    fontSize: 28,
    fontWeight: '900',
  },
});
