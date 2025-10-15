#!/usr/bin/env python3
"""
FFT Visualization Tool for Noise Environment Monitor
Phase 0: Proof of Concept

Visualizes audio waveforms, decibel levels, and frequency spectra.

Author: Group 4 (GMU)
Date: 2025-10-14
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from audio_processor import AudioProcessor
import sys

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 10)


def visualize_audio_analysis(file_path: str, save_plot: bool = False):
    """
    Create comprehensive visualization of audio analysis.

    Args:
        file_path: Path to audio file
        save_plot: Save plot to file instead of displaying
    """
    # Process audio
    processor = AudioProcessor()
    results = processor.process_audio_file(file_path, verbose=True)

    # Create figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle(f'Audio Analysis: {file_path}\\nClassification: {results["classification"]}',
                 fontsize=16, fontweight='bold')

    # 1. Decibel Levels Over Time
    ax1 = axes[0, 0]
    time_points = np.linspace(0, results['duration'], len(results['db_values']))
    ax1.plot(time_points, results['db_values'], linewidth=2, color='#2E86AB')
    ax1.axhline(y=results['avg_decibels'], color='red', linestyle='--',
                label=f'Average: {results["avg_decibels"]:.1f} dB')
    ax1.axhline(y=50, color='green', linestyle=':', alpha=0.5, label='Quiet Threshold')
    ax1.axhline(y=70, color='orange', linestyle=':', alpha=0.5, label='Noisy Threshold')
    ax1.set_xlabel('Time (seconds)', fontsize=12)
    ax1.set_ylabel('Decibels (dB)', fontsize=12)
    ax1.set_title('Decibel Levels Over Time', fontsize=14, fontweight='bold')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # 2. Frequency Spectrum (FFT)
    ax2 = axes[0, 1]
    # Limit to audible range (20 Hz - 20 kHz) and significant magnitudes
    freq_mask = (results['frequencies'] >= 20) & (results['frequencies'] <= 20000)
    freqs = results['frequencies'][freq_mask]
    mags = results['magnitudes'][freq_mask]

    ax2.plot(freqs, mags, linewidth=1.5, color='#A23B72')
    ax2.set_xlabel('Frequency (Hz)', fontsize=12)
    ax2.set_ylabel('Magnitude', fontsize=12)
    ax2.set_title('Frequency Spectrum (FFT)', fontsize=14, fontweight='bold')
    ax2.set_xscale('log')  # Log scale for better visualization
    ax2.grid(True, alpha=0.3, which='both')

    # Mark dominant frequency
    dom_freq = results['dominant_frequency']
    if 20 <= dom_freq <= 20000:
        ax2.axvline(x=dom_freq, color='red', linestyle='--', alpha=0.7,
                   label=f'Dominant: {dom_freq:.1f} Hz')
        ax2.legend()

    # 3. Frequency Distribution (Pie Chart)
    ax3 = axes[1, 0]
    freq_ratios = [
        results['low_freq_ratio'],
        results['mid_freq_ratio'],
        results['high_freq_ratio']
    ]
    labels = ['Low\\n(<250 Hz)', 'Mid\\n(250-4000 Hz)', 'High\\n(>4000 Hz)']
    colors = ['#F18F01', '#C73E1D', '#6A994E']

    wedges, texts, autotexts = ax3.pie(freq_ratios, labels=labels, colors=colors,
                                         autopct='%1.1f%%', startangle=90,
                                         textprops={'fontsize': 11})
    ax3.set_title('Frequency Energy Distribution', fontsize=14, fontweight='bold')

    # Make percentage text bold
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontweight('bold')

    # 4. Spectral Features Summary
    ax4 = axes[1, 1]
    ax4.axis('off')  # Turn off axis for text display

    # Create feature summary text
    feature_text = f"""
    SPECTRAL FEATURES SUMMARY
    {'='*40}

    Spectral Centroid: {results['spectral_centroid']:.1f} Hz
      (Center of mass of spectrum)

    Spectral Spread: {results['spectral_spread']:.1f} Hz
      (Spread around centroid)

    Spectral Rolloff: {results['spectral_rolloff']:.1f} Hz
      (85% energy threshold)

    Spectral Flatness: {results['spectral_flatness']:.4f}
      (0=tonal, 1=noise-like)

    Spectral Entropy: {results['spectral_entropy']:.2f}
      (Measure of complexity)

    {'='*40}

    CLASSIFICATION: {results['classification']}

    Average dB: {results['avg_decibels']:.1f} dB
    Peak dB: {results['max_decibels']:.1f} dB
    Std Dev: {results['std_decibels']:.1f} dB
    """

    # Add classification color coding
    class_colors = {
        'Quiet': '#2E7D32',    # Green
        'Normal': '#F57C00',   # Orange
        'Noisy': '#C62828'     # Red
    }
    class_color = class_colors.get(results['classification'], 'black')

    ax4.text(0.1, 0.95, feature_text, transform=ax4.transAxes,
            fontsize=11, verticalalignment='top', fontfamily='monospace',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3))

    # Add large classification badge
    ax4.text(0.5, 0.15, results['classification'], transform=ax4.transAxes,
            fontsize=32, fontweight='bold', color=class_color,
            ha='center', va='center',
            bbox=dict(boxstyle='round,pad=0.5', facecolor=class_color,
                     alpha=0.2, edgecolor=class_color, linewidth=3))

    plt.tight_layout()

    if save_plot:
        output_file = file_path.replace('.wav', '_analysis.png').replace('.mp3', '_analysis.png')
        plt.savefig(output_file, dpi=300, bbox_inches='tight')
        print(f"✓ Plot saved to: {output_file}")
    else:
        plt.show()


def compare_audio_files(file_paths: list, save_plot: bool = False):
    """
    Compare multiple audio files side by side.

    Args:
        file_paths: List of audio file paths
        save_plot: Save plot instead of displaying
    """
    processor = AudioProcessor()
    results_list = []

    print(f"Processing {len(file_paths)} audio files...")
    for fp in file_paths:
        results = processor.process_audio_file(fp, verbose=False)
        results_list.append(results)
        print(f"  ✓ {fp}: {results['avg_decibels']:.1f} dB - {results['classification']}")

    # Create comparison figure
    fig, axes = plt.subplots(2, 1, figsize=(14, 10))
    fig.suptitle('Audio Files Comparison', fontsize=16, fontweight='bold')

    # 1. Decibel Comparison
    ax1 = axes[0]
    files = [r['file_path'].split('/')[-1].split('\\\\')[-1] for r in results_list]
    avg_dbs = [r['avg_decibels'] for r in results_list]
    classifications = [r['classification'] for r in results_list]

    colors = ['#2E7D32' if c == 'Quiet' else '#F57C00' if c == 'Normal' else '#C62828'
              for c in classifications]

    bars = ax1.bar(files, avg_dbs, color=colors, alpha=0.7, edgecolor='black', linewidth=1.5)
    ax1.axhline(y=50, color='green', linestyle='--', alpha=0.5, label='Quiet Threshold')
    ax1.axhline(y=70, color='red', linestyle='--', alpha=0.5, label='Noisy Threshold')
    ax1.set_ylabel('Average Decibels (dB)', fontsize=12)
    ax1.set_title('Average Noise Levels Comparison', fontsize=14, fontweight='bold')
    ax1.legend()
    ax1.grid(True, alpha=0.3, axis='y')

    # Add value labels on bars
    for bar, db in zip(bars, avg_dbs):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height,
                f'{db:.1f} dB',
                ha='center', va='bottom', fontweight='bold')

    # 2. Spectral Centroid Comparison
    ax2 = axes[1]
    centroids = [r['spectral_centroid'] for r in results_list]

    bars2 = ax2.bar(files, centroids, color='#A23B72', alpha=0.7, edgecolor='black', linewidth=1.5)
    ax2.set_ylabel('Spectral Centroid (Hz)', fontsize=12)
    ax2.set_title('Spectral Centroid Comparison (Frequency Character)', fontsize=14, fontweight='bold')
    ax2.grid(True, alpha=0.3, axis='y')

    # Add value labels
    for bar, cent in zip(bars2, centroids):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height,
                f'{cent:.0f} Hz',
                ha='center', va='bottom', fontweight='bold')

    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    if save_plot:
        plt.savefig('audio_comparison.png', dpi=300, bbox_inches='tight')
        print(f"✓ Comparison plot saved to: audio_comparison.png")
    else:
        plt.show()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Single file:  python visualize_fft.py <audio_file.wav>")
        print("  Compare:      python visualize_fft.py <file1.wav> <file2.wav> ...")
        print("")
        print("Generating example visualization with test files...")

        # Run test to generate example files
        from audio_processor import test_audio_processor
        test_audio_processor()

        # Visualize test files
        print("\\nVisualizing test files...")
        visualize_audio_analysis('test_quiet.wav', save_plot=True)
        visualize_audio_analysis('test_noisy.wav', save_plot=True)
        compare_audio_files(['test_quiet.wav', 'test_noisy.wav'], save_plot=True)

    elif len(sys.argv) == 2:
        # Single file analysis
        visualize_audio_analysis(sys.argv[1], save_plot=False)
    else:
        # Multiple file comparison
        compare_audio_files(sys.argv[1:], save_plot=False)
