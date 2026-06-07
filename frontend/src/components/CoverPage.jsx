import ISLogo from './ISLogo'
import './CoverPage.css'

const CoverPage = ({ onEnter }) => (
  <div className="cover-page">
    <div className="cover-bg-grid" />
    <div className="cover-glow" />

    <div className="cover-content">
      <div className="cover-logo-wrap">
        <ISLogo size={110} />
      </div>

      <div className="cover-brand">
        <span className="cover-brand-name">INDIESCHWARZ</span>
        <span className="cover-brand-divider" />
        <span className="cover-brand-sub">Technology</span>
      </div>

      <h1 className="cover-title">
        Machine Fault<br />
        <span className="cover-title-accent">Detection System</span>
      </h1>

      <p className="cover-description">
        AI-powered industrial audio analysis for real-time fault classification,
        anomaly detection, and predictive maintenance insights.
      </p>

      <div className="cover-tags">
        <span className="cover-tag">Bearing Wear</span>
        <span className="cover-tag">High Vibration</span>
        <span className="cover-tag">Leakage Detection</span>
        <span className="cover-tag">Unbalanced Rotation</span>
      </div>

      <button className="cover-cta" onClick={onEnter}>
        <span>Launch Application</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <div className="cover-footer">
        <span>© 2026 Indieschwarz Technology</span>
      </div>
    </div>
  </div>
)

export default CoverPage
