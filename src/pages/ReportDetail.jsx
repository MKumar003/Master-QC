import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Trash2, ArrowLeft } from 'lucide-react'
import { fetchReport, updateReport, deleteReport } from '../lib/api'
import { calculateProgress } from '../lib/checklistData'
import ChecklistSection from '../components/ChecklistSection'
import AIAnalysisCard from '../components/AIAnalysisCard'
import VideoAIAnalysisCard from '../components/VideoAIAnalysisCard'
import ConfirmModal from '../components/ConfirmModal'
import StatusBadge from '../components/StatusBadge'
import ProgressRing from '../components/ProgressRing'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [checklist, setChecklist] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    loadReport()
  }, [id])

  const loadReport = async () => {
    try {
      const data = await fetchReport(id)
      setReport(data)
      setChecklist(data.checklist || {})
    } catch (err) {
      console.error(err)
      alert('Failed to load report')
    } finally {
      setLoading(false)
    }
  }

  const handleItemChange = (sectionKey, itemIdx, updatedItem) => {
    setChecklist(prev => {
      const newSection = { ...prev[sectionKey] }
      newSection.items = [...newSection.items]
      newSection.items[itemIdx] = updatedItem
      return { ...prev, [sectionKey]: newSection }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const score = calculateProgress(checklist)
      let status = report.status
      if (score === 100) status = 'pass'
      else if (status === 'pass' && score < 100) status = 'in_progress'

      await updateReport(id, { checklist, score, status })
      setReport(prev => ({ ...prev, checklist, score, status }))
    } catch (err) {
      console.error(err)
      alert('Failed to save report')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteReport(id)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Failed to delete report')
    }
  }

  if (loading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!report) return <div className="page-container">Report not found.</div>

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')} style={{ marginBottom: 'var(--space-4)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex-between">
          <div>
            <div className="flex-row" style={{ marginBottom: 'var(--space-2)' }}>
              <h1>{report.title}</h1>
              <StatusBadge status={report.status} />
            </div>
            <p>Created on {new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex-row">
            <button className="btn btn-secondary" onClick={() => setShowDelete(true)}>
              <Trash2 size={18} /> Delete
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)', alignItems: 'start' }}>
        <div className="flex-col">
          {report.aiAnalysis && (
            <div style={{ marginBottom: 'var(--space-2)' }}>
              {report.type === 'video' ? (
                <VideoAIAnalysisCard analysis={report.aiAnalysis} />
              ) : (
                <AIAnalysisCard analysis={report.aiAnalysis} />
              )}
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>QC Checklist</h3>
            <div className="flex-col">
              {Object.entries(checklist).map(([key, section]) => (
                <ChecklistSection 
                  key={key}
                  sectionKey={key}
                  section={section}
                  onItemChange={handleItemChange}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-col" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-8))' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Current Score</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
              <ProgressRing percent={report.score || 0} size={140} strokeWidth={12} />
            </div>
            {report.score === 100 && (
              <div className="status-badge pass" style={{ padding: '8px 16px', fontSize: 'var(--font-small)' }}>
                ✅ Ready for Production
              </div>
            )}
          </div>
        </div>
      </div>

      {showDelete && (
        <ConfirmModal 
          title="Delete Report"
          message={`Are you sure you want to delete "${report.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          danger
        />
      )}
    </div>
  )
}
