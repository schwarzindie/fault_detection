const ISLogo = ({ size = 80, amber = false }) => {
  const id = amber ? 'isGradAmber' : 'isGradCyan'
  const c1 = amber ? '#ffb300' : '#00d4ff'
  const c2 = amber ? '#ff5500' : '#0066cc'

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect x="30" y="20" width="18" height="130" rx="3" fill={`url(#${id})`} />
      <path
        d="M72 20 H138 Q158 20 158 40 Q158 62 130 72 H100 Q72 72 72 95 Q72 118 100 118 H148"
        stroke={`url(#${id})`} strokeWidth="18" strokeLinecap="round" fill="none"
      />
      <path
        d="M148 118 H82 Q62 118 62 138 Q62 160 90 160 H156"
        stroke={`url(#${id})`} strokeWidth="18" strokeLinecap="round" fill="none"
      />
      <rect x="30" y="168" width="144" height="4" rx="2" fill={`url(#${id})`} opacity="0.5" />
    </svg>
  )
}

export default ISLogo
