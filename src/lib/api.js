import { auth } from './firebase'

const API_BASE = '/api'

async function getAuthHeaders() {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

async function apiRequest(endpoint, options = {}) {
  const headers = {
    ...await getAuthHeaders(),
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }

  return res.json()
}

// Reports
export const fetchReports = () => apiRequest('/reports')
export const fetchReport = (id) => apiRequest(`/reports/${id}`)
export const createReport = (data) => apiRequest('/reports', { method: 'POST', body: JSON.stringify(data) })
export const updateReport = (id, data) => apiRequest(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteReport = (id) => apiRequest(`/reports/${id}`, { method: 'DELETE' })
export const updateReportStatus = (id, status) => apiRequest(`/reports/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })

// AI - Image
export const analyzeImage = (formData) => apiRequest('/ai/analyze-image', { method: 'POST', body: formData })
export const analyzeThumbnail = (formData) => apiRequest('/ai/analyze-thumbnail', { method: 'POST', body: formData })

// AI - Video
export const analyzeVideo = (formData) => apiRequest('/ai/analyze-video', { method: 'POST', body: formData })
export const checkVideoStatus = (fileId) => apiRequest(`/ai/video-status/${fileId}`)
export const analyzeVideoAudio = (data) => apiRequest('/ai/analyze-video-audio', { method: 'POST', body: JSON.stringify(data) })
export const analyzeVideoScenes = (data) => apiRequest('/ai/analyze-video-scenes', { method: 'POST', body: JSON.stringify(data) })

// AI - Chat
export const chatWithAI = (data) => apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify(data) })

// AI - Checklist suggestions
export const suggestChecklist = (formData) => apiRequest('/ai/suggest-checklist', { method: 'POST', body: formData })

// Trends
export const fetchTrends = () => apiRequest('/trends/today')
export const fetchTrendColors = () => apiRequest('/trends/colors')
export const fetchTrendFormats = () => apiRequest('/trends/formats')
