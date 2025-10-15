#!/usr/bin/env python3
"""
Train Baseline ML Classifier for Noise Environment Monitor
Phase 0: Research & Prototyping

Processes all audio samples, extracts features, trains Random Forest classifier,
and evaluates performance with cross-validation.

Target: >75% accuracy

Author: Group 4 (GMU)
Date: 2025-10-15
"""

import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, cross_validate, train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib
import sys
import warnings

# Add audio_processor to path
sys.path.insert(0, str(Path(__file__).parent))
from audio_processor import AudioProcessor

warnings.filterwarnings('ignore')


# Configuration
AUDIO_SAMPLES_DIR = Path("../audio-samples")
MODELS_DIR = Path("../../ml-models/models")
MODEL_FILENAME = "baseline_classifier.pkl"
RANDOM_STATE = 42


def load_metadata():
    """Load metadata CSV file."""
    metadata_path = AUDIO_SAMPLES_DIR / "metadata.csv"
    df = pd.read_csv(metadata_path)
    print(f"[OK] Loaded metadata: {len(df)} samples")
    print(f"     Categories: {df['category'].unique()}")
    return df


def extract_features_from_all_samples(metadata_df):
    """
    Process all audio samples and extract features.

    Returns:
        DataFrame with features and labels
    """
    processor = AudioProcessor()
    features_list = []

    print("\nExtracting features from audio samples...")
    print("-" * 60)

    for idx, row in metadata_df.iterrows():
        filename = row['filename']
        category = row['category']
        filepath = AUDIO_SAMPLES_DIR / filename

        try:
            # Process audio file (verbose=False for clean output)
            results = processor.process_audio_file(str(filepath), verbose=False)

            # Extract relevant features for ML
            features = {
                'filename': filename,
                'category': category,
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

            features_list.append(features)

            # Progress indicator
            print(f"  [{idx+1:2d}/{len(metadata_df)}] {filename:20s} -> {category:8s} "
                  f"(avg_db={results['avg_decibels']:.1f})")

        except Exception as e:
            print(f"  [ERROR] Failed to process {filename}: {e}")
            continue

    print("-" * 60)
    print(f"[OK] Extracted features from {len(features_list)} samples")

    # Convert to DataFrame
    features_df = pd.DataFrame(features_list)
    return features_df


def train_classifier(features_df):
    """
    Train Random Forest classifier with extracted features.

    Returns:
        Trained model, label encoder, and evaluation metrics
    """
    print("\nPreparing data for training...")
    print("-" * 60)

    # Separate features and labels
    feature_columns = [
        'avg_db', 'max_db', 'min_db', 'std_db',
        'spectral_centroid', 'spectral_spread', 'spectral_rolloff',
        'spectral_flatness', 'spectral_entropy', 'dominant_frequency',
        'low_freq_ratio', 'mid_freq_ratio', 'high_freq_ratio'
    ]

    X = features_df[feature_columns].values
    y = features_df['category'].values

    print(f"Feature matrix shape: {X.shape}")
    print(f"Labels shape: {y.shape}")
    print(f"Classes: {np.unique(y)}")

    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    print(f"\nLabel encoding:")
    for i, label in enumerate(label_encoder.classes_):
        print(f"  {label} -> {i}")

    # Split data for training and testing
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.3, random_state=RANDOM_STATE, stratify=y_encoded
    )

    print(f"\nTrain/Test split:")
    print(f"  Training samples: {len(X_train)}")
    print(f"  Test samples: {len(X_test)}")

    # Train Random Forest Classifier
    print("\nTraining Random Forest Classifier...")
    print("-" * 60)

    rf_classifier = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=RANDOM_STATE,
        n_jobs=-1
    )

    rf_classifier.fit(X_train, y_train)
    print("[OK] Model training completed")

    # Evaluate on test set
    y_pred = rf_classifier.predict(X_test)
    test_accuracy = accuracy_score(y_test, y_pred)

    print(f"\n{'='*60}")
    print("TEST SET EVALUATION")
    print(f"{'='*60}")
    print(f"Test Accuracy: {test_accuracy * 100:.2f}%")
    print(f"\nClassification Report:")
    print(classification_report(
        y_test, y_pred,
        target_names=label_encoder.classes_,
        digits=3
    ))

    print(f"\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    print(f"           ", end="")
    for label in label_encoder.classes_:
        print(f"{label:>8s}", end="")
    print()
    for i, row in enumerate(cm):
        print(f"{label_encoder.classes_[i]:>10s} ", end="")
        for val in row:
            print(f"{val:>8d}", end="")
        print()

    # Cross-validation
    print(f"\n{'='*60}")
    print("CROSS-VALIDATION EVALUATION")
    print(f"{'='*60}")

    cv_scores = cross_val_score(
        rf_classifier, X, y_encoded, cv=5, scoring='accuracy'
    )

    print(f"5-Fold Cross-Validation Scores:")
    for i, score in enumerate(cv_scores, 1):
        print(f"  Fold {i}: {score * 100:.2f}%")

    print(f"\nCross-Validation Results:")
    print(f"  Mean Accuracy: {cv_scores.mean() * 100:.2f}%")
    print(f"  Std Deviation: {cv_scores.std() * 100:.2f}%")
    print(f"  Min Accuracy: {cv_scores.min() * 100:.2f}%")
    print(f"  Max Accuracy: {cv_scores.max() * 100:.2f}%")

    # Feature importance
    print(f"\n{'='*60}")
    print("FEATURE IMPORTANCE")
    print(f"{'='*60}")

    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': rf_classifier.feature_importances_
    }).sort_values('importance', ascending=False)

    print(feature_importance.to_string(index=False))

    # Return results
    results = {
        'model': rf_classifier,
        'label_encoder': label_encoder,
        'feature_columns': feature_columns,
        'test_accuracy': test_accuracy,
        'cv_mean_accuracy': cv_scores.mean(),
        'cv_std_accuracy': cv_scores.std(),
        'feature_importance': feature_importance,
        'X_test': X_test,
        'y_test': y_test,
        'y_pred': y_pred
    }

    return results


