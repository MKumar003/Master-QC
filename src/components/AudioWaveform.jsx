export default function AudioWaveform({ audioData }) {
  if (!audioData) return null

  // Generate simulated waveform bars based on audio quality data
  const barCount = 50
  const bars = Array.from({ length: barCount }, (_, i) => {
    const height = 20 + Math.random() * 40
    let status = 'good'
    // Simulate issue zones
    if (audioData.hasClipping && (i > barCount * 0.6 && i < barCount * 0.7)) status = 'issue'
    else if (audioData.backgroundNoise === 'high' && i < barCount * 0.15) status = 'warning'
    else if (audioData.hasDistortion && (i > barCount * 0.4 && i < barCount * 0.45)) status = 'issue'
    return { height, status }
  })

  const metrics = [
    { label: 'Clarity', value: audioData.overallClarity || 'Good' },
    { label: 'Background Noise', value: audioData.backgroundNoise || 'Low' },
    { label: 'Volume Balance', value: audioData.volumeBalance || 'Balanced' },
    { label: 'Music/Voice Balance', value: audioData.musicVoiceBalance || 'Good' },
  ]

  return (
    <div>
      <div className="audio-waveform">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`waveform-bar ${bar.status}`}
            style={{ height: `${bar.height}%` }}
          ></div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ fontSize: 'var(--font-caption)' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{m.label}: </span>
            <span style={{ fontWeight: 600 }}>{m.value}</span>
          </div>
        ))}
      </div>
      {(audioData.hasClipping || audioData.hasDistortion || audioData.audioSyncIssues) && (
        <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {audioData.hasClipping && <span className="status-badge rejected">Audio Clipping</span>}
          {audioData.hasDistortion && <span className="status-badge rejected">Distortion</span>}
          {audioData.audioSyncIssues && <span className="status-badge needs_revision">Sync Issue</span>}
        </div>
      )}
    </div>
  )
}
