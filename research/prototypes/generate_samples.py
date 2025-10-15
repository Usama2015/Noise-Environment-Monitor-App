#!/usr/bin/env python3
"""
Generate Synthetic Audio Dataset for ML Training
Phase 0: Research & Prototyping

Creates diverse synthetic audio samples for training baseline classifier:
- 10 quiet samples (0.01-0.05 amplitude)
- 10 normal samples (0.1-0.2 amplitude)
- 10 noisy samples (0.3-0.5 amplitude)

Author: Group 4 (GMU)
Date: 2025-10-15
"""

import numpy as np
import soundfile as sf
import pandas as pd
from pathlib import Path
import sys

# Configuration
SAMPLE_RATE = 44100
DURATION = 3.0  # seconds
OUTPUT_DIR = Path("../audio-samples")
NUM_PER_CATEGORY = 10

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_quiet_samples():
    """Generate quiet audio samples (low amplitude)."""
    samples_metadata = []

    print("\nGenerating QUIET samples...")
    print("-" * 60)

    for i in range(NUM_PER_CATEGORY):
        t = np.linspace(0, DURATION, int(SAMPLE_RATE * DURATION))

        # Vary the type of quiet sound
        if i < 3:
            # Low amplitude sine waves
            freq = np.random.choice([100, 220, 440, 880])
            amplitude = np.random.uniform(0.01, 0.03)
            audio = amplitude * np.sin(2 * np.pi * freq * t)
            description = f"Low sine wave {freq}Hz, amp={amplitude:.3f}"

        elif i < 6:
            # Very low white noise
            amplitude = np.random.uniform(0.01, 0.03)
            audio = amplitude * np.random.randn(len(t))
            description = f"Low white noise, amp={amplitude:.3f}"

        elif i < 8:
            # Low amplitude multi-tone
            freqs = [100, 150, 200]
            amplitude = np.random.uniform(0.015, 0.035)
            audio = sum(amplitude * np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)
            description = f"Multi-tone {freqs}, amp={amplitude:.3f}"

        else:
            # Pink noise (more realistic quiet background)
            amplitude = np.random.uniform(0.02, 0.05)
            # Generate white noise and apply 1/f filter
            white = np.random.randn(len(t))
            # Simple approximation of pink noise
            audio = np.zeros_like(white)
            for j in range(1, len(white)):
                audio[j] = 0.99 * audio[j-1] + white[j]
            audio = amplitude * audio / np.max(np.abs(audio))
            description = f"Pink noise, amp={amplitude:.3f}"

        # Save file
        filename = f"quiet_{i+1:02d}.wav"
        filepath = OUTPUT_DIR / filename
        sf.write(filepath, audio, SAMPLE_RATE)

        samples_metadata.append({
            'filename': filename,
            'category': 'quiet',
            'amplitude': amplitude,
            'description': description
        })

        print(f"  [{i+1:2d}/10] {filename:20s} - {description}")

    return samples_metadata


def generate_normal_samples():
    """Generate normal audio samples (medium amplitude)."""
    samples_metadata = []

    print("\nGenerating NORMAL samples...")
    print("-" * 60)

    for i in range(NUM_PER_CATEGORY):
        t = np.linspace(0, DURATION, int(SAMPLE_RATE * DURATION))

        # Vary the type of normal sound
        if i < 3:
            # Medium amplitude sine waves
            freq = np.random.choice([440, 880, 1000, 1500])
            amplitude = np.random.uniform(0.1, 0.15)
            audio = amplitude * np.sin(2 * np.pi * freq * t)
            description = f"Medium sine {freq}Hz, amp={amplitude:.3f}"

        elif i < 5:
            # Medium white noise
            amplitude = np.random.uniform(0.1, 0.15)
            audio = amplitude * np.random.randn(len(t))
            description = f"Medium white noise, amp={amplitude:.3f}"

        elif i < 7:
            # Chord (multiple frequencies)
            freqs = [440, 554, 659]  # A major chord
            amplitude = np.random.uniform(0.12, 0.18)
            audio = sum(amplitude * np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)
            description = f"Chord {freqs}, amp={amplitude:.3f}"

        elif i < 9:
            # Modulated tone (frequency sweep)
            start_freq = 200
            end_freq = 2000
            amplitude = np.random.uniform(0.1, 0.2)
            freq_sweep = np.linspace(start_freq, end_freq, len(t))
            phase = 2 * np.pi * np.cumsum(freq_sweep) / SAMPLE_RATE
            audio = amplitude * np.sin(phase)
            description = f"Sweep {start_freq}-{end_freq}Hz, amp={amplitude:.3f}"

        else:
            # Mixed noise and tone
            tone_freq = 1000
            amplitude_tone = np.random.uniform(0.08, 0.12)
            amplitude_noise = np.random.uniform(0.05, 0.08)
            tone = amplitude_tone * np.sin(2 * np.pi * tone_freq * t)
            noise = amplitude_noise * np.random.randn(len(t))
            audio = tone + noise
            description = f"Mixed tone+noise, amp_t={amplitude_tone:.3f}, amp_n={amplitude_noise:.3f}"

        # Save file
        filename = f"normal_{i+1:02d}.wav"
        filepath = OUTPUT_DIR / filename
        sf.write(filepath, audio, SAMPLE_RATE)

        samples_metadata.append({
            'filename': filename,
            'category': 'normal',
            'amplitude': np.max([amplitude_tone if 'amplitude_tone' in locals() else amplitude,
                                amplitude_noise if 'amplitude_noise' in locals() else amplitude]),
            'description': description
        })

        print(f"  [{i+1:2d}/10] {filename:20s} - {description}")

    return samples_metadata


