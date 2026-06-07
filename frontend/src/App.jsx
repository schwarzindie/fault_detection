import React, { useState, useRef } from 'react';
import CoverPage from './components/CoverPage';
import ISLogo from './components/ISLogo';
import { Upload, PlayCircle, PauseCircle, FileAudio, Image, CheckCircle, AlertTriangle, BarChart3, Activity, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import './App.css';

function App() {
  const [showCover, setShowCover] = useState(true);
  const [audioFiles, setAudioFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const audioRef = useRef(null);

  const machineTypes = {
    'normal_operation': { color: '#27ae60', label: 'Normal Operation', icon: CheckCircle },
    'high_vibration': { color: '#f39c12', label: 'High Vibration', icon: Activity },
    'bearing_wear': { color: '#e67e22', label: 'Bearing Wear', icon: AlertTriangle },
    'unbalanced_rotation': { color: '#e74c3c', label: 'Unbalanced Rotation', icon: TrendingUp },
    'potential_leakage': { color: '#9b59b6', label: 'Potential Leakage', icon: AlertTriangle }
  };

  const extractMachineType = (filename) => {
    const lower = filename.toLowerCase();
    if (lower.includes('normal')) return 'normal_operation';
    if (lower.includes('vibration')) return 'high_vibration';
    if (lower.includes('bearing')) return 'bearing_wear';
    if (lower.includes('imbalance') || lower.includes('unbalanced')) return 'unbalanced_rotation';
    if (lower.includes('leakage')) return 'potential_leakage';
    return 'unknown';
  };

  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files);
    const audioFileObjects = files.map(file => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: extractMachineType(file.name)
    }));
    setAudioFiles(prev => [...prev, ...audioFileObjects]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFileObjects = files.map(file => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      type: extractMachineType(file.name)
    }));
    setImageFiles(prev => [...prev, ...imageFileObjects]);
  };

  const selectAudio = (audio) => {
    setSelectedAudio(audio);
    setIsPlaying(false);
    
    const matchingImage = imageFiles.find(img => 
      img.type === audio.type && img.name.includes('analysis')
    );

    const mockAnalysis = generateMockAnalysis(audio.type);
    setAnalysisResults({
      ...mockAnalysis,
      analysisImage: matchingImage?.url
    });
  };

  const generateMockAnalysis = (type) => {
    const configs = {
      normal_operation: {
        fault: 'Normal Operation',
        confidence: 87.5,
        anomalyScore: 15.2,
        status: 'healthy',
        features: {
          rms: 0.2847,
          peakAmplitude: 0.7234,
          crestFactor: 2.54,
          zcr: 0.0823,
          std: 0.0956,
          spectralCentroid: 456.3,
          spectralRolloff: 1234.5,
          spectralFlux: 0.0234
        },
        recommendations: [
          'Continue regular monitoring schedule',
          'No immediate maintenance required',
          'Equipment operating within normal parameters'
        ]
      },
      high_vibration: {
        fault: 'High Frequency Vibration',
        confidence: 84.3,
        anomalyScore: 72.8,
        status: 'warning',
        features: {
          rms: 0.4523,
          peakAmplitude: 0.9123,
          crestFactor: 2.01,
          zcr: 0.2145,
          std: 0.1834,
          spectralCentroid: 1567.8,
          spectralRolloff: 3456.2,
          spectralFlux: 0.0789
        },
        recommendations: [
          'Inspect mounting bolts for proper torque',
          'Check for loose components',
          'Schedule vibration analysis within 7 days',
          'Monitor continuously for changes'
        ]
      },
      bearing_wear: {
        fault: 'Bearing Wear Detected',
        confidence: 79.6,
        anomalyScore: 81.4,
        status: 'critical',
        features: {
          rms: 0.3876,
          peakAmplitude: 0.9567,
          crestFactor: 6.78,
          zcr: 0.1456,
          std: 0.2123,
          spectralCentroid: 1123.4,
          spectralRolloff: 2789.6,
          spectralFlux: 0.0923
        },
        recommendations: [
          'Schedule immediate bearing inspection',
          'Plan for bearing replacement',
          'Reduce operating load if possible',
          'Increase monitoring frequency to daily',
          'Order replacement bearings'
        ]
      },
      unbalanced_rotation: {
        fault: 'Unbalanced Rotation',
        confidence: 82.1,
        anomalyScore: 68.5,
        status: 'warning',
        features: {
          rms: 0.3234,
          peakAmplitude: 0.8234,
          crestFactor: 2.89,
          zcr: 0.1234,
          std: 0.1923,
          spectralCentroid: 678.9,
          spectralRolloff: 1987.3,
          spectralFlux: 0.0567
        },
        recommendations: [
          'Perform rotor balancing procedure',
          'Check for uneven wear on components',
          'Inspect for accumulated debris',
          'Schedule balancing within 14 days'
        ]
      },
      potential_leakage: {
        fault: 'Potential Leakage',
        confidence: 76.8,
        anomalyScore: 74.2,
        status: 'warning',
        features: {
          rms: 0.4123,
          peakAmplitude: 0.8456,
          crestFactor: 2.45,
          zcr: 0.1678,
          std: 0.2456,
          spectralCentroid: 1789.2,
          spectralRolloff: 3234.8,
          spectralFlux: 0.1234
        },
        recommendations: [
          'Inspect all seals and gaskets',
          'Check for air or fluid leaks',
          'Monitor for pressure drops',
          'Schedule leak detection test',
          'Review maintenance logs'
        ]
      }
    };

    return configs[type] || configs.normal_operation;
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'status-healthy';
      case 'warning': return 'status-warning';
      case 'critical': return 'status-critical';
      default: return 'status-normal';
    }
  };

  const radarData = analysisResults ? [
    { feature: 'RMS', value: analysisResults.features.rms * 100, fullMark: 100 },
    { feature: 'Peak', value: analysisResults.features.peakAmplitude * 100, fullMark: 100 },
    { feature: 'ZCR', value: analysisResults.features.zcr * 100, fullMark: 30 },
    { feature: 'Std', value: analysisResults.features.std * 100, fullMark: 30 },
    { feature: 'Crest', value: analysisResults.features.crestFactor * 10, fullMark: 100 }
  ] : [];

  const pieData = analysisResults ? [
    { name: 'Confidence', value: parseFloat(analysisResults.confidence), color: '#27ae60' },
    { name: 'Uncertainty', value: 100 - parseFloat(analysisResults.confidence), color: '#ecf0f1' }
  ] : [];

  if (showCover) return <CoverPage onEnter={() => setShowCover(false)} />;

  return (
    <div className="app-container">
      <div className="main-container">
        <div className="header">
          <div className="header-brand">
            <ISLogo size={36} />
            <div className="header-brand-text">
              <span className="header-brand-name">Indieschwarz</span>
              <span className="header-brand-product">Technology</span>
            </div>
          </div>
          <span className="header-title">Machine Fault Detection</span>
          <div className="header-status">
            <div className="header-status-dot" />
            System Online
          </div>
        </div>

        <div className="content">
          {/* Upload Section */}
          <div className="upload-section">
            <div className="upload-box">
              <h2><FileAudio size={20} /> Upload Audio Files (.wav)</h2>
              <label className="upload-area">
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  onChange={handleAudioUpload}
                  className="hidden-input"
                />
                <div className="upload-content">
                  <Upload size={48} />
                  <p>Click to upload audio files</p>
                </div>
              </label>
              <div className="upload-count">Uploaded: {audioFiles.length} file(s)</div>
            </div>

            <div className="upload-box">
              <h2><Image size={20} /> Upload Analysis Images (.png)</h2>
              <label className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden-input"
                />
                <div className="upload-content">
                  <Upload size={48} />
                  <p>Click to upload analysis images</p>
                </div>
              </label>
              <div className="upload-count">Uploaded: {imageFiles.length} file(s)</div>
            </div>
          </div>

          {/* Audio Files List */}
          {audioFiles.length > 0 && (
            <div className="audio-list-section">
              <h2>Available Audio Files</h2>
              <div className="audio-grid">
                {audioFiles.map((audio, idx) => {
                  const machineInfo = machineTypes[audio.type] || { color: '#95a5a6', label: 'Unknown' };
                  const Icon = machineInfo.icon || FileAudio;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectAudio(audio)}
                      className={`audio-card ${selectedAudio?.name === audio.name ? 'selected' : ''}`}
                    >
                      <div className="audio-card-content">
                        <Icon size={24} style={{ color: machineInfo.color }} />
                        <div className="audio-info">
                          <div className="audio-name">{audio.name}</div>
                          <div className="audio-type">{machineInfo.label}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Audio Player */}
          {selectedAudio && (
            <div className="player-section">
              <h2>Audio Player</h2>
              <div className="player-controls">
                <button onClick={togglePlayPause} className="play-button">
                  {isPlaying ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
                </button>
                <div className="player-info">
                  <p className="player-name">{selectedAudio.name}</p>
                  <p className="player-type">{machineTypes[selectedAudio.type]?.label || 'Unknown Type'}</p>
                </div>
              </div>
              <audio
                ref={audioRef}
                src={selectedAudio.url}
                onEnded={() => setIsPlaying(false)}
                className="audio-element"
                controls
              />
            </div>
          )}

          {/* Analysis Results */}
          {analysisResults && (
            <div className="analysis-section">
              <div className={`status-card ${getStatusColor(analysisResults.status)}`}>
                <div className="status-header">
                  <div>
                    <h2>{analysisResults.fault}</h2>
                    <div className="status-metrics">
                      <span><strong>Confidence:</strong> {analysisResults.confidence}%</span>
                      <span><strong>Anomaly Score:</strong> {analysisResults.anomalyScore}%</span>
                    </div>
                  </div>
                  <div className="status-icon">
                    {analysisResults.status === 'healthy' ? '✓' : 
                     analysisResults.status === 'warning' ? '⚠️' : '🚨'}
                  </div>
                </div>

                <div className="progress-bars">
                  <div className="progress-item">
                    <div className="progress-label">
                      <span>Confidence Level</span>
                      <span>{analysisResults.confidence}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill green" style={{ width: `${analysisResults.confidence}%` }} />
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-label">
                      <span>Anomaly Score</span>
                      <span>{analysisResults.anomalyScore}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill red" style={{ width: `${analysisResults.anomalyScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Feature Analysis</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="feature" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Features" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-card">
                  <h3>Confidence Score</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Features */}
              <div className="features-section">
                <h3><BarChart3 size={20} /> Extracted Features</h3>
                <div className="features-grid">
                  {Object.entries(analysisResults.features).map(([key, value]) => (
                    <div key={key} className="feature-card">
                      <div className="feature-label">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="feature-value">
                        {typeof value === 'number' ? value.toFixed(4) : value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations">
                <h3>📋 Maintenance Recommendations</h3>
                <ul>
                  {analysisResults.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Analysis Image */}
              {analysisResults.analysisImage && (
                <div className="image-section">
                  <h3>Detailed Analysis Visualization</h3>
                  <img
                    src={analysisResults.analysisImage}
                    alt="Analysis"
                    className="analysis-image"
                  />
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {audioFiles.length === 0 && (
            <div className="empty-state">
              <FileAudio size={64} />
              <h3>No Files Uploaded Yet</h3>
              <p>Upload your generated audio files from the Python script to view results</p>
              <div className="help-box">
                <p><strong>Expected files from test_data/audio/:</strong></p>
                <ul>
                  <li>normal_operation.wav</li>
                  <li>high_vibration.wav</li>
                  <li>bearing_wear.wav</li>
                  <li>unbalanced_rotation.wav</li>
                  <li>potential_leakage.wav</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;