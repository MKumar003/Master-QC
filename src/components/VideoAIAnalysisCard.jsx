import { Sparkles, Lightbulb, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import ProgressRing from './ProgressRing'
import VideoTimeline from './VideoTimeline'
import AudioWaveform from './AudioWaveform'
import SceneBreakdown from './SceneBreakdown'

export default function VideoAIAnalysisCard({ analysis, loading }) {
  if (loading) {
    return (
      <div className="ai-analysis-card">
        <div className="ai-analysis-header">
          <span className="ai-badge"><Sparkles size={12} /> AI</span>
          <h3>Analyzing your video...</h3>
        </div>
        <div className="ai-analysis-body">
          <div className="processing-status">
            <div className="processing-spinner"></div>
            <p>AI is analyzing video quality, audio, subtitles, and more...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  const categories = [
    { label: '📹 Visual Quality', value: analysis.categoryScores?.visual || 0, icon: '📹' },
    { label: '🔊 Audio Quality', value: analysis.categoryScores?.audio || 0, icon: '🔊' },
    { label: '📝 Content', value: analysis.categoryScores?.content || 0, icon: '📝' },
    { label: '⚙️ Technical', value: analysis.categoryScores?.technical || 0, icon: '⚙️' },
    { label: '📈 Trend Alignment', value: analysis.categoryScores?.trendAlignment || 0, icon: '📈' },
  ]

  const getBarClass = (val) => {
    if (val >= 80) return 'excellent'
    if (val >= 60) return 'good'
    if (val >= 40) return 'warning'
    return 'poor'
  }

  const criticalCount = analysis.timestampedIssues?.filter(i => i.severity === 'critical').length || 0
  const warningCount = analysis.timestampedIssues?.filter(i => i.severity === 'warning').length || 0
  const infoCount = analysis.timestampedIssues?.filter(i => i.severity === 'info').length || 0

  return (
    <div className="ai-analysis-card">
      <div className="ai-analysis-header">
        <span className="ai-badge"><Sparkles size={12} /> AI Video Analysis</span>
        <h3>Video Quality Report</h3>
      </div>
      <div className="ai-analysis-body">
        {/* Overall Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <ProgressRing percent={analysis.overallScore || 0} size={100} strokeWidth={8} />
          <div style={{ flex: 1 }}>
            <p className="text-h3" style={{ fontWeight: 700 }}>Overall Video QC Score</p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
              {criticalCount > 0 && (
                <span className="status-badge rejected">
                  <AlertCircle size={12} /> {criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="status-badge needs_revision">
                  <AlertTriangle size={12} /> {warningCount} Warning
                </span>
              )}
              {infoCount > 0 && (
                <span className="status-badge in_progress">
                  <Info size={12} /> {infoCount} Info
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="ai-score-grid" style={{ marginBottom: 'var(--space-6)' }}>
          {categories.map((c) => (
            <div className="ai-score-item" key={c.label}>
              <div className="ai-score-label">
                {c.label}
                <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{c.value}%</span>
              </div>
              <div className="ai-score-bar">
                <div className={`ai-score-bar-fill ${getBarClass(c.value)}`} style={{ width: `${c.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        {analysis.timestampedIssues?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              📍 Issue Timeline
            </h4>
            <VideoTimeline issues={analysis.timestampedIssues} />
          </div>
        )}

        {/* Audio Quality */}
        {analysis.audioQuality && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              🔊 Audio Analysis
            </h4>
            <AudioWaveform audioData={analysis.audioQuality} />
          </div>
        )}

        {/* Scene Breakdown */}
        {analysis.sceneBreakdown?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h4 style={{ fontSize: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              🎬 Scene Breakdown
            </h4>
            <SceneBreakdown scenes={analysis.sceneBreakdown} />
          </div>
        )}

        {/* Suggestions */}
        {analysis.suggestions?.length > 0 && (
          <div className="ai-suggestions">
            <h4 style={{ fontSize: 'var(--font-body)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              <Lightbulb size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Top Suggestions
            </h4>
            {analysis.suggestions.slice(0, 5).map((s, i) => (
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
