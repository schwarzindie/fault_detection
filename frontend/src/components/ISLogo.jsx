const ISLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="isGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d4ff" />
        <stop offset="100%" stopColor="#0066cc" />
      </linearGradient>
    </defs>
    {/* I bar */}
    <rect x="30" y="20" width="18" height="130" rx="4" fill="url(#isGrad)" />
    {/* S shape */}
    <path
      d="M72 20 H138 Q158 20 158 40 Q158 62 130 72 H100 Q72 72 72 95 Q72 118 100 118 H148"
      stroke="url(#isGrad)" strokeWidth="18" strokeLinecap="round" fill="none"
    />
    <path
      d="M148 118 H82 Q62 118 62 138 Q62 160 90 160 H156"
      stroke="url(#isGrad)" strokeWidth="18" strokeLinecap="round" fill="none"
    />
    {/* Bottom accent line */}
    <rect x="30" y="168" width="144" height="4" rx="2" fill="url(#isGrad)" opacity="0.6" />
  </svg>
)

export default ISLogo
