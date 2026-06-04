import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FilePlus, TrendingUp, User, Sparkles, Briefcase } from 'lucide-react'

export default function Sidebar({ isOpen, onClose }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/clients', label: 'Clients', icon: Briefcase },
    { to: '/reports/new', label: 'New Report', icon: FilePlus },
    { to: '/trends', label: 'Trend Insights', icon: TrendingUp },
  ]

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">QC</div>
          <span className="sidebar-brand-text">Master QC</span>
          <span className="sidebar-brand-ai"><Sparkles size={10} /> AI</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Main</div>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}

          <div className="sidebar-section-title" style={{ marginTop: 'auto' }}>Account</div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <User size={20} />
            Profile
          </NavLink>
        </nav>
      </aside>
    </>
  )
}
