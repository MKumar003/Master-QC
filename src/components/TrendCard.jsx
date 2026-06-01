export default function TrendCard({ trend }) {
  const isHot = trend.popularity >= 80

  return (
    <div className={`trend-card ${isHot ? 'hot' : ''}`}>
      <div className="trend-card-category">{trend.category}</div>
      <div className="trend-card-name">{trend.name}</div>
      <div className="trend-card-desc">{trend.description}</div>
      {trend.hex && (
        <div style={{
          width: '100%', height: '24px', borderRadius: 'var(--radius-sm)',
          background: trend.hex, marginBottom: 'var(--space-3)',
          border: '1px solid var(--border-primary)',
        }}></div>
      )}
      <div className="trend-popularity">
        <div className="trend-popularity-fill" style={{ width: `${trend.popularity}%` }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
        <span className="text-caption">Popularity</span>
        <span className="text-caption" style={{ fontWeight: 600 }}>{trend.popularity}%</span>
      </div>
    </div>
  )
}
