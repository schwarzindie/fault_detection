"""
Machine Fault Detection - Test Audio Generator & Analyzer
==========================================================

This script:
1. Generates synthetic machine audio for different fault conditions
2. Extracts features from the audio
3. Runs AI classification
4. Displays comprehensive results

Usage:
    python test_simulator.py
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.io import wavfile
from scipy import signal
from scipy import stats
import os

class MachineAudioGenerator:
    """Generate synthetic machine audio for testing"""
    
    def __init__(self, sample_rate=16000, duration=3):
        self.sr = sample_rate
        self.duration = duration
        self.t = np.linspace(0, duration, sample_rate * duration)
        
    def generate_normal(self):
        """Generate normal machine operation sound"""
        print("Generating normal operation audio...")
        
        # Base motor hum (50 Hz)
        audio = 0.3 * np.sin(2 * np.pi * 50 * self.t)
        
        # Harmonics
        audio += 0.15 * np.sin(2 * np.pi * 100 * self.t)
        audio += 0.10 * np.sin(2 * np.pi * 150 * self.t)
        
        # Low background noise
        audio += 0.08 * np.random.randn(len(self.t))
        
        return audio, "normal_operation"
    
    def generate_vibration(self):
        """Generate high vibration fault audio"""
        print("Generating high vibration audio...")
        
        # Base frequency
        audio = 0.3 * np.sin(2 * np.pi * 50 * self.t)
        
        # Strong high-frequency vibrations
        audio += 0.25 * np.sin(2 * np.pi * 1200 * self.t)
        audio += 0.20 * np.sin(2 * np.pi * 1800 * self.t)
        
        # Amplitude modulation (vibration effect)
        vibration = 0.35 * np.sin(2 * np.pi * 25 * self.t)
        audio = audio * (1 + vibration)
        
        # Higher noise level
        audio += 0.15 * np.random.randn(len(self.t))
        
        return audio, "high_vibration"
    
    def generate_bearing_fault(self):
        """Generate bearing wear audio"""
        print("Generating bearing fault audio...")
        
        # Base frequency
        audio = 0.3 * np.sin(2 * np.pi * 50 * self.t)
        audio += 0.15 * np.sin(2 * np.pi * 100 * self.t)
        
        # Multiple harmonics (bearing wear signature)
        audio += 0.18 * np.sin(2 * np.pi * 800 * self.t)
        audio += 0.15 * np.sin(2 * np.pi * 1600 * self.t)
        
        # Periodic impacts (8 Hz bearing fault frequency)
        impact_freq = 8
        for i, t_val in enumerate(self.t):
            if np.sin(2 * np.pi * impact_freq * t_val) > 0.95:
                # Sharp impact with exponential decay
                decay = np.exp(-50 * (t_val % (1/impact_freq)))
                audio[i] += 0.5 * decay
        
        # High noise
        audio += 0.25 * np.random.randn(len(self.t))
        
        return audio, "bearing_wear"
    
    def generate_imbalance(self):
        """Generate rotor imbalance audio"""
        print("Generating imbalance audio...")
        
        # Base frequency with strong fundamental
        audio = 0.35 * np.sin(2 * np.pi * 50 * self.t)
        
        # Harmonics
        audio += 0.20 * np.sin(2 * np.pi * 100 * self.t)
        audio += 0.15 * np.sin(2 * np.pi * 150 * self.t)
        audio += 0.10 * np.sin(2 * np.pi * 200 * self.t)
        
        # Periodic variation (imbalance signature)
        audio = audio * (1 + 0.15 * np.sin(2 * np.pi * 1 * self.t))
        
        # Medium noise
        audio += 0.12 * np.random.randn(len(self.t))
        
        return audio, "unbalanced_rotation"
    
    def generate_leakage(self):
        """Generate leakage fault audio"""
        print("Generating leakage audio...")
        
        # Base frequency
        audio = 0.25 * np.sin(2 * np.pi * 50 * self.t)
        
        # High frequency hiss (leakage signature)
        audio += 0.20 * np.sin(2 * np.pi * 2400 * self.t)
        audio += 0.15 * np.sin(2 * np.pi * 600 * self.t)
        
        # Random bursts (turbulent flow)
        for i in range(len(self.t)):
            if np.random.random() > 0.99:
                audio[i] += 0.3 * np.random.randn()
        
        # Very high noise
        audio += 0.30 * np.random.randn(len(self.t))
        
        return audio, "potential_leakage"
    
    def save_audio(self, audio, filename):
        """Save audio to WAV file"""
        # Normalize to int16 range
        audio_normalized = np.int16(audio / np.max(np.abs(audio)) * 32767)
        wavfile.write(filename, self.sr, audio_normalized)
        print(f"Saved: {filename}")


class FeatureExtractor:
    """Extract features from audio for AI classification"""
    
    def __init__(self, sample_rate=16000):
        self.sr = sample_rate
    
    def extract_all_features(self, audio):
        """Extract comprehensive feature set"""
        features = {}
        
        # Time-domain features
        features['rms'] = np.sqrt(np.mean(audio ** 2))
        features['peak_amplitude'] = np.max(np.abs(audio))
        features['crest_factor'] = features['peak_amplitude'] / (features['rms'] + 1e-10)
        
        # Zero crossing rate
        zero_crossings = np.where(np.diff(np.signbit(audio)))[0]
        features['zcr'] = len(zero_crossings) / len(audio)
        
        # Statistical features
        features['mean'] = np.mean(audio)
        features['std'] = np.std(audio)
        features['skewness'] = stats.skew(audio)
        features['kurtosis'] = stats.kurtosis(audio)
        
        # Frequency domain features
        freq_features = self._extract_frequency_features(audio)
        features.update(freq_features)
        
        return features
    
    def _extract_frequency_features(self, audio):
        """Extract frequency-domain features using FFT"""
        # Compute FFT
        fft_size = 2048
        fft = np.fft.rfft(audio[:fft_size])
        magnitude = np.abs(fft)
        freqs = np.fft.rfftfreq(fft_size, 1/self.sr)
        
        # Spectral centroid
        spectral_centroid = np.sum(freqs * magnitude) / (np.sum(magnitude) + 1e-10)
        
        # Spectral rolloff (85% of energy)
        cumsum = np.cumsum(magnitude)
        rolloff_idx = np.where(cumsum >= 0.85 * cumsum[-1])[0][0]
        spectral_rolloff = freqs[rolloff_idx]
        
        # Spectral flux
        spectral_flux = np.sqrt(np.mean(np.diff(magnitude) ** 2))
        
        # Spectral bandwidth
        spectral_bandwidth = np.sqrt(
            np.sum(((freqs - spectral_centroid) ** 2) * magnitude) / 
            (np.sum(magnitude) + 1e-10)
        )
        
        return {
            'spectral_centroid': spectral_centroid,
            'spectral_rolloff': spectral_rolloff,
            'spectral_flux': spectral_flux,
            'spectral_bandwidth': spectral_bandwidth
        }


class SimpleFaultClassifier:
    """Simple rule-based classifier for fault detection"""
    
    def predict(self, features):
        """Predict fault type based on features"""
        
        # Calculate anomaly score
        anomaly_score = 0
        
        # High frequency content check
        if features['spectral_centroid'] > 800:
            anomaly_score += 0.25
        
        # High vibration check (ZCR)
        if features['zcr'] > 0.15:
            anomaly_score += 0.30
        
        # High crest factor (bearing issues)
        if features['crest_factor'] > 4.5:
            anomaly_score += 0.25
        
        # High variability
        if features['std'] > 0.15:
            anomaly_score += 0.20
        
        # Classify based on scores
        if anomaly_score < 0.45:
            return 'Normal Operation', 0.85, anomaly_score
        
        # Determine specific fault type
        if features['zcr'] > 0.18:
            return 'High Frequency Vibration', 0.82, anomaly_score
        elif features['crest_factor'] > 5.5:
            return 'Bearing Wear', 0.78, anomaly_score
        elif features['std'] > 0.18:
            return 'Unbalanced Rotation', 0.80, anomaly_score
        elif features['spectral_centroid'] > 1200:
            return 'Potential Leakage', 0.75, anomaly_score
        else:
            return 'Unknown Fault', 0.65, anomaly_score


class Visualizer:
    """Visualize audio and analysis results"""
    
    def __init__(self, sample_rate=16000):
        self.sr = sample_rate
    
    def plot_analysis(self, audio, features, prediction, fault_name):
        """Create comprehensive analysis plot"""
        
        fig, axes = plt.subplots(3, 2, figsize=(15, 10))
        fig.suptitle(f'Machine Fault Detection Analysis: {fault_name}', 
                     fontsize=16, fontweight='bold')
        
        # 1. Time-domain waveform
        t = np.linspace(0, len(audio)/self.sr, len(audio))
        axes[0, 0].plot(t, audio, linewidth=0.5)
        axes[0, 0].set_title('Audio Waveform')
        axes[0, 0].set_xlabel('Time (s)')
        axes[0, 0].set_ylabel('Amplitude')
        axes[0, 0].grid(True, alpha=0.3)
        
        # 2. Frequency spectrum
        fft_size = 4096
        fft = np.fft.rfft(audio[:fft_size])
        magnitude = np.abs(fft)
        freqs = np.fft.rfftfreq(fft_size, 1/self.sr)
        axes[0, 1].plot(freqs[:len(freqs)//4], magnitude[:len(magnitude)//4])
        axes[0, 1].set_title('Frequency Spectrum')
        axes[0, 1].set_xlabel('Frequency (Hz)')
        axes[0, 1].set_ylabel('Magnitude')
        axes[0, 1].grid(True, alpha=0.3)
        
        # 3. Spectrogram
        f, t_spec, Sxx = signal.spectrogram(audio, self.sr, nperseg=512)
        axes[1, 0].pcolormesh(t_spec, f, 10 * np.log10(Sxx + 1e-10), 
                              shading='gouraud', cmap='viridis')
        axes[1, 0].set_title('Spectrogram')
        axes[1, 0].set_ylabel('Frequency (Hz)')
        axes[1, 0].set_xlabel('Time (s)')
        axes[1, 0].set_ylim([0, 3000])
        
        # 4. Feature values
        feature_names = ['RMS', 'Peak\nAmp', 'Crest\nFactor', 'ZCR', 
                        'Std\nDev', 'Spec\nCentroid']
        feature_values = [
            features['rms'],
            features['peak_amplitude'],
            features['crest_factor'] / 10,  # Scale for visualization
            features['zcr'] * 10,  # Scale for visualization
            features['std'],
            features['spectral_centroid'] / 1000  # Scale to kHz
        ]
        
        colors = ['green' if v < 0.5 else 'orange' if v < 0.8 else 'red' 
                  for v in feature_values]
        axes[1, 1].bar(range(len(feature_names)), feature_values, color=colors)
        axes[1, 1].set_xticks(range(len(feature_names)))
        axes[1, 1].set_xticklabels(feature_names, rotation=0)
        axes[1, 1].set_title('Extracted Features (Normalized)')
        axes[1, 1].set_ylabel('Value')
        axes[1, 1].grid(True, alpha=0.3, axis='y')
        
        # 5. Classification result
        axes[2, 0].axis('off')
        result_text = f"""
        CLASSIFICATION RESULT
        {'='*40}
        
        Detected Fault: {prediction[0]}
        Confidence: {prediction[1]*100:.1f}%
        Anomaly Score: {prediction[2]*100:.1f}%
        
        Expected: {fault_name.replace('_', ' ').title()}
        Status: {'✓ CORRECT' if fault_name.replace('_', ' ').lower() in prediction[0].lower() or (fault_name == 'normal_operation' and prediction[0] == 'Normal Operation') else '⚠ REVIEW'}
        """
        
        color = 'green' if prediction[0] == 'Normal Operation' else 'red'
        axes[2, 0].text(0.1, 0.5, result_text, fontsize=11, 
                       verticalalignment='center', 
                       family='monospace',
                       bbox=dict(boxstyle='round', facecolor=color, alpha=0.1))
        
        # 6. Feature details table
        axes[2, 1].axis('off')
        feature_text = "FEATURE DETAILS\n" + "="*40 + "\n\n"
        for key, value in features.items():
            if isinstance(value, (int, float)):
                feature_text += f"{key:20s}: {value:.4f}\n"
        
        axes[2, 1].text(0.1, 0.9, feature_text, fontsize=9,
                       verticalalignment='top',
                       family='monospace',
                       bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.3))
        
        plt.tight_layout()
        return fig


def main():
    """Main execution function"""
    
    print("="*60)
    print("MACHINE FAULT DETECTION - TEST SIMULATOR")
    print("="*60)
    print()
    
    # Create output directory
    os.makedirs('test_audio', exist_ok=True)
    os.makedirs('results', exist_ok=True)
    
    # Initialize components
    generator = MachineAudioGenerator(sample_rate=16000, duration=3)
    extractor = FeatureExtractor(sample_rate=16000)
    classifier = SimpleFaultClassifier()
    visualizer = Visualizer(sample_rate=16000)
    
    # Generate all test cases
    test_cases = [
        generator.generate_normal,
        generator.generate_vibration,
        generator.generate_bearing_fault,
        generator.generate_imbalance,
        generator.generate_leakage
    ]
    
    results_summary = []
    
    for test_func in test_cases:
        print()
        print("-"*60)
        
        # Generate audio
        audio, fault_name = test_func()
        
        # Save audio file
        filename = f'test_audio/{fault_name}.wav'
        generator.save_audio(audio, filename)
        
        # Extract features
        print(f"Extracting features from {fault_name}...")
        features = extractor.extract_all_features(audio)
        
        # Classify
        print(f"Running AI classification...")
        prediction = classifier.predict(features)
        
        print(f"\nResult: {prediction[0]}")
        print(f"Confidence: {prediction[1]*100:.1f}%")
        print(f"Anomaly Score: {prediction[2]*100:.1f}%")
        
        # Visualize
        print(f"Generating visualization...")
        fig = visualizer.plot_analysis(audio, features, prediction, fault_name)
        fig.savefig(f'results/{fault_name}_analysis.png', dpi=150, bbox_inches='tight')
        plt.close(fig)
        
        # Store results
        is_correct = (fault_name.replace('_', ' ').lower() in prediction[0].lower() or 
                     (fault_name == 'normal_operation' and prediction[0] == 'Normal Operation'))
        results_summary.append({
            'fault': fault_name,
            'predicted': prediction[0],
            'confidence': prediction[1],
            'correct': is_correct
        })
    
    # Print summary
    print()
    print("="*60)
    print("SUMMARY OF RESULTS")
    print("="*60)
    print()
    print(f"{'Actual Fault':<25} {'Predicted':<25} {'Confidence':<12} {'Status'}")
    print("-"*80)
    
    correct_count = 0
    for result in results_summary:
        status = '✓ CORRECT' if result['correct'] else '✗ INCORRECT'
        if result['correct']:
            correct_count += 1
        print(f"{result['fault']:<25} {result['predicted']:<25} "
              f"{result['confidence']*100:>6.1f}%     {status}")
    
    accuracy = (correct_count / len(results_summary)) * 100
    print()
    print(f"Overall Accuracy: {accuracy:.1f}% ({correct_count}/{len(results_summary)})")
    print()
    print("Files saved in:")
    print(f"  - Audio files: ./test_audio/")
    print(f"  - Analysis plots: ./results/")
    print()
    print("="*60)
    
    # Show one plot
    print("\nDisplaying analysis plots...")
    print("Close the plot windows to continue...")
    
    # Load and show one example
    for result in results_summary:
        img = plt.imread(f'results/{result["fault"]}_analysis.png')
        plt.figure(figsize=(15, 10))
        plt.imshow(img)
        plt.axis('off')
        plt.tight_layout()
        plt.show()


if __name__ == "__main__":
    main()