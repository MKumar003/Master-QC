import { useState } from 'react'
import { User, Key, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, changePassword } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    setSaving(true)
    setError('')
    setMessage('')
    
    try {
      await changePassword(newPassword)
      setMessage('Password updated successfully')
      setNewPassword('')
    } catch (err) {
      setError(err.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile Settings</h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div className="user-avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
              {user?.email?.[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{user?.email}</h3>
              <p className="text-small">Administrator</p>
            </div>
          </div>

          <form className="form-group" onSubmit={handlePasswordChange}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-2)' }}>
              <Key size={16} /> Update Password
            </h4>
            
            <input 
              type="password" 
              className="form-input" 
              placeholder="New Password" 
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            
            {error && <p className="form-error">⚠️ {error}</p>}
            {message && <p style={{ color: 'var(--status-pass)', fontSize: 'var(--font-small)' }}>✅ {message}</p>}
            
            <button type="submit" className="btn btn-primary" disabled={saving || !newPassword} style={{ alignSelf: 'flex-start', marginTop: 'var(--space-2)' }}>
              {saving ? 'Updating...' : 'Save Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
