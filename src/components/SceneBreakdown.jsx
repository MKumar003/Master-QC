import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function SceneBreakdown({ scenes = [] }) {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {scenes.map((scene, idx) => (
        <div className="scene-item" key={idx}>
          <div className="scene-item-header" onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
            <span className="scene-time">{scene.startTime} → {scene.endTime}</span>
            <span className="scene-description">{scene.description}</span>
            {scene.issues?.length > 0 && (
              <span className="status-badge needs_revision" style={{ fontSize: '10px' }}>
                {scene.issues.length} issue{scene.issues.length > 1 ? 's' : ''}
              </span>
            )}
            <ChevronDown size={16} style={{
              color: 'var(--text-tertiary)',
              transition: 'transform 0.2s',
              transform: openIdx === idx ? 'rotate(180deg)' : 'rotate(0)',
            }} />
          </div>
          {openIdx === idx && scene.issues?.length > 0 && (
            <div className="scene-issues">
              {scene.issues.map((issue, i) => (
                <div className="scene-issue" key={i}>
                  <span style={{
                    color: issue.severity === 'critical' ? 'var(--status-rejected)' :
                           issue.severity === 'warning' ? 'var(--status-revision)' : 'var(--accent-tertiary)'
                  }}>
                    {issue.severity === 'critical' ? '🔴' : issue.severity === 'warning' ? '🟡' : '🔵'}
                  </span>
                  {issue.description}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
