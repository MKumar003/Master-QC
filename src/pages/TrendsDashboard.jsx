import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, RefreshCw } from 'lucide-react'
import { fetchTrends } from '../lib/api'
import TrendCard from '../components/TrendCard'

export default function TrendsDashboard() {
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  const loadTrends = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTrends()
      setTrends(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTrends()
  }, [loadTrends])

  // Group trends by category
  const categories = trends.reduce((acc, trend) => {
    if (!acc[trend.category]) acc[trend.category] = []
    acc[trend.category].push(trend)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header flex-between">
        <div>
          <h1>Social Media Trends</h1>
          <p>Daily AI-curated insights to align your creatives with what's popular</p>
        </div>
        <button className="btn btn-secondary" onClick={loadTrends}>
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {Object.keys(categories).length === 0 ? (
        <div className="empty-state">
          <TrendingUp size={48} style={{ marginBottom: 'var(--space-4)', color: 'var(--text-tertiary)' }} />
          <h3>No trends data available</h3>
          <p>The AI is currently gathering today's social media insights. Check back soon.</p>
        </div>
      ) : (
        <div className="flex-col">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)', textTransform: 'capitalize' }}>
                {category} Trends
              </h3>
              <div className="grid-3">
                {items.map(trend => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
