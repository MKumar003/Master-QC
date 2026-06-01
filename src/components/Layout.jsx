import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import AIChatPanel from './AIChatPanel'

export default function Layout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const userInitial = user?.email ? user.email[0].toUpperCase() : '?'

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <header className="app-header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">{userInitial}</div>
              <span>{user?.email}</span>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <Outlet />
      </div>

      <AIChatPanel />
    </div>
  )
}
