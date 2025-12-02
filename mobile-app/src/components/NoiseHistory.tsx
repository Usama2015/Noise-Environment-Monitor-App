/**
 * NoiseHistory Component
 *
 * Displays a list of recent noise readings with decibel values
 * and classifications.
 *
 * Features:
 * - Scrollable list of readings
 * - Color-coded entries
 * - Timestamp display
 * - Limit to last N readings
 *
 * @see PROJECT_PLAN.md - Step 1.7: Basic UI Implementation
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NoiseCategory } from '../services/NoiseClassifier';

export interface NoiseReading {
  /** Decibel value */
  decibels: number;
  /** Classification category */
  category: NoiseCategory;
  /** Timestamp */
  timestamp: Date;
  /** Optional description */
  description?: string;
}

export interface NoiseHistoryProps {
  /** Array of noise readings */
  readings: NoiseReading[];
  /** Maximum number of readings to display */
  maxReadings?: number;
  /** Show timestamps */
  showTimestamps?: boolean;
}

/**
 * Get color dot for category
 */
function getCategoryDot(category: NoiseCategory): string {
  switch (category) {
    case 'Quiet':
      return '🟢';
    case 'Normal':
      return '🟡';
    case 'Noisy':
      return '🔴';
  }
}

/**
 * Format timestamp for display
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  }

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return date.toLocaleTimeString();
}

/**
 * NoiseHistory component
 *
 * @example
 * ```tsx
 * <NoiseHistory
 *   readings={recentReadings}
 *   maxReadings={10}
 *   showTimestamps={true}
 * />
 * ```
 */
export const NoiseHistory: React.FC<NoiseHistoryProps> = ({
  readings,
  maxReadings = 10,
  showTimestamps = true,
}) => {
  // Limit to max readings and sort by timestamp (newest first)
  const displayReadings = readings
    .slice(-maxReadings)
    .reverse();

  if (displayReadings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No readings yet</Text>
        <Text style={styles.emptySubtext}>
          Start monitoring to see history
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Readings</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayReadings.map((reading, index) => (
          <View
            key={`${reading.timestamp.getTime()}-${index}`}
            style={styles.readingItem}
          >
            <View style={styles.readingLeft}>
              <Text style={styles.dot}>{getCategoryDot(reading.category)}</Text>
              <View style={styles.readingInfo}>
                <View style={styles.readingMain}>
                  <Text style={styles.decibelText}>
                    {reading.decibels.toFixed(1)} dB
                  </Text>
                  <Text style={styles.categoryText}>{reading.category}</Text>
                </View>
                {reading.description && (
                  <Text style={styles.descriptionText} numberOfLines={1}>
                    {reading.description}
                  </Text>
                )}
              </View>
            </View>

            {showTimestamps && (
              <Text style={styles.timestamp}>
                {formatTimestamp(reading.timestamp)}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    maxHeight: 300,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginBottom: 8,
  },
  readingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    fontSize: 16,
    marginRight: 12,
  },
  readingInfo: {
    flex: 1,
  },
  readingMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decibelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  descriptionText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#BBB',
  },
});
