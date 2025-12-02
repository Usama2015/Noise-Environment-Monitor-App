#!/usr/bin/env python3
"""
Automated Test Suite for Phase 0 Implementation
Noise Environment Monitor - Testing Utility

This script runs automated tests for:
- Audio processor functionality
- Sample generation
- ML classifier training
- End-to-end workflow

Usage:
    python test_phase0.py              # Run all tests
    python test_phase0.py --quick      # Run quick tests only
    python test_phase0.py --verbose    # Run with detailed output

Author: Group 4 (GMU)
Date: 2025-10-15
"""

import sys
import os
from pathlib import Path
import numpy as np
import argparse

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from audio_processor import AudioProcessor
    import joblib
    import pandas as pd
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("\nPlease install dependencies:")
    print("  pip install -r requirements.txt")
    sys.exit(1)


class TestRunner:
    """Test runner for Phase 0 components"""

    def __init__(self, verbose=False):
        self.verbose = verbose
        self.tests_passed = 0
        self.tests_failed = 0
        self.tests_total = 0

    def log(self, message):
        """Print message if verbose mode"""
        if self.verbose:
            print(message)

    def run_test(self, test_name, test_func):
        """Run a single test and track results"""
        self.tests_total += 1
        print(f"\n{'='*60}")
        print(f"TEST {self.tests_total}: {test_name}")
        print(f"{'='*60}")

        try:
            test_func()
            print(f"✅ PASSED: {test_name}")
            self.tests_passed += 1
            return True
        except AssertionError as e:
            print(f"❌ FAILED: {test_name}")
            print(f"   Reason: {e}")
            self.tests_failed += 1
            return False
        except Exception as e:
            print(f"❌ ERROR: {test_name}")
            print(f"   Exception: {e}")
            self.tests_failed += 1
            return False

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*60}")
        print("TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total tests: {self.tests_total}")
        print(f"Passed: {self.tests_passed} ✅")
        print(f"Failed: {self.tests_failed} ❌")
        print(f"Success rate: {(self.tests_passed/self.tests_total)*100:.1f}%")
        print(f"{'='*60}")

        if self.tests_failed == 0:
            print("\n🎉 ALL TESTS PASSED! Phase 0 is working correctly.")
            return 0
        else:
            print(f"\n⚠️  {self.tests_failed} test(s) failed. Please review errors above.")
            return 1


def test_audio_processor_import(runner):
    """Test 1: Audio processor can be imported and instantiated"""
    def test():
        processor = AudioProcessor()
        runner.log(f"  Created AudioProcessor instance")
        assert processor is not None, "AudioProcessor is None"
        assert processor.sample_rate == 44100, f"Expected sample rate 44100, got {processor.sample_rate}"
        runner.log(f"  ✓ Sample rate: {processor.sample_rate} Hz")

    return runner.run_test("Audio Processor Import", test)


def test_audio_samples_exist(runner):
    """Test 2: Generated audio samples exist"""
    def test():
        samples_dir = Path("../audio-samples")
        runner.log(f"  Checking directory: {samples_dir.absolute()}")

        assert samples_dir.exists(), f"Samples directory not found: {samples_dir}"
        runner.log(f"  ✓ Samples directory exists")

        wav_files = list(samples_dir.glob("*.wav"))
        runner.log(f"  Found {len(wav_files)} WAV files")

        assert len(wav_files) == 30, f"Expected 30 WAV files, found {len(wav_files)}"
        runner.log(f"  ✓ All 30 samples present")

        # Check categories
        quiet_files = [f for f in wav_files if 'quiet' in f.name]
        normal_files = [f for f in wav_files if 'normal' in f.name]
        noisy_files = [f for f in wav_files if 'noisy' in f.name]

        assert len(quiet_files) == 10, f"Expected 10 quiet samples, found {len(quiet_files)}"
        assert len(normal_files) == 10, f"Expected 10 normal samples, found {len(normal_files)}"
        assert len(noisy_files) == 10, f"Expected 10 noisy samples, found {len(noisy_files)}"

        runner.log(f"  ✓ Quiet: {len(quiet_files)}, Normal: {len(normal_files)}, Noisy: {len(noisy_files)}")

    return runner.run_test("Audio Samples Exist", test)


