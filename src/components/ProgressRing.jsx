export default function ProgressRing({ percent = 0, size = 80, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  const getColor = () => {
    if (percent >= 80) return 'var(--status-pass)'
    if (percent >= 50) return 'var(--accent-primary)'
    if (percent >= 25) return 'var(--status-revision)'
    return 'var(--status-rejected)'
  }

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="progress-ring-text" style={{ fontSize: size > 60 ? 'var(--font-body)' : 'var(--font-caption)' }}>
        {percent}%
      </span>
    </div>
  )
}
