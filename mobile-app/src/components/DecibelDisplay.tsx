/**
 * DecibelDisplay Component
 *
 * Displays the current decibel level with a large, animated number
 * and visual color indicator based on noise category.
 *
 * Features:
 * - Large, prominent decibel value
 * - Smooth number transitions
 * - Color-coded background based on category
 * - Responsive sizing
 *
 * @see PROJECT_PLAN.md - Step 1.7: Basic UI Implementation
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { NoiseCategory } from '../services/NoiseClassifier';

export interface DecibelDisplayProps {
  /** Current decibel value */
  decibels: number;
  /** Noise category for color coding */
  category: NoiseCategory;
  /** Optional label */
  label?: string;
}

/**
 * Get background color based on noise category
 */
function getCategoryBackgroundColor(category: NoiseCategory): string {
  switch (category) {
    case 'Quiet':
      return '#E8F5E9'; // Light green
    case 'Normal':
      return '#FFF9C4'; // Light yellow
    case 'Noisy':
      return '#FFEBEE'; // Light red
  }
}

/**
 * Get text color based on noise category
 */
function getCategoryTextColor(category: NoiseCategory): string {
  switch (category) {
    case 'Quiet':
      return '#2E7D32'; // Dark green
    case 'Normal':
      return '#F57C00'; // Dark orange
    case 'Noisy':
      return '#C62828'; // Dark red
  }
}

/**
 * DecibelDisplay component
 *
 * @example
 * ```tsx
 * <DecibelDisplay
 *   decibels={65.4}
 *   category="Normal"
 *   label="Current Level"
 * />
 * ```
 */
export const DecibelDisplay: React.FC<DecibelDisplayProps> = ({
  decibels,
  category,
  label = 'Sound Level',
}) => {
  // Animated value for smooth transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when decibel value changes significantly
  useEffect(() => {
    // Pulse effect
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [decibels, category, fadeAnim, scaleAnim]);

  const backgroundColor = getCategoryBackgroundColor(category);
  const textColor = getCategoryTextColor(category);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.displayBox,
          {
            backgroundColor,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.decibelValue, { color: textColor }]}>
          {decibels.toFixed(1)}
        </Text>
        <Text style={[styles.unit, { color: textColor }]}>dB</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  displayBox: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  decibelValue: {
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 72,
  },
  unit: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
});
