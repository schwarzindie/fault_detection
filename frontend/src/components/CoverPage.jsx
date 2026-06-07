import ISLogo from './ISLogo'
import './CoverPage.css'

const CoverPage = ({ onEnter }) => (
  <div className="cover-page">
    <div className="cover-bg-grid" />
    <div className="cover-glow" />

    <div className="cover-content">
      <div className="cover-stripe">
        <div className="cover-stripe-bar" />
      </div>

      <div className="cover-logo-wrap">
        <ISLogo size={96} amber />
      </div>

      <div className="cover-brand">
        <span className="cover-brand-name">Indieschwarz</span>
        <span className="cover-brand-divider" />
        <span className="cover-brand-sub">Technology</span>
      </div>

      <div className="cover-sysid">SYS-ID: IS-FDS-2026 &nbsp;·&nbsp; REV 1.0.0</div>

      <h1 className="cover-title">
        Machine Fault
        <span className="cover-title-accent">Detection</span>
      </h1>
      <p className="cover-subtitle">Industrial Audio Analysis System</p>

      <div className="cover-readouts">
        <div className="cover-readout">
          <div className="cover-readout-label">System Status</div>
          <div className="cover-readout-value green">ONLINE</div>
        </div>
        <div className="cover-readout">
          <div className="cover-readout-label">Fault Classes</div>
          <div className="cover-readout-value">05</div>
        </div>
        <div className="cover-readout">
          <div className="cover-readout-label">Mode</div>
          <div className="cover-readout-value">ACTIVE</div>
        </div>
        <div className="cover-readout">
          <div className="cover-readout-label">Engine</div>
          <div className="cover-readout-value">AI/ML</div>
        </div>
      </div>

      <button className="cover-cta" onClick={onEnter}>
        <span>Initialize System</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <div className="cover-stripe cover-stripe-bottom">
        <div className="cover-stripe-bar" />
      </div>

      <div className="cover-footer">
        © 2026 Indieschwarz Technology &nbsp;·&nbsp; Confidential
      </div>
    </div>
  </div>
)

export default CoverPage
