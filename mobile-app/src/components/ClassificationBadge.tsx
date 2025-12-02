/**
 * ClassificationBadge Component
 *
 * Displays the noise classification category with color-coded badge,
 * icon, and descriptive text.
 *
 * Features:
 * - Color-coded badge (green/yellow/red)
 * - Category icon (emoji)
 * - Category label
 * - Optional description
 * - Confidence indicator
 *
 * @see PROJECT_PLAN.md - Step 1.7: Basic UI Implementation
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NoiseCategory } from '../services/NoiseClassifier';

export interface ClassificationBadgeProps {
  /** Noise category */
  category: NoiseCategory;
  /** Hex color code for badge */
  color: string;
  /** Icon for category (emoji) */
  icon: string;
  /** Optional description of noise type */
  description?: string;
  /** Optional confidence score (0-1) */
  confidence?: number;
  /** Optional detailed category info */
  categoryInfo?: string;
}

/**
 * ClassificationBadge component
 *
 * @example
 * ```tsx
 * <ClassificationBadge
 *   category="Normal"
 *   color="#FFC107"
 *   icon="🟡"
 *   description="Voice / Music"
 *   confidence={0.85}
 * />
 * ```
 */
export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  category,
  color,
  icon,
  description,
  confidence,
  categoryInfo,
}) => {
  return (
    <View style={styles.container}>
      {/* Main badge */}
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.categoryText}>{category}</Text>
      </View>

      {/* Noise type description */}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {/* Confidence indicator */}
      {confidence !== undefined && (
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence:</Text>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceFill,
                {
                  width: `${confidence * 100}%`,
                  backgroundColor: getConfidenceColor(confidence),
                },
              ]}
            />
          </View>
          <Text style={styles.confidenceValue}>
            {(confidence * 100).toFixed(0)}%
          </Text>
        </View>
      )}

      {/* Category information */}
      {categoryInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{categoryInfo}</Text>
        </View>
      )}
    </View>
  );
};

/**
 * Get color for confidence bar based on confidence level
 */
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return '#4CAF50'; // High confidence - green
  if (confidence >= 0.6) return '#FFC107'; // Medium confidence - yellow
  return '#FF9800'; // Low confidence - orange
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    width: '80%',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
    width: 70,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
    width: 40,
    textAlign: 'right',
  },
  infoContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    maxWidth: '90%',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});
