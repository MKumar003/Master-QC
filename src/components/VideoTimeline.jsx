import { useState } from 'react'

export default function VideoTimeline({ issues = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const parseTimecode = (tc) => {
    if (!tc) return 0
    const parts = tc.split(':').map(Number)
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    return parts[0] || 0
  }

  const maxTime = Math.max(...issues.map(i => parseTimecode(i.timecode)), 60)

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="video-timeline">
      <div className="video-timeline-bar">
        {issues.map((issue, idx) => {
          const pos = (parseTimecode(issue.timecode) / maxTime) * 100
          return (
            <div
              key={idx}
              className={`timeline-marker ${issue.severity}`}
              style={{ left: `${Math.min(pos, 97)}%` }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {hoveredIdx === idx && (
                <div className="timeline-tooltip">
                  <strong>{issue.timecode}</strong> — {issue.description}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="timeline-labels">
        <span>0:00</span>
        <span>{formatTime(maxTime / 4)}</span>
        <span>{formatTime(maxTime / 2)}</span>
        <span>{formatTime(maxTime * 3 / 4)}</span>
        <span>{formatTime(maxTime)}</span>
      </div>
    </div>
  )
}