def save_model(results):
    """Save trained model and metadata."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODELS_DIR / MODEL_FILENAME

    # Package model with metadata
    model_package = {
        'model': results['model'],
        'label_encoder': results['label_encoder'],
        'feature_columns': results['feature_columns'],
        'test_accuracy': results['test_accuracy'],
        'cv_mean_accuracy': results['cv_mean_accuracy'],
        'cv_std_accuracy': results['cv_std_accuracy'],
        'training_date': pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
    }

    joblib.dump(model_package, model_path)
    print(f"\n[OK] Model saved to: {model_path.absolute()}")

    return model_path


def check_phase_0_exit_criteria(results):
    """
    Check if Phase 0 exit criteria are met.

    Exit criteria: >75% accuracy
    """
    print(f"\n{'='*60}")
    print("PHASE 0 EXIT CRITERIA CHECK")
    print(f"{'='*60}")

    target_accuracy = 0.75
    achieved_accuracy = results['cv_mean_accuracy']

    print(f"Target Accuracy: >{target_accuracy * 100:.0f}%")
    print(f"Achieved Accuracy: {achieved_accuracy * 100:.2f}%")

    if achieved_accuracy > target_accuracy:
        print(f"\n[OK] PHASE 0 EXIT CRITERIA MET!")
        print(f"     The baseline classifier exceeds the {target_accuracy * 100:.0f}% accuracy target.")
        print(f"     Ready to proceed to Phase 1 (Mobile App Development).")
        return True
    else:
        print(f"\n[WARNING] Phase 0 exit criteria NOT met.")
        print(f"          Need to improve accuracy by {(target_accuracy - achieved_accuracy) * 100:.2f}%")
        print(f"          Consider:")
        print(f"          - Generating more diverse samples")
        print(f"          - Tuning model hyperparameters")
        print(f"          - Adding more features")
        return False


def main():
    """Main training pipeline."""
    print("=" * 60)
    print("BASELINE ML CLASSIFIER TRAINING")
    print("Phase 0: Research & Prototyping")
    print("=" * 60)
    print(f"Audio Samples Directory: {AUDIO_SAMPLES_DIR.absolute()}")
    print(f"Output Model Directory: {MODELS_DIR.absolute()}")
    print(f"Model Filename: {MODEL_FILENAME}")
    print("=" * 60)

    # Step 1: Load metadata
    metadata_df = load_metadata()

    # Step 2: Extract features from all samples
    features_df = extract_features_from_all_samples(metadata_df)

    # Save features to CSV for reference
    features_path = AUDIO_SAMPLES_DIR / "extracted_features.csv"
    features_df.to_csv(features_path, index=False)
    print(f"\n[OK] Features saved to: {features_path.absolute()}")

    # Step 3: Train classifier
    results = train_classifier(features_df)

    # Step 4: Save model
    model_path = save_model(results)

    # Step 5: Check exit criteria
    criteria_met = check_phase_0_exit_criteria(results)

    # Final summary
    print(f"\n{'='*60}")
    print("TRAINING SUMMARY")
    print(f"{'='*60}")
    print(f"Total samples processed: {len(features_df)}")
    print(f"Features extracted: {len(results['feature_columns'])}")
    print(f"Test accuracy: {results['test_accuracy'] * 100:.2f}%")
    print(f"Cross-validation accuracy: {results['cv_mean_accuracy'] * 100:.2f}% "
          f"(+/- {results['cv_std_accuracy'] * 100:.2f}%)")
    print(f"Model saved: {model_path.absolute()}")
    print(f"Phase 0 criteria met: {'YES' if criteria_met else 'NO'}")
    print(f"{'='*60}")

    print("\nNext steps:")
    if criteria_met:
        print("  1. Update DEVELOPMENT_LOG.md with Phase 0 completion")
        print("  2. Proceed to Phase 1: Mobile App Development")
    else:
        print("  1. Review feature importance and model performance")
        print("  2. Consider regenerating samples with more diversity")
        print("  3. Experiment with different model hyperparameters")
    print("=" * 60)


if __name__ == "__main__":
    main()
