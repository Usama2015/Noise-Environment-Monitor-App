# Python Prototype - Audio Processing Pipeline

**Phase 0: Research & Prototyping**

This directory contains the Python proof-of-concept for the Noise Environment Monitor app's core audio processing algorithms.

---

## 📋 What's Included

### **Core Scripts**
1. **`audio_processor.py`** - Main audio processing pipeline
   - Load and process WAV/MP3 files
   - Calculate decibel levels (dB SPL)
   - Apply moving average filter
   - Perform FFT (Fast Fourier Transform)
   - Extract spectral features
   - Classify noise levels (Quiet/Normal/Noisy)

2. **`visualize_fft.py`** - Visualization tools
   - Plot decibel levels over time
   - Visualize frequency spectrum
   - Show spectral features
   - Compare multiple audio files

3. **`requirements.txt`** - Python dependencies

---

## 🚀 Quick Start

### **1. Set Up Python Environment**

```bash
# Navigate to prototypes folder
cd research/prototypes

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### **2. Run Tests**

```bash
# Test the audio processor with synthetic audio
python audio_processor.py
```

This will:
- Generate test audio files (`test_quiet.wav`, `test_noisy.wav`)
- Process them through the pipeline
- Display analysis results

### **3. Analyze Real Audio**

```bash
# Process a single audio file
python audio_processor.py your_audio_file.wav

# Visualize analysis
python visualize_fft.py your_audio_file.wav

# Compare multiple files
python visualize_fft.py file1.wav file2.wav file3.wav
```

---

## 📊 Expected Output

When you run the audio processor, you'll see:

```
✓ Loaded audio: test_quiet.wav
  Duration: 2.00 seconds
  Sample rate: 44100 Hz
  Samples: 88200

============================================================
AUDIO ANALYSIS RESULTS
============================================================
File: test_quiet.wav
Duration: 2.00 seconds

Decibel Statistics:
  Average: 45.3 dB
  Maximum: 47.8 dB
  Minimum: 42.1 dB
  Std Dev: 1.5 dB

Classification: Quiet

Spectral Features:
  Spectral Centroid: 440.0 Hz
  Spectral Spread: 125.3 Hz
  Dominant Frequency: 440.0 Hz
  Spectral Flatness: 0.0234

Frequency Distribution:
  Low (<250 Hz): 15.2%
  Mid (250-4000 Hz): 78.5%
  High (>4000 Hz): 6.3%
============================================================
```

---

## 🧪 Testing the Pipeline

### **Test 1: Synthetic Audio**
```python
from audio_processor import test_audio_processor

# Generates and tests quiet and noisy synthetic audio
processor, quiet_results, noisy_results = test_audio_processor()
```

### **Test 2: Real Campus Audio**

1. **Record audio samples** on your phone:
   - Go to a quiet library study room → record 30 seconds
   - Go to student center during lunch → record 30 seconds
   - Go to construction area → record 30 seconds

2. **Transfer files** to this folder

3. **Process them:**
   ```bash
   python audio_processor.py library_quiet.wav
   python audio_processor.py student_center.wav
   python audio_processor.py construction.wav
   ```

4. **Visualize comparison:**
   ```bash
   python visualize_fft.py library_quiet.wav student_center.wav construction.wav
   ```

---

## 📈 Understanding the Output

### **Decibel Levels (dB)**
- **< 50 dB**: Quiet (library, empty classroom)
- **50-70 dB**: Normal (cafeteria, hallway)
- **> 70 dB**: Noisy (gym, construction, crowded areas)

### **Spectral Features**

| Feature | What It Means | Example Values |
|---------|---------------|----------------|
| **Spectral Centroid** | "Center of mass" of frequency | Speech: ~500-1500 Hz, Music: varies |
| **Spectral Spread** | How spread out frequencies are | Narrow: tonal, Wide: noisy |
| **Dominant Frequency** | Loudest frequency component | HVAC hum: 60 Hz, Voice: 200-300 Hz |
| **Spectral Flatness** | 0 = tonal (sine wave), 1 = noise-like (white noise) | Music: 0.1-0.3, Noise: 0.6-0.9 |

### **Frequency Bands**
- **Low (<250 Hz)**: Rumble, bass, HVAC systems
- **Mid (250-4000 Hz)**: Speech, most environmental sounds
- **High (>4000 Hz)**: Sibilants, high-frequency noise

---

## 🔬 Code Structure

### **AudioProcessor Class**

```python
from audio_processor import AudioProcessor

