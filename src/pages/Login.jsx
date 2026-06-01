import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) {
        await signup(email, password)
      } else {
        await login(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.code === 'auth/invalid-credential' ? 'Invalid email or password' :
        err.code === 'auth/email-already-in-use' ? 'Email is already registered' :
        err.code === 'auth/weak-password' ? 'Password should be at least 6 characters' :
        err.code === 'auth/invalid-email' ? 'Please enter a valid email' :
        err.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">QC</div>
          <h1>Master QC</h1>
          <p><Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> AI-Powered Creative Quality Control</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer',
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="form-error" style={{ animation: 'slideUp 0.3s ease' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> : null}
            {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="login-toggle">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setIsSignup(!isSignup); setError('') }}>
            {isSignup ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
