import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../theme/colors';

export interface SuccessModalProps {
  visible: boolean;
  onAnimationEnd?: () => void;
  message?: string;
}

export function SuccessModal({ visible, onAnimationEnd, message = "Registro salvo!" }: SuccessModalProps) {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 5,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Wait 1.5 seconds then fade out and call onAnimationEnd
        setTimeout(() => {
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            if (onAnimationEnd) onAnimationEnd();
            scaleValue.setValue(0);
          });
        }, 1500);
      });
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { opacity: opacityValue, transform: [{ scale: scaleValue }] }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark" size={64} color="#1A5336" />
          </View>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.paddingLg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1F4D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
});
