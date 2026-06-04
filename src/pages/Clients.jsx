import { useState, useEffect } from 'react'
import { Plus, Briefcase, Save, Trash2, Edit } from 'lucide-react'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

export default function Clients() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    brandGuidelines: ''
  })

  useEffect(() => {
    loadClients()
  }, [user])

  const loadClients = async () => {
    if (!user) return
    try {
      const clientsRef = collection(db, 'users', user.uid, 'clients')
      const snapshot = await getDocs(clientsRef)
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setClients(clientsData)
    } catch (err) {
      console.error('Error loading clients:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    try {
      if (editingId) {
        const clientRef = doc(db, 'users', user.uid, 'clients', editingId)
        await updateDoc(clientRef, {
          ...formData,
          updatedAt: serverTimestamp()
        })
      } else {
        const clientsRef = collection(db, 'users', user.uid, 'clients')
        await addDoc(clientsRef, {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      
      // Reset form & reload
      setFormData({ name: '', industry: '', brandGuidelines: '' })
      setEditingId(null)
      setShowForm(false)
      loadClients()
    } catch (err) {
      console.error('Error saving client:', err)
      alert('Failed to save client')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (client) => {
    setFormData({
      name: client.name || '',
      industry: client.industry || '',
      brandGuidelines: client.brandGuidelines || ''
    })
    setEditingId(client.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'clients', id))
      loadClients()
    } catch (err) {
      console.error('Error deleting client:', err)
      alert('Failed to delete client')
    }
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
          <h1>Clients Database</h1>
          <p>Manage your clients and their specific brand guidelines for AI QC.</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => {
            setFormData({ name: '', industry: '', brandGuidelines: '' })
            setEditingId(null)
            setShowForm(true)
          }}>
            <Plus size={20} /> Add Client
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>{editingId ? 'Edit Client' : 'New Client'}</h3>
          <form onSubmit={handleSubmit} className="flex-col">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  placeholder="e.g. Nike, Acme Corp"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input 
                  type="text" 
                  name="industry"
                  className="form-input" 
                  placeholder="e.g. Sports Apparel, Tech"
                  value={formData.industry}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Brand Guidelines for AI Analysis</label>
              <textarea 
                name="brandGuidelines"
                className="form-input" 
                rows="5"
                placeholder="List specific rules for the AI to check against. E.g., 'Must use Impact font', 'Primary color is #FF0000', 'Tone should be energetic and youth-focused'."
                value={formData.brandGuidelines}
                onChange={handleInputChange}
              ></textarea>
              <p className="text-caption" style={{ marginTop: 'var(--space-2)' }}>
                These guidelines will be securely passed to the AI whenever you select this client for a QC Report.
              </p>
            </div>

            <div className="flex-between" style={{ marginTop: 'var(--space-2)' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-4)' }}>All Clients</h3>
        
        {clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={48} />
            </div>
            <h3>No clients yet</h3>
            <p>Add your first client to integrate their brand guidelines into your AI QC process.</p>
          </div>
        ) : (
          <div className="flex-col">
            {clients.map((client) => (
              <div key={client.id} className="report-list-item" style={{ alignItems: 'flex-start' }}>
                <div className="report-type-icon" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                  <Briefcase size={20} />
                </div>
                <div className="report-info" style={{ flex: 1 }}>
                  <div className="report-title">{client.name}</div>
                  <div className="report-meta" style={{ marginBottom: 'var(--space-2)' }}>
                    {client.industry && <span>{client.industry}</span>}
                  </div>
                  {client.brandGuidelines && (
                    <div className="text-small" style={{ color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-primary)' }}>
                      <strong>Guidelines: </strong>
                      {client.brandGuidelines}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginLeft: 'var(--space-4)' }}>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleEdit(client)} title="Edit">
                    <Edit size={18} />
                  </button>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(client.id)} title="Delete" style={{ color: 'var(--status-revision)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
