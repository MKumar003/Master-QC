import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  document.getElementById('root').innerHTML = `
    <div style="color: white; background: #06080f; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
      <h1 style="color: #ef4444; margin-bottom: 10px;">Missing Environment Variables</h1>
      <p style="font-size: 18px; color: #8b949e; max-width: 600px;">
        Firebase is not configured. Please add your <b>VITE_FIREBASE_API_KEY</b> and other Firebase variables to your Vercel Environment Variables, then redeploy.
      </p>
    </div>
  `;
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}