def test_metadata_file(runner):
    """Test 3: Metadata CSV file exists and is valid"""
    def test():
        metadata_path = Path("../audio-samples/metadata.csv")
        runner.log(f"  Checking: {metadata_path.absolute()}")

        assert metadata_path.exists(), "metadata.csv not found"
        runner.log(f"  ✓ Metadata file exists")

        df = pd.read_csv(metadata_path)
        runner.log(f"  Loaded metadata with {len(df)} rows")

        assert len(df) == 30, f"Expected 30 rows, found {len(df)}"
        runner.log(f"  ✓ All 30 samples in metadata")

        required_columns = ['filename', 'category']
        for col in required_columns:
            assert col in df.columns, f"Missing column: {col}"
        runner.log(f"  ✓ Required columns present: {required_columns}")

        categories = df['category'].unique()
        expected_categories = {'quiet', 'normal', 'noisy'}
        assert set(categories) == expected_categories, f"Expected categories {expected_categories}, found {set(categories)}"
        runner.log(f"  ✓ Categories: {list(categories)}")

    return runner.run_test("Metadata File", test)


def test_audio_processing(runner):
    """Test 4: Audio processor can analyze a sample"""
    def test():
        processor = AudioProcessor()
        sample_path = Path("../audio-samples/quiet_01.wav")

        runner.log(f"  Processing: {sample_path.name}")
        assert sample_path.exists(), f"Test sample not found: {sample_path}"

        results = processor.process_audio_file(str(sample_path), verbose=False)
        runner.log(f"  ✓ Audio processed successfully")

        # Check required keys
        required_keys = [
            'avg_decibels', 'max_decibels', 'min_decibels', 'std_decibels',
            'classification', 'spectral_centroid', 'dominant_frequency'
        ]
        for key in required_keys:
            assert key in results, f"Missing key in results: {key}"
        runner.log(f"  ✓ All required features extracted")

        # Check decibel values are reasonable
        avg_db = results['avg_decibels']
        assert 0 < avg_db < 120, f"Invalid average dB: {avg_db}"
        runner.log(f"  ✓ Average dB: {avg_db:.1f} dB (within valid range)")

        # Check classification
        classification = results['classification']
        assert classification in ['Quiet', 'Normal', 'Noisy'], f"Invalid classification: {classification}"
        runner.log(f"  ✓ Classification: {classification}")

        # For quiet sample, should be classified as Quiet
        assert classification == 'Quiet', f"Expected 'Quiet', got '{classification}'"
        runner.log(f"  ✓ Correct classification for quiet sample")

    return runner.run_test("Audio Processing", test)


def test_model_file_exists(runner):
    """Test 5: Trained model file exists"""
    def test():
        model_path = Path("../../ml-models/models/baseline_classifier.pkl")
        runner.log(f"  Checking: {model_path.absolute()}")

        assert model_path.exists(), f"Model file not found: {model_path}"
        runner.log(f"  ✓ Model file exists")

        file_size = model_path.stat().st_size
        assert file_size > 0, "Model file is empty"
        runner.log(f"  ✓ Model file size: {file_size:,} bytes")

    return runner.run_test("Model File Exists", test)


def test_model_loading(runner):
    """Test 6: Model can be loaded and has correct structure"""
    def test():
        model_path = Path("../../ml-models/models/baseline_classifier.pkl")

        runner.log(f"  Loading model from: {model_path.name}")
        model_package = joblib.load(model_path)
        runner.log(f"  ✓ Model loaded successfully")

        # Check required keys
        required_keys = ['model', 'label_encoder', 'feature_columns', 'test_accuracy']
        for key in required_keys:
            assert key in model_package, f"Missing key in model package: {key}"
        runner.log(f"  ✓ Model package has all required keys")

        # Check feature columns
        feature_columns = model_package['feature_columns']
        assert len(feature_columns) == 13, f"Expected 13 features, found {len(feature_columns)}"
        runner.log(f"  ✓ Feature columns: {len(feature_columns)}")

        # Check label encoder
        label_encoder = model_package['label_encoder']
        classes = label_encoder.classes_
        expected_classes = ['noisy', 'normal', 'quiet']
        assert list(classes) == expected_classes, f"Expected classes {expected_classes}, found {list(classes)}"
        runner.log(f"  ✓ Classes: {list(classes)}")

        # Check accuracy
        test_accuracy = model_package['test_accuracy']
        assert test_accuracy > 0.75, f"Test accuracy {test_accuracy:.2%} below 75% threshold"
        runner.log(f"  ✓ Test accuracy: {test_accuracy:.2%} (exceeds 75% target)")

    return runner.run_test("Model Loading", test)


