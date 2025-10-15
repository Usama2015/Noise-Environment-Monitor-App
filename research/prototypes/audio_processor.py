#!/usr/bin/env python3
"""
Audio Processor for Noise Environment Monitor
Phase 0: Proof of Concept

This module handles audio file reading, decibel calculation,
filtering, FFT analysis, and feature extraction.

Author: Group 4 (GMU)
Date: 2025-10-14
"""

import numpy as np
import librosa
import soundfile as sf
from scipy import signal
from typing import Tuple, Dict, Optional
import warnings

warnings.filterwarnings('ignore')


class AudioProcessor:
    """
    Process audio files to extract noise features and classify environments.
    """

    def __init__(self, sample_rate: int = 44100):
        """
        Initialize the audio processor.

        Args:
            sample_rate: Target sample rate for audio processing (Hz)
        """
        self.sample_rate = sample_rate
        self.reference_pressure = 20e-6  # Reference pressure in Pa (20 micropascals)

    def load_audio(self, file_path: str) -> Tuple[np.ndarray, int]:
        """
        Load audio file and resample if necessary.

        Args:
            file_path: Path to audio file (WAV, MP3, etc.)

        Returns:
            Tuple of (audio_samples, sample_rate)
        """
        try:
            # Load audio file with librosa (handles multiple formats)
            audio, sr = librosa.load(file_path, sr=self.sample_rate, mono=True)

            print(f"[OK] Loaded audio: {file_path}")
            print(f"  Duration: {len(audio) / sr:.2f} seconds")
            print(f"  Sample rate: {sr} Hz")
            print(f"  Samples: {len(audio)}")

            return audio, sr
        except Exception as e:
            raise ValueError(f"Error loading audio file: {e}")

    def calculate_rms(self, audio: np.ndarray) -> float:
        """
        Calculate Root Mean Square (RMS) of audio signal.

        Args:
            audio: Audio samples (numpy array)

        Returns:
            RMS value
        """
        return np.sqrt(np.mean(audio**2))

    def calculate_decibels(self, audio: np.ndarray, window_size: int = 4096) -> np.ndarray:
        """
        Calculate decibel levels (dB SPL) from audio samples.

        Uses windowed RMS calculation for time-varying decibel levels.

        Args:
            audio: Audio samples
            window_size: Size of window for RMS calculation (samples)

        Returns:
            Array of decibel values over time
        """
        # Pad audio if too short
        if len(audio) < window_size:
            audio = np.pad(audio, (0, window_size - len(audio)), mode='constant')

        # Calculate RMS in sliding windows
        num_windows = len(audio) // (window_size // 2) - 1
        db_values = []

        for i in range(num_windows):
            start = i * (window_size // 2)
            end = start + window_size

            if end > len(audio):
                break

            window = audio[start:end]
            rms = self.calculate_rms(window)

            # Convert to dB SPL
            # dB = 20 * log10(RMS / reference)
            # Add small epsilon to avoid log(0)
            epsilon = 1e-10
            db = 20 * np.log10(rms + epsilon)

            # Normalize to typical environmental range (0-120 dB)
            # This calibration factor may need adjustment based on actual recordings
            db_normalized = db + 94  # Calibration offset
            db_values.append(db_normalized)

        return np.array(db_values)

    def moving_average_filter(self, data: np.ndarray, window_size: int = 10) -> np.ndarray:
        """
        Apply moving average filter to smooth data.

        Args:
            data: Input data (1D array)
            window_size: Size of moving window

        Returns:
            Filtered data
        """
        if len(data) < window_size:
            return data

        # Use convolution for efficient moving average
        kernel = np.ones(window_size) / window_size
        filtered = np.convolve(data, kernel, mode='same')

        return filtered

    def perform_fft(self, audio: np.ndarray, n_fft: int = 2048) -> Tuple[np.ndarray, np.ndarray]:
        """
        Perform Fast Fourier Transform on audio signal.

        Args:
            audio: Audio samples
            n_fft: FFT size (number of frequency bins)

        Returns:
            Tuple of (frequencies, magnitudes)
        """
        # Apply Hamming window to reduce spectral leakage
        window = np.hamming(len(audio))
        windowed_audio = audio * window

        # Perform FFT
        fft_result = np.fft.rfft(windowed_audio, n=n_fft)

        # Calculate magnitude spectrum
        magnitudes = np.abs(fft_result)

        # Calculate corresponding frequencies
        frequencies = np.fft.rfftfreq(n_fft, 1/self.sample_rate)

        return frequencies, magnitudes

    def extract_spectral_features(self, frequencies: np.ndarray, magnitudes: np.ndarray) -> Dict[str, float]:
        """
        Extract frequency-domain features from FFT output.

        Args:
            frequencies: Frequency bins (Hz)
            magnitudes: Magnitude values

        Returns:
            Dictionary of features
        """
        # Normalize magnitudes
        magnitudes_norm = magnitudes / (np.sum(magnitudes) + 1e-10)

        # Spectral Centroid (weighted mean of frequencies)
        spectral_centroid = np.sum(frequencies * magnitudes_norm)

        # Spectral Spread (standard deviation of frequency)
        spectral_spread = np.sqrt(np.sum(((frequencies - spectral_centroid) ** 2) * magnitudes_norm))

        # Spectral Rolloff (frequency below which 85% of energy is contained)
        cumsum = np.cumsum(magnitudes_norm)
        rolloff_idx = np.where(cumsum >= 0.85)[0]
        spectral_rolloff = frequencies[rolloff_idx[0]] if len(rolloff_idx) > 0 else frequencies[-1]

        # Spectral Flatness (measure of noisiness)
        # Ratio of geometric mean to arithmetic mean
        geometric_mean = np.exp(np.mean(np.log(magnitudes + 1e-10)))
        arithmetic_mean = np.mean(magnitudes)
        spectral_flatness = geometric_mean / (arithmetic_mean + 1e-10)

        # Zero Crossing Rate (calculated from time domain - approximation here)
        spectral_entropy = -np.sum(magnitudes_norm * np.log2(magnitudes_norm + 1e-10))

        # Dominant frequency
        dominant_freq_idx = np.argmax(magnitudes)
        dominant_frequency = frequencies[dominant_freq_idx]

        # Energy in different frequency bands
        low_freq_energy = np.sum(magnitudes[frequencies < 250])  # < 250 Hz
        mid_freq_energy = np.sum(magnitudes[(frequencies >= 250) & (frequencies < 4000)])  # 250-4000 Hz
        high_freq_energy = np.sum(magnitudes[frequencies >= 4000])  # > 4000 Hz

        total_energy = low_freq_energy + mid_freq_energy + high_freq_energy

        return {
            'spectral_centroid': spectral_centroid,
            'spectral_spread': spectral_spread,
            'spectral_rolloff': spectral_rolloff,
            'spectral_flatness': spectral_flatness,
            'spectral_entropy': spectral_entropy,
            'dominant_frequency': dominant_frequency,
            'low_freq_ratio': low_freq_energy / (total_energy + 1e-10),
            'mid_freq_ratio': mid_freq_energy / (total_energy + 1e-10),
            'high_freq_ratio': high_freq_energy / (total_energy + 1e-10),
        }

    def classify_noise_simple(self, avg_db: float) -> str:
        """
        Simple threshold-based noise classification.

        Args:
            avg_db: Average decibel level

        Returns:
            Classification label ('Quiet', 'Normal', or 'Noisy')
        """
        if avg_db < 50:
            return 'Quiet'
        elif avg_db < 70:
            return 'Normal'
        else:
            return 'Noisy'

    def process_audio_file(self, file_path: str, verbose: bool = True) -> Dict:
        """
        Complete processing pipeline for an audio file.

        Args:
            file_path: Path to audio file
            verbose: Print detailed output

        Returns:
            Dictionary with all extracted features and classification
        """
        # Load audio
        audio, sr = self.load_audio(file_path)

        # Calculate decibels
        db_values = self.calculate_decibels(audio)

        # Apply moving average filter
        db_filtered = self.moving_average_filter(db_values, window_size=10)

        # Calculate statistics
        avg_db = np.mean(db_filtered)
        max_db = np.max(db_filtered)
        min_db = np.min(db_filtered)
        std_db = np.std(db_filtered)

        # Perform FFT on full audio
        frequencies, magnitudes = self.perform_fft(audio)

        # Extract spectral features
        spectral_features = self.extract_spectral_features(frequencies, magnitudes)

        # Classify noise level
        classification = self.classify_noise_simple(avg_db)

        # Compile results
        results = {
            'file_path': file_path,
            'duration': len(audio) / sr,
            'avg_decibels': avg_db,
            'max_decibels': max_db,
            'min_decibels': min_db,
            'std_decibels': std_db,
            'classification': classification,
            'db_values': db_filtered,
            'frequencies': frequencies,
            'magnitudes': magnitudes,
            **spectral_features
        }

        if verbose:
            print(f"\n{'='*60}")
            print(f"AUDIO ANALYSIS RESULTS")
            print(f"{'='*60}")
            print(f"File: {file_path}")
            print(f"Duration: {results['duration']:.2f} seconds")
            print(f"\nDecibel Statistics:")
            print(f"  Average: {avg_db:.1f} dB")
            print(f"  Maximum: {max_db:.1f} dB")
            print(f"  Minimum: {min_db:.1f} dB")
            print(f"  Std Dev: {std_db:.1f} dB")
            print(f"\nClassification: {classification}")
            print(f"\nSpectral Features:")
            print(f"  Spectral Centroid: {spectral_features['spectral_centroid']:.1f} Hz")
            print(f"  Spectral Spread: {spectral_features['spectral_spread']:.1f} Hz")
            print(f"  Dominant Frequency: {spectral_features['dominant_frequency']:.1f} Hz")
            print(f"  Spectral Flatness: {spectral_features['spectral_flatness']:.4f}")
            print(f"\nFrequency Distribution:")
            print(f"  Low (<250 Hz): {spectral_features['low_freq_ratio']*100:.1f}%")
            print(f"  Mid (250-4000 Hz): {spectral_features['mid_freq_ratio']*100:.1f}%")
            print(f"  High (>4000 Hz): {spectral_features['high_freq_ratio']*100:.1f}%")
            print(f"{'='*60}\n")

        return results


def test_audio_processor():
    """
    Test function to demonstrate audio processor capabilities.
    """
    print("Testing Audio Processor...")
    print("="*60)

    # Generate a test sine wave (simulated quiet environment)
    print("\n1. Testing with synthetic quiet audio (440 Hz tone)...")
    sample_rate = 44100
    duration = 2.0  # seconds
    frequency = 440  # Hz (A note)

    # Generate quiet sine wave
    t = np.linspace(0, duration, int(sample_rate * duration))
    quiet_audio = 0.01 * np.sin(2 * np.pi * frequency * t)  # Low amplitude

    # Save test file
    sf.write('test_quiet.wav', quiet_audio, sample_rate)

    # Process it
    processor = AudioProcessor()
    results_quiet = processor.process_audio_file('test_quiet.wav')

    print(f"\n2. Testing with synthetic noisy audio (white noise)...")
    noisy_audio = 0.3 * np.random.randn(int(sample_rate * duration))
    sf.write('test_noisy.wav', noisy_audio, sample_rate)
    results_noisy = processor.process_audio_file('test_noisy.wav')

    print("\n[OK] Audio processor test completed!")
    print(f"\nTest Results:")
    print(f"  Quiet audio classified as: {results_quiet['classification']}")
    print(f"  Noisy audio classified as: {results_noisy['classification']}")

    return processor, results_quiet, results_noisy


if __name__ == "__main__":
    # Run tests
    processor, quiet_results, noisy_results = test_audio_processor()

    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("1. Collect real audio samples from campus locations")
    print("2. Run: python audio_processor.py <your_audio_file.wav>")
    print("3. Use visualize_fft.py to see frequency spectrum")
    print("4. Train ML classifier with collected samples")
    print("="*60)
