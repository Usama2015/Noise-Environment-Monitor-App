/**
 * DecibelDisplay Component Tests
 *
 * Tests for the decibel display component including rendering,
 * styling, and animations.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { DecibelDisplay } from '../../src/components/DecibelDisplay';

describe('DecibelDisplay', () => {
  describe('Rendering', () => {
    it('should render with decibel value', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={65.4} category="Normal" />
      );

      expect(getByText('65.4')).toBeTruthy();
      expect(getByText('dB')).toBeTruthy();
    });

    it('should render with custom label', () => {
      const { getByText } = render(
        <DecibelDisplay
          decibels={45.2}
          category="Quiet"
          label="Test Label"
        />
      );

      expect(getByText('Test Label')).toBeTruthy();
      expect(getByText('45.2')).toBeTruthy();
    });

    it('should render with default label', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={75.0} category="Noisy" />
      );

      expect(getByText('Sound Level')).toBeTruthy();
    });
  });

  describe('Decibel formatting', () => {
    it('should format decibels to 1 decimal place', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={65.456} category="Normal" />
      );

      expect(getByText('65.5')).toBeTruthy();
    });

    it('should handle integer decibels', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={70} category="Noisy" />
      );

      expect(getByText('70.0')).toBeTruthy();
    });

    it('should handle zero decibels', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={0} category="Quiet" />
      );

      expect(getByText('0.0')).toBeTruthy();
    });
  });

  describe('Category-based styling', () => {
    it('should render for Quiet category', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={40} category="Quiet" />
      );

      const decibelText = getByText('40.0');
      expect(decibelText).toBeTruthy();
    });

    it('should render for Normal category', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={60} category="Normal" />
      );

      const decibelText = getByText('60.0');
      expect(decibelText).toBeTruthy();
    });

    it('should render for Noisy category', () => {
      const { getByText } = render(
        <DecibelDisplay decibels={80} category="Noisy" />
      );

      const decibelText = getByText('80.0');
      expect(decibelText).toBeTruthy();
    });
  });

  describe('Snapshot tests', () => {
    it('should match snapshot for Quiet', () => {
      const { toJSON } = render(
        <DecibelDisplay decibels={45} category="Quiet" />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot for Normal', () => {
      const { toJSON } = render(
        <DecibelDisplay decibels={65} category="Normal" />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot for Noisy', () => {
      const { toJSON } = render(
        <DecibelDisplay decibels={85} category="Noisy" />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
