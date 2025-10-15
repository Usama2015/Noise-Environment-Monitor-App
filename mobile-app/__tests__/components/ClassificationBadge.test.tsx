/**
 * ClassificationBadge Component Tests
 *
 * Tests for the classification badge component including rendering,
 * confidence indicators, and descriptions.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ClassificationBadge } from '../../src/components/ClassificationBadge';

describe('ClassificationBadge', () => {
  describe('Basic rendering', () => {
    it('should render category and icon', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
        />
      );

      expect(getByText('Normal')).toBeTruthy();
      expect(getByText('🟡')).toBeTruthy();
    });

    it('should render with description', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
          description="Voice / Music"
        />
      );

      expect(getByText('Normal')).toBeTruthy();
      expect(getByText('Voice / Music')).toBeTruthy();
    });

    it('should render without description', () => {
      const { queryByText } = render(
        <ClassificationBadge
          category="Quiet"
          color="#4CAF50"
          icon="🟢"
        />
      );

      expect(queryByText('Voice / Music')).toBeNull();
    });
  });

  describe('Confidence indicator', () => {
    it('should render confidence bar and value', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
          confidence={0.85}
        />
      );

      expect(getByText('Confidence:')).toBeTruthy();
      expect(getByText('85%')).toBeTruthy();
    });

    it('should format confidence as percentage', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Quiet"
          color="#4CAF50"
          icon="🟢"
          confidence={0.725}
        />
      );

      expect(getByText('73%')).toBeTruthy(); // Rounds to nearest integer
    });

    it('should handle 100% confidence', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Noisy"
          color="#F44336"
          icon="🔴"
          confidence={1.0}
        />
      );

      expect(getByText('100%')).toBeTruthy();
    });

    it('should handle 0% confidence', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
          confidence={0}
        />
      );

      expect(getByText('0%')).toBeTruthy();
    });

    it('should not render confidence if not provided', () => {
      const { queryByText } = render(
        <ClassificationBadge
          category="Quiet"
          color="#4CAF50"
          icon="🟢"
        />
      );

      expect(queryByText('Confidence:')).toBeNull();
    });
  });

  describe('Category information', () => {
    it('should render category info when provided', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Quiet"
          color="#4CAF50"
          icon="🟢"
          categoryInfo="Library, study room, quiet office (<50 dB)"
        />
      );

      expect(getByText('Library, study room, quiet office (<50 dB)')).toBeTruthy();
    });

    it('should not render category info if not provided', () => {
      const { queryByText } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
        />
      );

      expect(queryByText(/Library/)).toBeNull();
    });
  });

  describe('All categories', () => {
    it('should render Quiet badge correctly', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Quiet"
          color="#4CAF50"
          icon="🟢"
        />
      );

      expect(getByText('Quiet')).toBeTruthy();
      expect(getByText('🟢')).toBeTruthy();
    });

    it('should render Normal badge correctly', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
        />
      );

      expect(getByText('Normal')).toBeTruthy();
      expect(getByText('🟡')).toBeTruthy();
    });

    it('should render Noisy badge correctly', () => {
      const { getByText } = render(
        <ClassificationBadge
          category="Noisy"
          color="#F44336"
          icon="🔴"
        />
      );

      expect(getByText('Noisy')).toBeTruthy();
      expect(getByText('🔴')).toBeTruthy();
    });
  });

  describe('Snapshot tests', () => {
    it('should match snapshot with minimal props', () => {
      const { toJSON } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot with all props', () => {
      const { toJSON } = render(
        <ClassificationBadge
          category="Normal"
          color="#FFC107"
          icon="🟡"
          description="Voice / Music"
          confidence={0.87}
          categoryInfo="Conversation, cafeteria, normal office (50-70 dB)"
        />
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