# Initialize
processor = AudioProcessor(sample_rate=44100)

# Load audio file
audio, sr = processor.load_audio('file.wav')

# Calculate decibels
db_values = processor.calculate_decibels(audio)

# Apply filter
db_filtered = processor.moving_average_filter(db_values)

# FFT analysis
frequencies, magnitudes = processor.perform_fft(audio)

# Extract features
features = processor.extract_spectral_features(frequencies, magnitudes)

# Classify
classification = processor.classify_noise_simple(np.mean(db_filtered))

# Or do everything at once
results = processor.process_audio_file('file.wav')
```

---

## 📝 Data Collection Guidelines

For best results when collecting campus audio samples:

### **Recording Settings**
- **Format**: WAV (uncompressed) or high-quality MP3 (320kbps)
- **Sample Rate**: 44.1 kHz (CD quality)
- **Channels**: Mono (single channel)
- **Duration**: 30-60 seconds minimum

### **Recording Procedure**
1. **Find location** (e.g., Library 2nd Floor)
2. **Place phone** on stable surface (not handheld - reduces handling noise)
3. **Wait 5 seconds** for environment to settle
4. **Start recording** (use voice recorder app)
5. **Record for 30-60 seconds**
6. **Label file** clearly: `location_type_time.wav`
   - Example: `fenwick_library_quiet_14h30.wav`
   - Example: `student_center_noisy_12h00.wav`

### **Metadata to Track**
Create a CSV file with:
```csv
filename,location,category,date,time,notes
fenwick_library_quiet.wav,Fenwick Library 2nd Floor,Quiet,2025-10-15,14:30,Study room
student_center_noisy.wav,Johnson Center Food Court,Noisy,2025-10-15,12:00,Lunch rush
```

---

## 🎯 Next Steps

After validating the prototype:

1. **Collect Training Data** (Step 0.3)
   - 10+ samples per category (Quiet, Normal, Noisy)
   - Diverse campus locations
   - Different times of day

2. **Train ML Classifier** (Step 0.4)
   - Use collected samples
   - Train Random Forest or SVM
   - Achieve >75% accuracy

3. **Port to Mobile** (Phase 1)
   - Implement in TypeScript for React Native
   - Optimize for real-time processing
   - Add microphone capture

---

## 🐛 Troubleshooting

### **Import Error: No module named 'librosa'**
```bash
pip install -r requirements.txt
```

### **Audio file not loading**
- Ensure file is WAV or MP3 format
- Check file path is correct
- Try absolute path: `python audio_processor.py C:/full/path/to/file.wav`

### **Weird dB values (e.g., negative or >120 dB)**
- The calibration offset (94 dB in code) may need adjustment
- Record a known sound level (e.g., use smartphone dB meter app)
- Adjust the offset in `calculate_decibels()` method

### **Matplotlib not showing plots**
```bash
# Install tkinter (required for matplotlib GUI)
# Windows: usually included with Python
# Mac: brew install python-tk
# Linux: sudo apt-get install python3-tk
```

---

## 📚 References

- **FFT Algorithm**: https://en.wikipedia.org/wiki/Fast_Fourier_transform
- **Audio Feature Extraction**: Librosa documentation
- **Decibel Calculation**: ITU-R BS.1770 standard
- **Spectral Features**: Tzanetakis & Cook (2002)

---

## ✅ Validation Checklist

- [ ] Audio files load successfully
- [ ] Decibel values are in reasonable range (0-120 dB)
- [ ] FFT produces correct frequency bins
- [ ] Spectral features are calculated
- [ ] Classification matches manual observation (>70% accuracy)
- [ ] Moving average filter smooths data
- [ ] Visualizations display correctly

---

**Questions?** Check the main [PROJECT_PLAN.md](../../PROJECT_PLAN.md) or contact the team.
