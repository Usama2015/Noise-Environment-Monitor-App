/**
 * NoiseHistory Component Tests
 *
 * Tests for the noise history list component including rendering,
 * empty states, and data display.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { NoiseHistory, NoiseReading } from '../../src/components/NoiseHistory';

// Helper to create test readings
function createReading(
  decibels: number,
  category: 'Quiet' | 'Normal' | 'Noisy',
  minutesAgo: number = 0,
  description?: string
): NoiseReading {
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

  return {
    decibels,
    category,
    timestamp,
    description,
  };
}

describe('NoiseHistory', () => {
  describe('Empty state', () => {
    it('should show empty message when no readings', () => {
      const { getByText } = render(
        <NoiseHistory readings={[]} />
      );

      expect(getByText('No readings yet')).toBeTruthy();
      expect(getByText('Start monitoring to see history')).toBeTruthy();
    });

    it('should not show title when empty', () => {
      const { queryByText } = render(
        <NoiseHistory readings={[]} />
      );

      expect(queryByText('Recent Readings')).toBeNull();
    });
  });

  describe('Rendering readings', () => {
    it('should render single reading', () => {
      const readings = [createReading(65.4, 'Normal')];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('Recent Readings')).toBeTruthy();
      expect(getByText('65.4 dB')).toBeTruthy();
      expect(getByText('Normal')).toBeTruthy();
    });

    it('should render multiple readings', () => {
      const readings = [
        createReading(45.2, 'Quiet'),
        createReading(68.7, 'Normal'),
        createReading(82.1, 'Noisy'),
      ];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('45.2 dB')).toBeTruthy();
      expect(getByText('68.7 dB')).toBeTruthy();
      expect(getByText('82.1 dB')).toBeTruthy();
    });

    it('should show descriptions when provided', () => {
      const readings = [
        createReading(65, 'Normal', 0, 'Voice / Music'),
      ];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('Voice / Music')).toBeTruthy();
    });

    it('should not show descriptions when not provided', () => {
      const readings = [
        createReading(65, 'Normal'),
      ];

      const { queryByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(queryByText('Voice / Music')).toBeNull();
    });
  });

  describe('Category indicators', () => {
    it('should show green dot for Quiet', () => {
      const readings = [createReading(40, 'Quiet')];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('🟢')).toBeTruthy();
      expect(getByText('Quiet')).toBeTruthy();
    });

    it('should show yellow dot for Normal', () => {
      const readings = [createReading(60, 'Normal')];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('🟡')).toBeTruthy();
      expect(getByText('Normal')).toBeTruthy();
    });

    it('should show red dot for Noisy', () => {
      const readings = [createReading(80, 'Noisy')];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('🔴')).toBeTruthy();
      expect(getByText('Noisy')).toBeTruthy();
    });
  });

  describe('Max readings limit', () => {
    it('should limit to maxReadings', () => {
      const readings = Array.from({ length: 20 }, (_, i) =>
        createReading(50 + i, 'Normal')
      );

      const { queryByText } = render(
        <NoiseHistory readings={readings} maxReadings={5} />
      );

      // Should show last 5 (newest)
      expect(queryByText('69.0 dB')).toBeTruthy(); // reading 19
      expect(queryByText('68.0 dB')).toBeTruthy(); // reading 18
      expect(queryByText('67.0 dB')).toBeTruthy(); // reading 17
      expect(queryByText('66.0 dB')).toBeTruthy(); // reading 16
      expect(queryByText('65.0 dB')).toBeTruthy(); // reading 15

      // Should not show older ones
      expect(queryByText('50.0 dB')).toBeNull(); // reading 0
      expect(queryByText('51.0 dB')).toBeNull(); // reading 1
    });

    it('should default to 10 readings', () => {
      const readings = Array.from({ length: 15 }, (_, i) =>
        createReading(50 + i, 'Normal')
      );

      const { queryByText } = render(
        <NoiseHistory readings={readings} />
      );

      // Should show last 10
      expect(queryByText('64.0 dB')).toBeTruthy(); // reading 14
      expect(queryByText('55.0 dB')).toBeTruthy(); // reading 5

      // Should not show first 5
      expect(queryByText('50.0 dB')).toBeNull(); // reading 0
    });
  });

  describe('Timestamps', () => {
    it('should show timestamps by default', () => {
      const readings = [createReading(65, 'Normal', 5)];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('5m ago')).toBeTruthy();
    });

    it('should hide timestamps when showTimestamps=false', () => {
      const readings = [createReading(65, 'Normal', 5)];

      const { queryByText } = render(
        <NoiseHistory readings={readings} showTimestamps={false} />
      );

      expect(queryByText(/ago/)).toBeNull();
    });

    it('should format seconds correctly', () => {
      const reading = createReading(65, 'Normal');
      reading.timestamp = new Date(Date.now() - 30 * 1000); // 30 seconds ago

      const { getByText } = render(
        <NoiseHistory readings={[reading]} />
      );

      expect(getByText(/\d+s ago/)).toBeTruthy();
    });

    it('should format minutes correctly', () => {
      const reading = createReading(65, 'Normal', 15);

      const { getByText } = render(
        <NoiseHistory readings={[reading]} />
      );

      expect(getByText('15m ago')).toBeTruthy();
    });

    it('should format hours correctly', () => {
      const reading = createReading(65, 'Normal');
      reading.timestamp = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago

      const { getByText } = render(
        <NoiseHistory readings={[reading]} />
      );

      expect(getByText('2h ago')).toBeTruthy();
    });
  });

  describe('Decibel formatting', () => {
    it('should format to 1 decimal place', () => {
      const readings = [createReading(65.456, 'Normal')];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('65.5 dB')).toBeTruthy();
    });

    it('should handle integer values', () => {
      const readings = [createReading(70, 'Noisy')];

      const { getByText } = render(
        <NoiseHistory readings={readings} />
      );

      expect(getByText('70.0 dB')).toBeTruthy();
    });
  });

  describe('Snapshot tests', () => {
    it('should match snapshot for empty state', () => {
      const { toJSON } = render(
        <NoiseHistory readings={[]} />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with readings', () => {
      const readings = [
        createReading(45.2, 'Quiet', 1, 'Tonal Sound'),
        createReading(68.7, 'Normal', 3, 'Voice / Music'),
        createReading(82.1, 'Noisy', 5, 'Traffic / Heavy Machinery'),
      ];

      const { toJSON } = render(
        <NoiseHistory readings={readings} />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot without timestamps', () => {
      const readings = [
        createReading(60, 'Normal'),
      ];

      const { toJSON } = render(
        <NoiseHistory readings={readings} showTimestamps={false} />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