def generate_noisy_samples():
    """Generate noisy audio samples (high amplitude)."""
    samples_metadata = []

    print("\nGenerating NOISY samples...")
    print("-" * 60)

    for i in range(NUM_PER_CATEGORY):
        t = np.linspace(0, DURATION, int(SAMPLE_RATE * DURATION))

        # Vary the type of noisy sound
        if i < 3:
            # High amplitude white noise
            amplitude = np.random.uniform(0.3, 0.4)
            audio = amplitude * np.random.randn(len(t))
            description = f"High white noise, amp={amplitude:.3f}"

        elif i < 5:
            # Very high amplitude sine wave
            freq = np.random.choice([100, 1000, 2000])
            amplitude = np.random.uniform(0.35, 0.45)
            audio = amplitude * np.sin(2 * np.pi * freq * t)
            description = f"High sine {freq}Hz, amp={amplitude:.3f}"

        elif i < 7:
            # Complex waveform (multiple random frequencies)
            freqs = np.random.randint(100, 5000, size=5)
            amplitude = np.random.uniform(0.3, 0.5)
            audio = sum(amplitude * np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)
            description = f"Complex multi-freq, amp={amplitude:.3f}"

        elif i < 9:
            # Square wave (harsh sound)
            freq = np.random.choice([440, 880, 1760])
            amplitude = np.random.uniform(0.35, 0.5)
            audio = amplitude * np.sign(np.sin(2 * np.pi * freq * t))
            description = f"Square wave {freq}Hz, amp={amplitude:.3f}"

        else:
            # Very high amplitude mixed content
            amplitude_noise = np.random.uniform(0.2, 0.3)
            amplitude_tones = np.random.uniform(0.2, 0.3)
            noise = amplitude_noise * np.random.randn(len(t))
            freqs = [200, 500, 1000, 2000, 4000]
            tones = sum(amplitude_tones * np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)
            audio = noise + tones
            description = f"High mixed, noise_amp={amplitude_noise:.3f}, tone_amp={amplitude_tones:.3f}"

        # Clip to prevent overflow
        audio = np.clip(audio, -1.0, 1.0)

        # Save file
        filename = f"noisy_{i+1:02d}.wav"
        filepath = OUTPUT_DIR / filename
        sf.write(filepath, audio, SAMPLE_RATE)

        samples_metadata.append({
            'filename': filename,
            'category': 'noisy',
            'amplitude': amplitude if 'amplitude' in locals() else max(amplitude_noise, amplitude_tones),
            'description': description
        })

        print(f"  [{i+1:2d}/10] {filename:20s} - {description}")

    return samples_metadata


def create_metadata_csv(all_metadata):
    """Create metadata CSV file."""
    df = pd.DataFrame(all_metadata)
    metadata_path = OUTPUT_DIR / "metadata.csv"
    df.to_csv(metadata_path, index=False)

    print("\n" + "=" * 60)
    print("METADATA SUMMARY")
    print("=" * 60)
    print(f"Total samples: {len(df)}")
    print(f"\nBreakdown by category:")
    print(df['category'].value_counts().to_string())
    print(f"\nMetadata saved to: {metadata_path}")
    print("=" * 60)

    return metadata_path


def main():
    """Main function to generate all samples."""
    print("=" * 60)
    print("SYNTHETIC AUDIO DATASET GENERATOR")
    print("Phase 0: Research & Prototyping")
    print("=" * 60)
    print(f"Configuration:")
    print(f"  Sample Rate: {SAMPLE_RATE} Hz")
    print(f"  Duration: {DURATION} seconds")
    print(f"  Samples per category: {NUM_PER_CATEGORY}")
    print(f"  Output Directory: {OUTPUT_DIR.absolute()}")
    print("=" * 60)

    # Generate all samples
    all_metadata = []

    quiet_metadata = generate_quiet_samples()
    all_metadata.extend(quiet_metadata)

    normal_metadata = generate_normal_samples()
    all_metadata.extend(normal_metadata)

    noisy_metadata = generate_noisy_samples()
    all_metadata.extend(noisy_metadata)

    # Create metadata CSV
    metadata_path = create_metadata_csv(all_metadata)

    print("\n[OK] Dataset generation completed successfully!")
    print(f"\nGenerated files:")
    print(f"  - 30 WAV files in {OUTPUT_DIR.absolute()}")
    print(f"  - metadata.csv with sample descriptions")
    print("\nNext steps:")
    print("  1. Run: python train_classifier.py")
    print("  2. Evaluate classifier performance")
    print("  3. Document results in DEVELOPMENT_LOG.md")
    print("=" * 60)


if __name__ == "__main__":
    main()