def test_features_csv(runner):
    """Test 7: Extracted features CSV exists and is valid"""
    def test():
        features_path = Path("../audio-samples/extracted_features.csv")
        runner.log(f"  Checking: {features_path.absolute()}")

        assert features_path.exists(), "extracted_features.csv not found"
        runner.log(f"  ✓ Features file exists")

        df = pd.read_csv(features_path)
        runner.log(f"  Loaded features with {len(df)} rows")

        assert len(df) == 30, f"Expected 30 rows, found {len(df)}"
        runner.log(f"  ✓ All 30 samples in features")

        # Check feature columns
        expected_features = [
            'avg_db', 'max_db', 'min_db', 'std_db',
            'spectral_centroid', 'spectral_spread', 'spectral_rolloff',
            'spectral_flatness', 'spectral_entropy', 'dominant_frequency',
            'low_freq_ratio', 'mid_freq_ratio', 'high_freq_ratio'
        ]
        for feat in expected_features:
            assert feat in df.columns, f"Missing feature column: {feat}"
        runner.log(f"  ✓ All {len(expected_features)} feature columns present")

        # Check no NaN values
        nan_count = df[expected_features].isna().sum().sum()
        assert nan_count == 0, f"Found {nan_count} NaN values in features"
        runner.log(f"  ✓ No NaN values in features")

    return runner.run_test("Features CSV", test)


def test_end_to_end_prediction(runner):
    """Test 8: End-to-end: Load sample, extract features, predict"""
    def test():
        # Load model
        model_path = Path("../../ml-models/models/baseline_classifier.pkl")
        model_package = joblib.load(model_path)
        model = model_package['model']
        label_encoder = model_package['label_encoder']
        feature_columns = model_package['feature_columns']
        runner.log(f"  ✓ Model loaded")

        # Process a quiet sample
        processor = AudioProcessor()
        sample_path = Path("../audio-samples/quiet_01.wav")
        results = processor.process_audio_file(str(sample_path), verbose=False)
        runner.log(f"  ✓ Audio processed: {sample_path.name}")

        # Extract features
        features = {
            'avg_db': results['avg_decibels'],
            'max_db': results['max_decibels'],
            'min_db': results['min_decibels'],
            'std_db': results['std_decibels'],
            'spectral_centroid': results['spectral_centroid'],
            'spectral_spread': results['spectral_spread'],
            'spectral_rolloff': results['spectral_rolloff'],
            'spectral_flatness': results['spectral_flatness'],
            'spectral_entropy': results['spectral_entropy'],
            'dominant_frequency': results['dominant_frequency'],
            'low_freq_ratio': results['low_freq_ratio'],
            'mid_freq_ratio': results['mid_freq_ratio'],
            'high_freq_ratio': results['high_freq_ratio'],
        }
        runner.log(f"  ✓ Features extracted")

        # Create feature vector
        X = np.array([[features[col] for col in feature_columns]])

        # Predict
        y_pred = model.predict(X)
        predicted_label = label_encoder.inverse_transform(y_pred)[0]
        runner.log(f"  ✓ Prediction: {predicted_label}")

        # Should predict "quiet" for quiet sample
        assert predicted_label == 'quiet', f"Expected 'quiet', got '{predicted_label}'"
        runner.log(f"  ✓ Correct prediction for quiet sample")

    return runner.run_test("End-to-End Prediction", test)


def run_quick_tests():
    """Run only quick tests (no heavy processing)"""
    print("\n" + "="*60)
    print("PHASE 0 QUICK TEST SUITE")
    print("="*60)

    runner = TestRunner(verbose=True)

    # Run quick tests only
    test_audio_processor_import(runner)
    test_audio_samples_exist(runner)
    test_metadata_file(runner)
    test_model_file_exists(runner)
    test_features_csv(runner)

    return runner.print_summary()


def run_all_tests():
    """Run all tests including processing tests"""
    print("\n" + "="*60)
    print("PHASE 0 COMPREHENSIVE TEST SUITE")
    print("="*60)

    runner = TestRunner(verbose=True)

    # Run all tests
    test_audio_processor_import(runner)
    test_audio_samples_exist(runner)
    test_metadata_file(runner)
    test_audio_processing(runner)
    test_model_file_exists(runner)
    test_model_loading(runner)
    test_features_csv(runner)
    test_end_to_end_prediction(runner)

    return runner.print_summary()


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Automated test suite for Phase 0 implementation'
    )
    parser.add_argument(
        '--quick',
        action='store_true',
        help='Run only quick tests (skip processing tests)'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Show detailed output'
    )

    args = parser.parse_args()

    if args.quick:
        return run_quick_tests()
    else:
        return run_all_tests()


if __name__ == "__main__":
    sys.exit(main())
