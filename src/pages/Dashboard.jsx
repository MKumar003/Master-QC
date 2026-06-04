import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Video, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { fetchReports } from '../lib/api'
import StatusBadge from '../components/StatusBadge'
import ProgressRing from '../components/ProgressRing'

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await fetchReports()
        setReports(data || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load reports')
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  const stats = {
    total: reports.length,
    passed: reports.filter(r => r.status === 'pass').length,
    needsRevision: reports.filter(r => r.status === 'needs_revision' || r.status === 'rejected').length,
  }

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
          <h1>Dashboard</h1>
          <p>Overview of your QC reports and projects</p>
        </div>
        <Link to="/reports/new" className="btn btn-primary">
          <Plus size={20} /> New QC Report
        </Link>
      </div>

      <div className="grid-3" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card card-glow stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
            <Video size={24} />
          </div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-label">Total Reports</div>
        </div>
        <div className="card card-glow stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--status-pass-bg)', color: 'var(--status-pass)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-card-value">{stats.passed}</div>
          <div className="stat-card-label">Approved</div>
        </div>
        <div className="card card-glow stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--status-revision-bg)', color: 'var(--status-revision)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-card-value">{stats.needsRevision}</div>
          <div className="stat-card-label">Needs Revision</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>Recent QC Reports</h3>
        
        {error ? (
          <div className="form-error" style={{ justifyContent: 'center', padding: 'var(--space-4)' }}>{error}</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Video size={48} />
            </div>
            <h3>No reports yet</h3>
            <p>Create your first QC report to start analyzing videos and posters.</p>
            <Link to="/reports/new" className="btn btn-primary">
              Create Report
            </Link>
          </div>
        ) : (
          <div className="flex-col">
            {reports.map((report) => (
              <Link to={`/reports/${report.id}`} key={report.id} className="report-list-item">
                <div className={`report-type-icon ${report.type}`}>
                  {report.type === 'video' ? <Video size={20} /> : <ImageIcon size={20} />}
                </div>
                <div className="report-info">
                  <div className="report-title">{report.title}</div>
                  <div className="report-meta">
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <StatusBadge status={report.status} />
                  </div>
                </div>
                <div className="report-score">
                  <ProgressRing percent={report.score || 0} size={44} strokeWidth={4} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
