import { Sparkles, Lightbulb } from 'lucide-react'
import ProgressRing from './ProgressRing'

export default function AIAnalysisCard({ analysis, loading }) {
  if (loading) {
    return (
      <div className="ai-analysis-card">
        <div className="ai-analysis-header">
          <span className="ai-badge"><Sparkles size={12} /> AI</span>
          <h3>Analyzing your design...</h3>
        </div>
        <div className="ai-analysis-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="skeleton" style={{ height: 80, width: 80, borderRadius: '50%', margin: '0 auto' }}></div>
            <div className="skeleton" style={{ height: 16, width: '60%' }}></div>
            <div className="skeleton" style={{ height: 16, width: '80%' }}></div>
            <div className="skeleton" style={{ height: 16, width: '40%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  const scores = [
    { label: '🎨 Design Quality', value: analysis.designScore || 0 },
    { label: '🌈 Color Usage', value: analysis.colorScore || 0 },
    { label: '📝 Typography', value: analysis.typographyScore || 0 },
    { label: '📈 Trend Alignment', value: analysis.trendScore || 0 },
  ]

  const getBarClass = (val) => {
    if (val >= 80) return 'excellent'
    if (val >= 60) return 'good'
    if (val >= 40) return 'warning'
    return 'poor'
  }

  return (
    <div className="ai-analysis-card">
      <div className="ai-analysis-header">
        <span className="ai-badge"><Sparkles size={12} /> AI Analysis</span>
        <h3>Design Quality Report</h3>
      </div>
      <div className="ai-analysis-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <ProgressRing percent={analysis.overallScore || 0} size={100} strokeWidth={8} />
          <div>
            <p className="text-h3" style={{ fontWeight: 700 }}>Overall Score</p>
            <p className="text-small">{analysis.summary || 'Analysis complete'}</p>
          </div>
        </div>

        <div className="ai-score-grid">
          {scores.map((s) => (
            <div className="ai-score-item" key={s.label}>
              <div className="ai-score-label">
                {s.label}
                <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{s.value}%</span>
              </div>
              <div className="ai-score-bar">
                <div className={`ai-score-bar-fill ${getBarClass(s.value)}`} style={{ width: `${s.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {analysis.suggestions?.length > 0 && (
          <div className="ai-suggestions">
            <h4 style={{ fontSize: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              <Lightbulb size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Suggestions
            </h4>
            {analysis.suggestions.map((s, i) => (
              <div className="ai-suggestion-item" key={i}>
                <span style={{ color: 'var(--status-revision)' }}>💡</span>
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
